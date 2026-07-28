import crypto from "node:crypto";
import { type JWTPayload, jwtVerify, SignJWT } from "jose";
import {
	JWSSignatureVerificationFailed,
	JWTClaimValidationFailed,
	JWTExpired,
	JWTInvalid,
} from "jose/errors";
import { env } from "@/utils/env";

interface AccessTokenPayload {
	sub: string;
	sid: string;
}

const secretKey = new TextEncoder().encode(env.JWT_SECRET);

export const generateAccessToken = async (
	payload: AccessTokenPayload,
): Promise<string> => {
	return new SignJWT({
		sid: payload.sid,
	})
		.setProtectedHeader({
			alg: "HS256",
		})
		.setSubject(payload.sub)
		.setIssuer(env.JWT_ISSUER)
		.setAudience(env.JWT_AUDIENCE)
		.setIssuedAt()
		.setExpirationTime(env.JWT_ACCESS_EXPIRATION)
		.setJti(crypto.randomUUID())
		.sign(secretKey);
};

export const verifyAccessToken = async (token: string): Promise<JWTPayload> => {
	try {
		const { payload } = await jwtVerify(token, secretKey, {
			issuer: env.JWT_ISSUER,
			audience: env.JWT_AUDIENCE,
			algorithms: ["HS256"],
		});

		return payload;
	} catch (err) {
		if (err instanceof JWTExpired) {
			throw new JWTExpired("Token has expired", err.payload);
		}
		if (err instanceof JWSSignatureVerificationFailed) {
			throw new JWSSignatureVerificationFailed("Invalid token signature");
		}
		if (err instanceof JWTClaimValidationFailed) {
			throw new JWTClaimValidationFailed(
				"Token validation failed",
				err.payload,
				err.claim,
				err.reason,
			);
		}
		if (err instanceof JWTInvalid) {
			throw new JWTInvalid("Malformed token");
		}
		throw err;
	}
};

export function generateOpaqueToken(): string {
	return crypto.randomBytes(32).toString("hex");
}

export const hashToken = (token: string): string => {
	return crypto.createHash("sha256").update(token).digest("hex");
};
