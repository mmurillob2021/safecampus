import { prisma } from "@/config/prisma";
import { ApiError } from "@/utils/apiError";
import { emitSosCreated, emitSosResolved } from "@/sockets/socket.events";
import type { CreateAlertInput } from "@/modules/alerts/alert.schema";

export async function createAlert(userId: string, input: CreateAlertInput) {
  const alert = await prisma.emergencyAlert.create({
    data: { userId, latitude: input.latitude, longitude: input.longitude },
  });
  emitSosCreated(alert);
  return alert;
}

export async function resolveAlert(alertId: string) {
  const existing = await prisma.emergencyAlert.findUnique({ where: { id: alertId } });
  if (!existing) throw ApiError.notFound("Alert not found");

  const alert = await prisma.emergencyAlert.update({
    where: { id: alertId },
    data: { status: "RESOLVED", resolvedAt: new Date() },
  });
  emitSosResolved(alert);
  return alert;
}

export function listActiveAlerts() {
  return prisma.emergencyAlert.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { fullName: true, phone: true } } },
  });
}

export function listMyAlerts(userId: string) {
  return prisma.emergencyAlert.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
