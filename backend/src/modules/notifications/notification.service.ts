import { prisma } from "@/config/prisma";
import { emitNotificationCreated } from "@/sockets/socket.events";
import { assertActiveCode } from "@/modules/config/config.service";
import type { CreateNotificationInput } from "@/modules/notifications/notification.schema";

const withSeverity = { severityRef: { select: { label: true, color: true } } } as const;

export async function createNotification(input: CreateNotificationInput) {
  if (input.severity) await assertActiveCode("severityLevel", input.severity, "Severidad");
  const notification = await prisma.notification.create({ data: input, include: withSeverity });
  emitNotificationCreated(notification);
  return notification;
}

export function listNotifications() {
  return prisma.notification.findMany({ orderBy: { createdAt: "desc" }, include: withSeverity });
}

export async function markNotificationRead(notificationId: string, userId: string) {
  return prisma.notificationRead.upsert({
    where: { notificationId_userId: { notificationId, userId } },
    update: {},
    create: { notificationId, userId },
  });
}
