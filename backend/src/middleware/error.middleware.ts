import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/utils/apiError";

export function notFoundMiddleware(_req: Request, res: Response) {
  res.status(404).json({ message: "Route not found" });
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
}
