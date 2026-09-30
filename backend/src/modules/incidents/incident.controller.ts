import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  createIncident,
  listAllIncidents,
  listMyIncidents,
  updateIncidentStatus,
} from "@/modules/incidents/incident.service";

export const postIncident = asyncHandler(async (req: Request, res: Response) => {
  const incident = await createIncident(req.auth!.userId, req.body);
  res.status(201).json(incident);
});

export const getAllIncidents = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await listAllIncidents());
});

export const getMyIncidents = asyncHandler(async (req: Request, res: Response) => {
  res.json(await listMyIncidents(req.auth!.userId));
});

export const patchIncidentStatus = asyncHandler(async (req: Request, res: Response) => {
  const incident = await updateIncidentStatus(req.params.id, req.body.status);
  res.json(incident);
});
