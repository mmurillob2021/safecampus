import type { User } from "@prisma/client";
import { prisma } from "@/config/prisma";
import { ApiError } from "@/utils/apiError";

export type PublicUser = Omit<User, "passwordHash">;

export function toPublicUser(user: User): PublicUser {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

export async function getUserById(userId: string): Promise<User> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound("User not found");
  return user;
}

export interface UpdateProfileInput {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  return prisma.user.update({ where: { id: userId }, data: input });
}
