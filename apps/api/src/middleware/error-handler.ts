import type { NextFunction, Request, Response } from "express";
import { isHttpError } from "http-errors";
import { StatusCodes } from "http-status-codes";
import { env } from "@/utils/env";
import { logger } from "@/utils/logger";

export const globalErrorHandler = (
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	if (isHttpError(err)) {
		return res.status(err.statusCode).json({
			message: err.message,
		});
	}

	// Unexpected runtime crashes (500)
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
