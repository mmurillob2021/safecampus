import { Router } from "express";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import {
  deleteTableRow,
  getConfig,
  getTableRows,
  getTables,
  patchTableRow,
  postTableRow,
} from "@/modules/config/config.controller";

export const configRouter = Router();

configRouter.use(requireAuth);

// Any signed-in user: active catalogs + settings used to render the app.
configRouter.get("/", getConfig);

// Admin only: parameterise the tables listed in config.registry.ts.
configRouter.use("/tables", requireRole("ADMIN"));
configRouter.get("/tables", getTables);
configRouter.get("/tables/:table", getTableRows);
configRouter.post("/tables/:table", postTableRow);
configRouter.patch("/tables/:table/:id", patchTableRow);
configRouter.delete("/tables/:table/:id", deleteTableRow);
