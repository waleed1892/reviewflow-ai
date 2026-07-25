import type { Request } from "express";
import createError from "http-errors";
import type { AuthUser } from "@/types/express";

export function getAuthUser(req: Request): AuthUser {
	if (!req.user) {
		throw createError.InternalServerError(
			"Route must be guarded by authenticate middleware",
		);
	}
	return req.user;
}
