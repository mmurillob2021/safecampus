import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ApiError } from "@/utils/apiError";

export function notFoundMiddleware(_req: Request, res: Response) {
  res.status(404).json({ message: "Route not found" });
}

/** Maps common Prisma errors to HTTP responses instead of a generic 500. */
function fromPrismaError(err: Prisma.PrismaClientKnownRequestError): ApiError | null {
  switch (err.code) {
    case "P2002":
      return ApiError.conflict("Ya existe un registro con ese valor único");
    case "P2003":
      return ApiError.conflict("El registro está en uso por otros datos; desactívalo en lugar de borrarlo");
    case "P2025":
      return ApiError.notFound("Registro no encontrado");
    default:
      return null;
  }
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const apiError =
    err instanceof ApiError
      ? err
      : err instanceof Prisma.PrismaClientKnownRequestError
        ? fromPrismaError(err)
        : null;
  if (apiError) {
    return res.status(apiError.statusCode).json({ message: apiError.message });
  }
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
}
