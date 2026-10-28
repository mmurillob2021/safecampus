import { prisma } from "@/config/prisma";
import { ApiError } from "@/utils/apiError";
import { assertActiveCode } from "@/modules/config/config.service";
import type { IncidentStatus } from "@/types/domain";
import type { CreateIncidentInput } from "@/modules/incidents/incident.schema";

const withLabels = {
  categoryRef: { select: { label: true } },
  severityRef: { select: { label: true, color: true } },
} as const;

export async function createIncident(userId: string, input: CreateIncidentInput) {
  await assertActiveCode("incidentCategory", input.category, "Categoría");
  if (input.severity) await assertActiveCode("severityLevel", input.severity, "Severidad");
  return prisma.incident.create({ data: { ...input, userId }, include: withLabels });
}

export function listAllIncidents() {
  return prisma.incident.findMany({
    orderBy: { createdAt: "desc" },
    include: { ...withLabels, user: { select: { fullName: true } } },
  });
}

export function listMyIncidents(userId: string) {
  return prisma.incident.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: withLabels,
  });
}

export async function updateIncidentStatus(incidentId: string, status: IncidentStatus) {
  const existing = await prisma.incident.findUnique({ where: { id: incidentId } });
  if (!existing) throw ApiError.notFound("Incident not found");
  return prisma.incident.update({ where: { id: incidentId }, data: { status }, include: withLabels });
}
