import { Router } from "express";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validate.middleware";
import {
  getAllIncidents,
  getMyIncidents,
  patchIncidentStatus,
  postIncident,
} from "@/modules/incidents/incident.controller";
import {
  createIncidentSchema,
  updateIncidentStatusSchema,
} from "@/modules/incidents/incident.schema";

export const incidentRouter = Router();

incidentRouter.use(requireAuth);
incidentRouter.post("/", validateBody(createIncidentSchema), postIncident);
incidentRouter.get("/mine", getMyIncidents);
incidentRouter.get("/", requireRole("SECURITY", "ADMIN"), getAllIncidents);
incidentRouter.patch(
  "/:id/status",
  requireRole("SECURITY", "ADMIN"),
  validateBody(updateIncidentStatusSchema),
  patchIncidentStatus,
);
