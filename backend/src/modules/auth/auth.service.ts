import { prisma } from "@/config/prisma";
import { ApiError } from "@/utils/apiError";
import { comparePassword, hashPassword } from "@/utils/password";
import { signAuthToken } from "@/utils/jwt";
import type { LoginInput, RegisterInput } from "@/modules/auth/auth.schema";

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw ApiError.conflict("Email is already registered");

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      studentId: input.studentId,
      phone: input.phone,
    },
  });

  const token = signAuthToken({ userId: user.id, role: user.role });
  return { token, user };
}

/**
 * MVP stub: no email transport is wired up yet, so this only confirms the
 * account exists. Always responds the same way to avoid leaking which
 * emails are registered; wire up a mailer + reset token table to finish it.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  await prisma.user.findUnique({ where: { email } });
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw ApiError.unauthorized("Invalid credentials");

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) throw ApiError.unauthorized("Invalid credentials");

  const token = signAuthToken({ userId: user.id, role: user.role });
  return { token, user };
}
