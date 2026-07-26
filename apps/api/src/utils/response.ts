import type { Response } from "express";

export const sendSuccessResponse = <T>(
	res: Response,
	data: T,
	status: number = 200,
) => {
	res.status(status).json({
		success: true,
		data: data,
	});
};

export const sendErrorResponse = (
	res: Response,
	message: string,
	status: number = 500,
) => {
	res.status(status).json({
		success: false,
		message: message,
	});
};
