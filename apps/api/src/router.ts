import type { Router as ExpressRouter } from "express";
import { Router } from "express";
import { authRouter } from "./modules/auth/auth.router";
import { healthRouter } from "./modules/health/health.router";

const mainRouter: ExpressRouter = Router();

mainRouter.use("/health", healthRouter);
mainRouter.use("/auth", authRouter);

export { mainRouter };
