import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { getUserById, toPublicUser, updateProfile } from "@/modules/users/user.service";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUserById(req.auth!.userId);
  res.json(toPublicUser(user));
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateProfile(req.auth!.userId, req.body);
  res.json(toPublicUser(user));
});
