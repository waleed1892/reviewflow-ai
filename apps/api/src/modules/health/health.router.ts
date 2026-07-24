import type { Router as ExpressRouter } from "express";
import { Router } from "express";
import { healthController } from "./health.controller";

const router: ExpressRouter = Router();

router.get("/health", healthController.getLiveness);
router.get("/readiness", healthController.getReadiness);

export { router as healthRouter };
