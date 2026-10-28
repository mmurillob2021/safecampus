import { Router } from "express";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validate.middleware";
import { verifyAccessPassSchema } from "@/modules/access/access.schema";
import {
  getActivePass,
  getAllPasses,
  getMyPasses,
  postAccessPass,
  postVerifyPass,
} from "@/modules/access/access.controller";

export const accessRouter = Router();

accessRouter.use(requireAuth);
accessRouter.post("/", postAccessPass);
accessRouter.get("/active", getActivePass);
accessRouter.get("/mine", getMyPasses);
accessRouter.get("/", requireRole("SECURITY", "ADMIN"), getAllPasses);
accessRouter.post("/verify", requireRole("SECURITY", "ADMIN"), validateBody(verifyAccessPassSchema), postVerifyPass);
