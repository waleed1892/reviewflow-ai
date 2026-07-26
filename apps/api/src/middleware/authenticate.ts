import { prisma } from "@reviewflow/database";
import type { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { AUTH_COOKIES } from "@/modules/auth/auth.constants";
import { verifyAccessToken } from "@/modules/auth/utils/token";

const isString = (value: unknown): value is string => typeof value === "string";

export async function authenticate(
	req: Request,
	_: Response,
	next: NextFunction,
) {
	try {
		const token =
			req.cookies?.[AUTH_COOKIES.ACCESS_TOKEN] ||
			req.headers.authorization?.replace("Bearer ", "");

		if (!token) {
			throw createError.Unauthorized("Authentication token required");
		}

		const { sub, sid } = await verifyAccessToken(token);

		if (!sub || !sid || !isString(sub) || !isString(sid)) {
			throw createError.Unauthorized("Invalid authentication token");
		}

		const session = await prisma.refreshSession.findUnique({
			where: { id: sid },
		});

		if (!session || session.is_revoked || session.expires_at < new Date()) {
			throw createError.Unauthorized("Session has been revoked or expired");
		}

		req.user = { id: sub, sid };

		next();
	} catch {
		next(createError.Unauthorized("Invalid or expired authentication token"));
	}
}
