import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  createRow,
  deleteRow,
  getAppConfig,
  listConfigTables,
  listRows,
  updateRow,
} from "@/modules/config/config.service";

export const getConfig = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await getAppConfig());
});

export const getTables = asyncHandler(async (_req: Request, res: Response) => {
  res.json(listConfigTables());
});

export const getTableRows = asyncHandler(async (req: Request, res: Response) => {
  res.json(await listRows(req.params.table));
});

export const postTableRow = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json(await createRow(req.params.table, req.body));
});

export const patchTableRow = asyncHandler(async (req: Request, res: Response) => {
  res.json(await updateRow(req.params.table, req.params.id, req.body));
});

export const deleteTableRow = asyncHandler(async (req: Request, res: Response) => {
  await deleteRow(req.params.table, req.params.id);
  res.status(204).send();
});
