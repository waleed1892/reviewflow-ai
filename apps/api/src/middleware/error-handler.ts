import type { Request, Response } from "express";
import { isHttpError } from "http-errors";
import { StatusCodes } from "http-status-codes";

export const globalErrorHandler = (
	err: Error,
	_req: Request,
	res: Response,
) => {
	if (isHttpError(err)) {
		res.status(err.statusCode).json({
			message: err.message,
		});
	}

	// Unexpected runtime crashes (500)
	console.error("🔥 Unexpected System Crash:", err);
	res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
		success: false,
		error: {
			code: "INTERNAL_SERVER_ERROR",
			message:
				process.env.NODE_ENV === "production"
					? "An internal server error occurred"
					: err.message,
		},
	});
};
