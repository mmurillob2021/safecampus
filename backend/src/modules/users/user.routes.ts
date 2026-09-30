import { Router } from "express";
import { requireAuth } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validate.middleware";
import { getMe, updateMe } from "@/modules/users/user.controller";
import { updateProfileSchema } from "@/modules/users/user.schema";

export const userRouter = Router();

userRouter.use(requireAuth);
userRouter.get("/me", getMe);
userRouter.patch("/me", validateBody(updateProfileSchema), updateMe);
