// apps/api/src/modules/health/health.controller.ts
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendErrorResponse, sendSuccessResponse } from "@/utils/response";
import { healthService } from "./health.service";

export class HealthController {
	constructor(private readonly service = healthService) {}

	public getLiveness = (_req: Request, res: Response): void => {
		const health = this.service.getLiveness();
		sendSuccessResponse(res, health, StatusCodes.OK);
	};

	public getReadiness = async (_req: Request, res: Response): Promise<void> => {
		const readiness = await this.service.getReadiness();

		if (readiness.status === "UNHEALTHY") {
			sendErrorResponse(
				res,
				"Database connection failed",
				StatusCodes.SERVICE_UNAVAILABLE,
			);
			return;
		}

		sendSuccessResponse(res, readiness, StatusCodes.OK);
	};
}

export const healthController = new HealthController();
