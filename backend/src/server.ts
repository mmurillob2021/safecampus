import { createServer } from "http";
import { createApp } from "@/app";
import { env } from "@/config/env";
import { initSocketServer } from "@/sockets/socket.server";

const app = createApp();
const httpServer = createServer(app);
initSocketServer(httpServer);

httpServer.listen(env.port, () => {
  console.log(`SafeCampus API listening on port ${env.port}`);
});
