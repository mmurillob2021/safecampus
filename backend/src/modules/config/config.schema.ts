import { z, type ZodTypeAny } from "zod";
import type { FieldDef, TableDef } from "@/modules/config/config.registry";

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

function fieldSchema(field: FieldDef): ZodTypeAny {
  switch (field.type) {
    case "number":
      return z.coerce.number({ invalid_type_error: `${field.label} debe ser un número` });
    case "boolean":
      return z.boolean({ invalid_type_error: `${field.label} debe ser verdadero o falso` });
    case "color":
      return z.string().trim().regex(HEX_COLOR, `${field.label} debe ser un color hexadecimal`);
    default: {
      const base = z.string().trim().max(2000);
      return field.required ? base.min(1, `${field.label} es obligatorio`) : base;
    }
  }
}

/** Body schema for creating a row. Required fields must be present. */
export function buildCreateSchema(table: TableDef) {
  const shape: Record<string, ZodTypeAny> = {};
  for (const field of table.fields) {
    const schema = fieldSchema(field);
    shape[field.name] = field.required ? schema : schema.optional().nullable();
  }
  return z.object(shape).strict();
}

/** Body schema for updating a row. Every field is optional; the id is immutable. */
export function buildUpdateSchema(table: TableDef) {
  const shape: Record<string, ZodTypeAny> = {};
  for (const field of table.fields) {
    if (field.name === table.idField) continue;
    const schema = fieldSchema(field);
    shape[field.name] = field.required ? schema.optional() : schema.optional().nullable();
  }
  return z.object(shape).strict();
}
