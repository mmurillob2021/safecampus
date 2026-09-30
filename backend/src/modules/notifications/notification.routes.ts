import { Router } from "express";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validate.middleware";
import {
  getNotifications,
  patchNotificationRead,
  postNotification,
} from "@/modules/notifications/notification.controller";
import { createNotificationSchema } from "@/modules/notifications/notification.schema";

export const notificationRouter = Router();

notificationRouter.use(requireAuth);
notificationRouter.get("/", getNotifications);
notificationRouter.patch("/:id/read", patchNotificationRead);
notificationRouter.post(
  "/",
  requireRole("SECURITY", "ADMIN"),
  validateBody(createNotificationSchema),
  postNotification,
);
