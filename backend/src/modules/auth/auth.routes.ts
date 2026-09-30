import { Router } from "express";
import { forgotPassword, login, register } from "@/modules/auth/auth.controller";
import { validateBody } from "@/middleware/validate.middleware";
import { forgotPasswordSchema, loginSchema, registerSchema } from "@/modules/auth/auth.schema";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/forgot-password", validateBody(forgotPasswordSchema), forgotPassword);
