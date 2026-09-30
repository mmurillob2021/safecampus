import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  createAlert,
  listActiveAlerts,
  listMyAlerts,
  resolveAlert,
} from "@/modules/alerts/alert.service";

export const postAlert = asyncHandler(async (req: Request, res: Response) => {
  const alert = await createAlert(req.auth!.userId, req.body);
  res.status(201).json(alert);
});

export const patchResolveAlert = asyncHandler(async (req: Request, res: Response) => {
  const alert = await resolveAlert(req.params.id);
  res.json(alert);
});

export const getActiveAlerts = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await listActiveAlerts());
});

export const getMyAlerts = asyncHandler(async (req: Request, res: Response) => {
  res.json(await listMyAlerts(req.auth!.userId));
});
