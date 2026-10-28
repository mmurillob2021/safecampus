import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

/**
 * SQLite tuning: WAL lets reads run while a write is in progress, and
 * foreign keys are enforced so parameter rows in use cannot be deleted.
 */
export async function initDatabase() {
  await prisma.$queryRawUnsafe("PRAGMA journal_mode = WAL;");
  await prisma.$queryRawUnsafe("PRAGMA foreign_keys = ON;");
  await prisma.$queryRawUnsafe("PRAGMA busy_timeout = 5000;");
}
