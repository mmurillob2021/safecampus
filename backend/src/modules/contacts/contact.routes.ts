import { Router } from "express";
import { requireAuth } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validate.middleware";
import {
  getOfficialContacts,
  getPersonalContacts,
  postPersonalContact,
  removePersonalContact,
} from "@/modules/contacts/contact.controller";
import { createPersonalContactSchema } from "@/modules/contacts/contact.schema";

export const contactRouter = Router();

contactRouter.use(requireAuth);
contactRouter.get("/official", getOfficialContacts);
contactRouter.get("/personal", getPersonalContacts);
contactRouter.post("/personal", validateBody(createPersonalContactSchema), postPersonalContact);
contactRouter.delete("/personal/:id", removePersonalContact);
