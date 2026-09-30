import express from "express";
import cors from "cors";
import { env } from "@/config/env";
import { rootRouter } from "@/routes";
import { errorMiddleware, notFoundMiddleware } from "@/middleware/error.middleware";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api", rootRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
