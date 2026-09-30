import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { loginUser, registerUser, requestPasswordReset } from "@/modules/auth/auth.service";
import { toPublicUser } from "@/modules/users/user.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { token, user } = await registerUser(req.body);
  res.status(201).json({ token, user: toPublicUser(user) });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { token, user } = await loginUser(req.body);
  res.json({ token, user: toPublicUser(user) });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await requestPasswordReset(req.body.email);
  res.json({ message: "If that email is registered, you will receive reset instructions." });
});
