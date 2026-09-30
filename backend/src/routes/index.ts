import { Router } from "express";
import { authRouter } from "@/modules/auth/auth.routes";
import { userRouter } from "@/modules/users/user.routes";
import { alertRouter } from "@/modules/alerts/alert.routes";
import { incidentRouter } from "@/modules/incidents/incident.routes";
import { contactRouter } from "@/modules/contacts/contact.routes";
import { notificationRouter } from "@/modules/notifications/notification.routes";

export const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", userRouter);
rootRouter.use("/alerts", alertRouter);
rootRouter.use("/incidents", incidentRouter);
rootRouter.use("/contacts", contactRouter);
rootRouter.use("/notifications", notificationRouter);
