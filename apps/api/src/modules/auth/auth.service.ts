import { prisma } from "@reviewflow/database";
import type { LoginInput, RegisterInput } from "@reviewflow-ai/shared";
import createHttpError from "http-errors";
import { env } from "@/utils/env";
import { organizationService as orgService } from "../organization/organization.service";
import { userRepository as userRepo } from "../user/user.repository";
import { hashPassword, verifyPassword } from "./utils/password";
import {
	generateAccessToken,
	generateOpaqueToken,
	hashToken,
} from "./utils/token";

export interface AuthMeta {
	userAgent?: string | undefined;
	ipAddress?: string | undefined;
}

export class AuthService {
	constructor(
		private readonly db = prisma,
		private readonly organizationService = orgService,
		private readonly userRepository = userRepo,
	) {}

	public register = async (data: RegisterInput) => {
		return this.db.$transaction(async (tx) => {
			const existingUser = await tx.user.findUnique({
				where: {
					email: data.email,
				},
			});

			if (existingUser) {
				throw createHttpError.Conflict("User already exists");
			}

			const passwordHash = await hashPassword(data.password);

			const user = await tx.user.create({
				data: {
					name: data.name,
					email: data.email,
					password_hash: passwordHash,
				},
			});

			const { organization, member } =
				await this.organizationService.createOrganization(tx, {
					name: data.name,
					userId: user.id,
				});

			return {
				user,
				organization,
				member,
			};
		});
	};

	public login = async (data: LoginInput, meta: AuthMeta) => {
		const user = await this.userRepository.findByEmailForLogin(data.email);

		const isPasswordValid = await verifyPassword(
			user.password_hash,
			data.password,
		);

		if (!isPasswordValid) {
			throw createHttpError.Unauthorized("Invalid email or password");
		}

		const rawRefreshToken = generateOpaqueToken();
		const hashedRefreshToken = hashToken(rawRefreshToken);
		const familyId = crypto.randomUUID();
		const expiresAt = new Date(
			Date.now() + env.REFRESH_TOKEN_EXPIRATION * 24 * 60 * 60 * 1000,
		);

		const session = await this.db.refreshSession.create({
			data: {
				user_id: user.id,
				hashed_token: hashedRefreshToken,
				family_id: familyId,
				expires_at: expiresAt,
				user_agent: meta.userAgent || null,
				ip_address: meta.ipAddress || null,
			},
		});

		const accessToken = await generateAccessToken({
			sub: user.id,
			sid: session.id,
		});

		return {
			user: user,
			access_token: accessToken,
			refresh_token: rawRefreshToken,
		};
	};

	public logout = async (sessionId: string) => {
		await this.db.refreshSession.update({
			where: {
				id: sessionId,
			},
			data: {
				is_revoked: true,
			},
		});
	};

	public logoutAll = async (userId: string) => {
		await this.db.refreshSession.updateMany({
			where: {
				user_id: userId,
			},
			data: {
				is_revoked: true,
			},
		});
	};

	public refresh = async (rawRefreshToken: string, meta: AuthMeta) => {
		const hashedRefreshToken = hashToken(rawRefreshToken);

		const session = await this.db.refreshSession.findUniqueOrThrow({
			where: {
				hashed_token: hashedRefreshToken,
			},
		});

		if (session.is_revoked || session.expires_at < new Date()) {
			await this.db.refreshSession.updateMany({
				where: { family_id: session.family_id, is_revoked: false },
				data: { is_revoked: true },
			});

			throw createHttpError.Unauthorized("Invalid refresh token");
		}

		const newRawRefreshToken = generateOpaqueToken();
		const newHashedRefreshToken = hashToken(newRawRefreshToken);
		const expiresAt = new Date(
			Date.now() + env.REFRESH_TOKEN_EXPIRATION * 24 * 60 * 60 * 1000,
		);

		await this.db.refreshSession.update({
			where: { id: session.id },
			data: { is_revoked: true },
		});

		const newSession = await this.db.refreshSession.create({
			data: {
				user_id: session.user_id,
				hashed_token: newHashedRefreshToken,
				family_id: session.family_id,
				expires_at: expiresAt,
				replaced_by_session_id: session.id,
				user_agent: meta.userAgent || null,
				ip_address: meta.ipAddress || null,
			},
		});

		const user = await this.db.user.findUniqueOrThrow({
			where: { id: session.user_id },
		});

		const newAccessToken = await generateAccessToken({
			sub: session.user_id,
			sid: newSession.id,
		});

		return {
			access_token: newAccessToken,
			refresh_token: newRawRefreshToken,
			user: user,
		};
	};

	public me = async (id: string) => {
		const user = await this.db.user.findUniqueOrThrow({
			where: { id },
		});

		return user;
	};
}

export const authService = new AuthService();
