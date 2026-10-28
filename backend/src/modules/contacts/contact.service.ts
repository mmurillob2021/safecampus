import { prisma } from "@/config/prisma";
import { ApiError } from "@/utils/apiError";
import type { CreatePersonalContactInput } from "@/modules/contacts/contact.schema";

export function listOfficialContacts() {
  return prisma.officialContact.findMany({ where: { active: true }, orderBy: { order: "asc" } });
}

export function listPersonalContacts(userId: string) {
  return prisma.personalContact.findMany({ where: { userId } });
}

export function createPersonalContact(userId: string, input: CreatePersonalContactInput) {
  return prisma.personalContact.create({ data: { ...input, userId } });
}

export async function deletePersonalContact(userId: string, contactId: string) {
  const contact = await prisma.personalContact.findUnique({ where: { id: contactId } });
  if (!contact || contact.userId !== userId) throw ApiError.notFound("Contact not found");
  await prisma.personalContact.delete({ where: { id: contactId } });
}
