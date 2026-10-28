import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import type { Role } from "@/types/domain";

export interface AuthTokenPayload {
  userId: string;
  role: Role;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  const options: jwt.SignOptions = { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] };
  return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
}
