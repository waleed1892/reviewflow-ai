import type { Router as ExpressRouter } from "express";
import { Router } from "express";
import { healthRouter } from "./modules/health/health.router";

const mainRouter: ExpressRouter = Router();

const routers = [healthRouter];

for (const router of routers) {
	mainRouter.use(router);
}

export { mainRouter };
