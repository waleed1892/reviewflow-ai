import { prisma } from "@reviewflow/database";
import type { LoginInput, RegisterInput } from "@reviewflow-ai/shared";
import createHttpError from "http-errors";
import { env } from "@/utils/env";
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
	constructor(private readonly db = prisma) {}

	public register = async (data: RegisterInput) => {
		const existingUser = await this.db.user.findUnique({
			where: {
				email: data.email,
			},
		});

		if (existingUser) {
			throw createHttpError.Conflict("User already exists");
		}

		const passwordHash = await hashPassword(data.password);

		const user = await this.db.user.create({
			data: {
				name: data.name,
				email: data.email,
				passwordHash,
			},
		});

		return user;
	};

	public login = async (data: LoginInput, meta: AuthMeta) => {
		const user = await this.db.user.findUniqueOrThrow({
			where: {
				email: data.email,
			},
		});

		const isPasswordValid = await verifyPassword(
			user.passwordHash,
			data.password,
		);

		if (!isPasswordValid) {
			throw createHttpError.Unauthorized("Invalid email or password");
		}

		// 1. Generate Opaque Refresh Token & Cryptographic Family ID
		const rawRefreshToken = generateOpaqueToken();
		const hashedRefreshToken = hashToken(rawRefreshToken);
		const familyId = crypto.randomUUID();
		const expiresAt = new Date(
			Date.now() + env.REFRESH_TOKEN_EXPIRATION * 24 * 60 * 60 * 1000,
		);
		// 2. Persist RefreshSession in PostgreSQL
		const session = await this.db.refreshSession.create({
			data: {
				userId: user.id,
				hashedToken: hashedRefreshToken,
				familyId,
				expiresAt,
				userAgent: meta.userAgent || null,
				ipAddress: meta.ipAddress || null,
			},
		});
		// 3. Issue Short-Lived JWT Access Token
		const accessToken = await generateAccessToken({
			sub: user.id,
			sid: session.id,
		});
		return {
			user: { id: user.id, name: user.name, email: user.email },
			accessToken,
			refreshToken: rawRefreshToken,
		};
	};

	public logout = async (sessionId: string) => {
		await this.db.refreshSession.update({
			where: {
				id: sessionId,
			},
			data: {
				isRevoked: true,
			},
		});
	};

	public logoutAll = async (userId: string) => {
		await this.db.refreshSession.updateMany({
			where: {
				userId: userId,
			},
			data: {
				isRevoked: true,
			},
		});
	};

	public refresh = async (rawRefreshToken: string, meta: AuthMeta) => {
		const hashedRefreshToken = hashToken(rawRefreshToken);

		const session = await this.db.refreshSession.findUniqueOrThrow({
			where: {
				hashedToken: hashedRefreshToken,
			},
		});

		if (!session || session.isRevoked || session.expiresAt < new Date()) {
			if (session) {
				await this.db.refreshSession.updateMany({
					where: { familyId: session.familyId, isRevoked: false },
					data: { isRevoked: true },
				});
			}
			throw createHttpError.Unauthorized("Invalid refresh token");
		}

		const newRawRefreshToken = generateOpaqueToken();
		const newHashedRefreshToken = hashToken(newRawRefreshToken);
		const expiresAt = new Date(
			Date.now() + env.REFRESH_TOKEN_EXPIRATION * 24 * 60 * 60 * 1000,
		);

		await this.db.refreshSession.update({
			where: { id: session.id },
			data: { isRevoked: true },
		});

		const newSession = await this.db.refreshSession.create({
			data: {
				userId: session.userId,
				hashedToken: newHashedRefreshToken,
				familyId: session.familyId,
				expiresAt,
				replacedBySessionId: session.id,
				userAgent: meta.userAgent || null,
				ipAddress: meta.ipAddress || null,
			},
		});

		const user = await this.db.user.findUniqueOrThrow({
			where: { id: session.userId },
		});

		const newAccessToken = await generateAccessToken({
			sub: session.userId,
			sid: newSession.id,
		});

		return {
			accessToken: newAccessToken,
			refreshToken: newRawRefreshToken,
			user,
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
