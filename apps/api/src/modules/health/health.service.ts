import { prisma } from "@reviewflow/database";
import { StatusCodes } from "http-status-codes";

export class HealthService {
	constructor(private readonly db = prisma) {}

	public getLiveness = () => {
		return {
			status: StatusCodes.OK,
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			memoryUsage: process.memoryUsage(),
		};
	};

	public getReadiness = async () => {
		try {
			await this.db.$queryRaw`SELECT 1`;
			return {
				status: "READY",
				timestamp: new Date().toISOString(),
				database: "CONNECTED",
			};
		} catch (error) {
			return {
				status: "UNHEALTHY",
				timestamp: new Date().toISOString(),
				database: "DISCONNECTED",
				error:
					error instanceof Error ? error.message : "Unknown database error",
			};
		}
	};
}

export const healthService = new HealthService();
