import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  createNotification,
  listNotifications,
  markNotificationRead,
} from "@/modules/notifications/notification.service";

export const postNotification = asyncHandler(async (req: Request, res: Response) => {
  const notification = await createNotification(req.body);
  res.status(201).json(notification);
});

export const getNotifications = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await listNotifications());
});

export const patchNotificationRead = asyncHandler(async (req: Request, res: Response) => {
  await markNotificationRead(req.params.id, req.auth!.userId);
  res.status(204).send();
});
