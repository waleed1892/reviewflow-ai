// apps/api/src/modules/health/health.controller.ts
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { healthService } from "./health.service";

export class HealthController {
	constructor(private readonly service = healthService) {}

	public getLiveness = (_req: Request, res: Response): void => {
		const health = this.service.getLiveness();
		res.status(StatusCodes.OK).json(health);
	};

	public getReadiness = async (_req: Request, res: Response): Promise<void> => {
		const readiness = await this.service.getReadiness();

		if (readiness.status === "UNHEALTHY") {
			res.status(StatusCodes.SERVICE_UNAVAILABLE).json(readiness);
			return;
		}

		res.status(StatusCodes.OK).json(readiness);
	};
}

export const healthController = new HealthController();
