import { Router } from "express";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validate.middleware";
import {
  getActiveAlerts,
  getMyAlerts,
  patchResolveAlert,
  postAlert,
} from "@/modules/alerts/alert.controller";
import { createAlertSchema } from "@/modules/alerts/alert.schema";

export const alertRouter = Router();

alertRouter.use(requireAuth);
alertRouter.post("/", validateBody(createAlertSchema), postAlert);
alertRouter.get("/mine", getMyAlerts);
alertRouter.get("/", requireRole("SECURITY", "ADMIN"), getActiveAlerts);
alertRouter.patch("/:id/resolve", requireRole("SECURITY", "ADMIN"), patchResolveAlert);
