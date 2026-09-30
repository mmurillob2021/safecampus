import type { Server as HttpServer } from "http";
import { Server, type Socket } from "socket.io";
import { verifyAuthToken } from "@/utils/jwt";
import { env } from "@/config/env";

let io: Server | undefined;

export function initSocketServer(httpServer: HttpServer): Server {
  io = new Server(httpServer, { cors: { origin: env.corsOrigin } });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error("Missing auth token"));
    try {
      const payload = verifyAuthToken(token);
      socket.data.userId = payload.userId;
      socket.data.role = payload.role;
      next();
    } catch {
      next(new Error("Invalid auth token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    socket.join(`user:${socket.data.userId}`);
    if (socket.data.role === "SECURITY" || socket.data.role === "ADMIN") {
      socket.join("staff");
    }
  });

  return io;
}

export function getSocketServer(): Server {
  if (!io) throw new Error("Socket server not initialized");
  return io;
}
