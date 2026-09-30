import { getSocketServer } from "@/sockets/socket.server";
import type { EmergencyAlert, Notification } from "@prisma/client";

export function emitSosCreated(alert: EmergencyAlert) {
  getSocketServer().to("staff").emit("sos:new", alert);
}

export function emitSosResolved(alert: EmergencyAlert) {
  getSocketServer().to("staff").emit("sos:resolved", alert);
  getSocketServer().to(`user:${alert.userId}`).emit("sos:resolved", alert);
}

export function emitNotificationCreated(notification: Notification) {
  getSocketServer().emit("notification:new", notification);
}
