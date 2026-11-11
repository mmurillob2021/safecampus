import type { Incident } from "@prisma/client";
import { prisma } from "@/config/prisma";
import { ApiError } from "@/utils/apiError";
import { assertActiveCode } from "@/modules/config/config.service";
import { mirrorToFirestore } from "@/config/firestore";
import type { IncidentStatus } from "@/types/domain";
import type { CreateIncidentInput } from "@/modules/incidents/incident.schema";

const withLabels = {
  categoryRef: { select: { label: true } },
  severityRef: { select: { label: true, color: true } },
} as const;

/** Copies the incident row (without the joined labels) to Firestore `Incident/{id}`. */
function mirrorIncident<T extends Incident & { categoryRef: unknown; severityRef: unknown }>(incident: T): T {
  const { categoryRef: _c, severityRef: _s, ...row } = incident;
  mirrorToFirestore("Incident", row.id, row);
  return incident;
}

export async function createIncident(userId: string, input: CreateIncidentInput) {
  await assertActiveCode("incidentCategory", input.category, "Categoría");
  if (input.severity) await assertActiveCode("severityLevel", input.severity, "Severidad");
  const incident = await prisma.incident.create({ data: { ...input, userId }, include: withLabels });
  return mirrorIncident(incident);
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
  const incident = await prisma.incident.update({ where: { id: incidentId }, data: { status }, include: withLabels });
  return mirrorIncident(incident);
}
