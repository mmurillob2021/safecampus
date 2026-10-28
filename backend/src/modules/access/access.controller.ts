import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiError } from "@/utils/apiError";
import { listAccessPassesQuerySchema } from "@/modules/access/access.schema";
import {
  assertValidDate,
  createAccessPass,
  getActiveAccessPass,
  listAccessPasses,
  listMyAccessPasses,
  verifyAccessPass,
} from "@/modules/access/access.service";

export const postAccessPass = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json(await createAccessPass(req.auth!.userId));
});

export const getActivePass = asyncHandler(async (req: Request, res: Response) => {
  res.json({ pass: await getActiveAccessPass(req.auth!.userId) });
});

export const getMyPasses = asyncHandler(async (req: Request, res: Response) => {
  res.json(await listMyAccessPasses(req.auth!.userId));
});

export const getAllPasses = asyncHandler(async (req: Request, res: Response) => {
  const query = listAccessPassesQuerySchema.safeParse(req.query);
  if (!query.success) throw ApiError.badRequest(query.error.issues.map((i) => i.message).join(", "));
  assertValidDate(query.data.date);
  res.json(await listAccessPasses(query.data.date));
});

export const postVerifyPass = asyncHandler(async (req: Request, res: Response) => {
  res.json(await verifyAccessPass(req.body.code));
});
