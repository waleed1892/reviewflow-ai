import type { NextFunction, Request, Response } from "express";
import { isHttpError } from "http-errors";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { env } from "@/utils/env";
import { logger } from "@/utils/logger";
import { formatZodError } from "@/utils/zod-format";

export const globalErrorHandler = (
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	// 1. Handle Zod Validation Errors (422 Unprocessable Entity)
	if (err instanceof ZodError) {
		return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "Invalid request payload",
				details: formatZodError(err),
			},
		});
	}

	// 2. Handle HTTP Errors (401 Unauthorized, 409 Conflict, etc.)
	if (isHttpError(err)) {
		return res.status(err.statusCode).json({
			success: false,
			error: {
				code: err.name.toUpperCase().replace(/\s+/g, "_"),
				message: err.message,
			},
		});
	}

	// 3. Unexpected System Crashes (500)
	logger.error({ err }, "🔥 Unexpected System Crash");

	return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
		success: false,
		error: {
			code: "INTERNAL_SERVER_ERROR",
			message:
				env.NODE_ENV === "production"
					? "An internal server error occurred"
					: err.message,
		},
	});
};
