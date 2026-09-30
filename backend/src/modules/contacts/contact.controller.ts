import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  createPersonalContact,
  deletePersonalContact,
  listOfficialContacts,
  listPersonalContacts,
} from "@/modules/contacts/contact.service";

export const getOfficialContacts = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await listOfficialContacts());
});

export const getPersonalContacts = asyncHandler(async (req: Request, res: Response) => {
  res.json(await listPersonalContacts(req.auth!.userId));
});

export const postPersonalContact = asyncHandler(async (req: Request, res: Response) => {
  const contact = await createPersonalContact(req.auth!.userId, req.body);
  res.status(201).json(contact);
});

export const removePersonalContact = asyncHandler(async (req: Request, res: Response) => {
  await deletePersonalContact(req.auth!.userId, req.params.id);
  res.status(204).send();
});
