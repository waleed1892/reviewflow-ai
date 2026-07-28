import type { Router as ExpressRouter } from "express";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { withTenantContext } from "@/middleware/tenant-context";
import { documentController } from "./document.controller";

const router: ExpressRouter = Router();

const middlewares = [authenticate, withTenantContext];

router.get("/", middlewares, documentController.getDocuments);
router.get("/:id", middlewares, documentController.getDocument);
router.post("/", middlewares, documentController.createDocument);
router.patch("/:id", middlewares, documentController.updateDocument);
router.delete("/:id", middlewares, documentController.deleteDocument);

export { router as documentRouter };
