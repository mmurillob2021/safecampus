import { prisma } from "@/config/prisma";
import { emitNotificationCreated } from "@/sockets/socket.events";
import type { CreateNotificationInput } from "@/modules/notifications/notification.schema";

export async function createNotification(input: CreateNotificationInput) {
  const notification = await prisma.notification.create({ data: input });
  emitNotificationCreated(notification);
  return notification;
}

export function listNotifications() {
  return prisma.notification.findMany({ orderBy: { createdAt: "desc" } });
}

export async function markNotificationRead(notificationId: string, userId: string) {
  return prisma.notificationRead.upsert({
    where: { notificationId_userId: { notificationId, userId } },
    update: {},
    create: { notificationId, userId },
  });
}
