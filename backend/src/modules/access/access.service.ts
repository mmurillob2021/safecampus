import { randomBytes } from "crypto";
import type { AccessPass } from "@prisma/client";
import { prisma } from "@/config/prisma";
import { ApiError } from "@/utils/apiError";
import { QR_PREFIX } from "@/modules/access/access.schema";

const DEFAULTS = {
  minutes: 5,
  zoneName: "Ingreso al campus",
  zoneDetail: null as string | null,
  timeZone: "America/Bogota",
};
const MAX_MINUTES = 24 * 60;

/** Pass settings from the config module (AppSetting), with safe fallbacks. */
async function readPassSettings() {
  const rows = await prisma.appSetting.findMany({
    where: { key: { in: ["access.pass.minutes", "access.zone.name", "access.zone.detail", "campus.timezone"] } },
  });
  const get = (key: string) => rows.find((r) => r.key === key)?.value?.trim() || undefined;
  const minutes = Number(get("access.pass.minutes"));
  return {
    minutes: Number.isFinite(minutes) && minutes > 0 ? Math.min(minutes, MAX_MINUTES) : DEFAULTS.minutes,
    zoneName: get("access.zone.name") ?? DEFAULTS.zoneName,
    zoneDetail: get("access.zone.detail") ?? DEFAULTS.zoneDetail,
    timeZone: get("campus.timezone") ?? DEFAULTS.timeZone,
  };
}

/** "2026-10-20" and "20:16:05" in the campus timezone (UTC if the setting is invalid). */
export function formatDateTime(date: Date, timeZone: string) {
  const format = (tz: string) => ({
    date: new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(date),
    time: new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).format(date),
  });
  try {
    return format(timeZone);
  } catch {
    return format("UTC");
  }
}

/** Shape sent to the app: the QR text plus the server clock for the countdown. */
function toClientPass(pass: AccessPass) {
  const { userId: _userId, ...rest } = pass;
  return { ...rest, qrValue: `${QR_PREFIX}${pass.token}`, serverTime: new Date() };
}

const activeWhere = (userId: string) => ({
  userId,
  revokedAt: null,
  usedAt: null,
  expiresAt: { gt: new Date() },
});

/**
 * Issues a new QR pass. Every call inserts a row, so the table doubles as the
 * log of each request (requestDate / requestTime). A still-valid previous pass
 * is revoked so only one QR works at a time.
 */
export async function createAccessPass(userId: string) {
  const settings = await readPassSettings();
  const now = new Date();
  const { date, time } = formatDateTime(now, settings.timeZone);

  const pass = await prisma.$transaction(async (tx) => {
    await tx.accessPass.updateMany({ where: activeWhere(userId), data: { revokedAt: now } });
    return tx.accessPass.create({
      data: {
        userId,
        token: randomBytes(24).toString("base64url"),
        zoneName: settings.zoneName,
        zoneDetail: settings.zoneDetail,
        requestedAt: now,
        requestDate: date,
        requestTime: time,
        expiresAt: new Date(now.getTime() + settings.minutes * 60_000),
      },
    });
  });
  return toClientPass(pass);
}

export async function getActiveAccessPass(userId: string) {
  const pass = await prisma.accessPass.findFirst({
    where: activeWhere(userId),
    orderBy: { requestedAt: "desc" },
  });
  return pass ? toClientPass(pass) : null;
}

export function listMyAccessPasses(userId: string) {
  return prisma.accessPass.findMany({
    where: { userId },
    orderBy: { requestedAt: "desc" },
    take: 50,
    select: {
      id: true,
      zoneName: true,
      requestDate: true,
      requestTime: true,
      expiresAt: true,
      revokedAt: true,
      usedAt: true,
    },
  });
}

/** Security/admin log of QR requests, optionally for one day (campus timezone). */
export function listAccessPasses(date?: string) {
  return prisma.accessPass.findMany({
    where: date ? { requestDate: date } : undefined,
    orderBy: { requestedAt: "desc" },
    take: 500,
    select: {
      id: true,
      zoneName: true,
      requestDate: true,
      requestTime: true,
      expiresAt: true,
      revokedAt: true,
      usedAt: true,
      user: { select: { fullName: true, email: true, studentId: true } },
    },
  });
}

type InvalidReason = "NOT_FOUND" | "EXPIRED" | "REVOKED" | "ALREADY_USED";

/** Gate check: a valid QR is consumed (usedAt) so it cannot be reused. */
export async function verifyAccessPass(token: string) {
  const pass = await prisma.accessPass.findUnique({
    where: { token },
    include: { user: { select: { fullName: true, studentId: true, role: true } } },
  });
  const invalid = (reason: InvalidReason) => ({ valid: false as const, reason });

  if (!pass) return invalid("NOT_FOUND");
  if (pass.revokedAt) return invalid("REVOKED");
  if (pass.usedAt) return invalid("ALREADY_USED");
  if (pass.expiresAt <= new Date()) return invalid("EXPIRED");

  // Conditional update: two guards scanning the same QR cannot both accept it.
  const { count } = await prisma.accessPass.updateMany({
    where: { id: pass.id, usedAt: null },
    data: { usedAt: new Date() },
  });
  if (count === 0) return invalid("ALREADY_USED");

  return {
    valid: true as const,
    user: pass.user,
    zoneName: pass.zoneName,
    zoneDetail: pass.zoneDetail,
    expiresAt: pass.expiresAt,
  };
}

export function assertValidDate(date: string | undefined) {
  if (date && Number.isNaN(Date.parse(date))) throw ApiError.badRequest("Fecha no válida");
}
