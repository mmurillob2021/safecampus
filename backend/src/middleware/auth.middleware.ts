import type { NextFunction, Request, Response } from "express";
import type { Role } from "@/types/domain";
import { ApiError } from "@/utils/apiError";
import { verifyAuthToken } from "@/utils/jwt";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: { userId: string; role: Role };
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Missing bearer token");
  }
  const token = header.slice("Bearer ".length);
  req.auth = verifyAuthToken(token);
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      throw ApiError.forbidden("You do not have access to this resource");
    }
    next();
  };
}
