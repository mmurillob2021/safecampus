import type { IncidentStatus } from "@prisma/client";
import { prisma } from "@/config/prisma";
import { ApiError } from "@/utils/apiError";
import type { CreateIncidentInput } from "@/modules/incidents/incident.schema";

export function createIncident(userId: string, input: CreateIncidentInput) {
  return prisma.incident.create({ data: { ...input, userId } });
}

export function listAllIncidents() {
  return prisma.incident.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { fullName: true } } },
  });
}

export function listMyIncidents(userId: string) {
  return prisma.incident.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function updateIncidentStatus(incidentId: string, status: IncidentStatus) {
  const existing = await prisma.incident.findUnique({ where: { id: incidentId } });
  if (!existing) throw ApiError.notFound("Incident not found");
  return prisma.incident.update({ where: { id: incidentId }, data: { status } });
}
