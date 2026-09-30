import { apiClient } from "@/services/api/client";
import type { OfficialContact, PersonalContact } from "@/types/contact";

export function fetchOfficialContacts() {
  return apiClient.get<OfficialContact[]>("/contacts/official").then((r) => r.data);
}

export function fetchPersonalContacts() {
  return apiClient.get<PersonalContact[]>("/contacts/personal").then((r) => r.data);
}

export function createPersonalContactRequest(input: { name: string; phone: string }) {
  return apiClient.post<PersonalContact>("/contacts/personal", input).then((r) => r.data);
}

export function deletePersonalContactRequest(contactId: string) {
  return apiClient.delete(`/contacts/personal/${contactId}`);
}
