import type { Router as ExpressRouter } from "express";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { authController } from "./auth.controller";

const router: ExpressRouter = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);

router.post("/refresh", authenticate, authController.refreshToken);
router.post("/logout", authenticate, authController.logout);
router.post("/logout/all", authenticate, authController.logoutAll);

export { router as authRouter };
