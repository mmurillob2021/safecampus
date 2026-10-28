import { prisma } from "@/config/prisma";
import { ApiError } from "@/utils/apiError";
import {
  CONFIG_TABLES,
  findConfigTable,
  type TableDef,
} from "@/modules/config/config.registry";
import { buildCreateSchema, buildUpdateSchema } from "@/modules/config/config.schema";

/** Minimal shape shared by every Prisma model delegate we manage. */
interface ModelDelegate {
  findMany(args?: unknown): Promise<Record<string, unknown>[]>;
  findUnique(args: unknown): Promise<Record<string, unknown> | null>;
  create(args: unknown): Promise<Record<string, unknown>>;
  update(args: unknown): Promise<Record<string, unknown>>;
  delete(args: unknown): Promise<Record<string, unknown>>;
}

function getTable(key: string): TableDef {
  const table = findConfigTable(key);
  if (!table) throw ApiError.notFound(`Unknown config table: ${key}`);
  return table;
}

function delegateFor(table: TableDef): ModelDelegate {
  return (prisma as unknown as Record<string, ModelDelegate>)[table.model];
}

function parseBody(schema: ReturnType<typeof buildCreateSchema>, body: unknown) {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw ApiError.badRequest(result.error.issues.map((i) => i.message).join(", "));
  }
  // Drop nulls for columns that are NOT NULL with a default (order, active, color).
  return Object.fromEntries(
    Object.entries(result.data as Record<string, unknown>).filter(([, v]) => v !== undefined),
  );
}

async function findOrFail(table: TableDef, id: string) {
  const row = await delegateFor(table).findUnique({ where: { [table.idField]: id } });
  if (!row) throw ApiError.notFound("Registro no encontrado");
  return row;
}

// ---------------------------------------------------------------------------
// Admin CRUD
// ---------------------------------------------------------------------------

export function listConfigTables() {
  return CONFIG_TABLES.map(({ model: _model, orderBy: _orderBy, ...meta }) => meta);
}

export function listRows(tableKey: string) {
  const table = getTable(tableKey);
  return delegateFor(table).findMany({ orderBy: table.orderBy });
}

export async function createRow(tableKey: string, body: unknown) {
  const table = getTable(tableKey);
  const data = parseBody(buildCreateSchema(table), body);
  return delegateFor(table).create({ data });
}

export async function updateRow(tableKey: string, id: string, body: unknown) {
  const table = getTable(tableKey);
  const data = parseBody(buildUpdateSchema(table), body);
  await findOrFail(table, id);
  return delegateFor(table).update({ where: { [table.idField]: id }, data });
}

export async function deleteRow(tableKey: string, id: string) {
  const table = getTable(tableKey);
  await findOrFail(table, id);
  await delegateFor(table).delete({ where: { [table.idField]: id } });
}

// ---------------------------------------------------------------------------
// App bundle: everything the mobile app needs to render its parameterised UI
// ---------------------------------------------------------------------------

export async function getAppConfig() {
  const [settings, incidentCategories, severityLevels, safetyPoints] = await Promise.all([
    prisma.appSetting.findMany(),
    prisma.incidentCategory.findMany({ where: { active: true }, orderBy: [{ order: "asc" }] }),
    prisma.severityLevel.findMany({ where: { active: true }, orderBy: [{ order: "asc" }] }),
    prisma.safetyPoint.findMany({ where: { active: true }, orderBy: [{ order: "asc" }] }),
  ]);

  return {
    settings: Object.fromEntries(
      settings.map((s) => [s.key, { value: s.value, updatedAt: s.updatedAt }]),
    ),
    incidentCategories,
    severityLevels,
    safetyPoints,
  };
}

/** Throws 400 unless `code` is an active row in the given parameter table. */
export async function assertActiveCode(
  model: "incidentCategory" | "severityLevel",
  code: string,
  label: string,
) {
  const row =
    model === "incidentCategory"
      ? await prisma.incidentCategory.findUnique({ where: { code } })
      : await prisma.severityLevel.findUnique({ where: { code } });
  if (!row || !row.active) throw ApiError.badRequest(`${label} no válida: ${code}`);
}
