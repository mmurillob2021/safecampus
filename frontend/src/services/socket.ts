import { io, type Socket } from "socket.io-client";
import Constants from "expo-constants";

const socketUrl = Constants.expoConfig?.extra?.socketUrl ?? "http://localhost:4000";

let socket: Socket | null = null;

export function connectSocket(token: string): Socket {
  socket = io(socketUrl, { auth: { token }, transports: ["websocket"] });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket(): Socket | null {
  return socket;
}
