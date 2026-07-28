import { orgContext } from "@reviewflow/database";
import type { NextFunction, Request, Response } from "express";
import createError from "http-errors";

export async function withTenantContext(
	req: Request,
	_res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const organizationId = req.headers["x-organization-id"] as string;

		if (!organizationId) {
			throw createError.BadRequest(
				"Organization context header ('x-organization-id') required",
			);
		}

		orgContext.run(organizationId, next);
	} catch (error) {
		next(error);
	}
}
