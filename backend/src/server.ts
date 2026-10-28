import { createServer } from "http";
import { createApp } from "@/app";
import { env } from "@/config/env";
import { initDatabase, prisma } from "@/config/prisma";
import { initSocketServer } from "@/sockets/socket.server";

async function main() {
  await initDatabase();

  const app = createApp();
  const httpServer = createServer(app);
  initSocketServer(httpServer);

  httpServer.listen(env.port, () => {
    console.log(`SafeCampus API listening on port ${env.port} (SQLite: ${env.databaseUrl})`);
  });

  const shutdown = async () => {
    httpServer.close();
    await prisma.$disconnect();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch(async (err) => {
  console.error("Failed to start SafeCampus API", err);
  await prisma.$disconnect();
  process.exit(1);
});
