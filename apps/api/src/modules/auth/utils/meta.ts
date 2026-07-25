import type { Request } from "express";

export function getAuthMeta(req: Request) {
	return {
		userAgent: req.headers["user-agent"],
		ipAddress: req.ip,
	};
}
