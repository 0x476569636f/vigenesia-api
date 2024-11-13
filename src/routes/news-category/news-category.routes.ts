import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  createErrorSchema,
  createMessageObjectSchema,
  IdParamsSchema,
} from "stoker/openapi/schemas";

import {
  insertKategoriSchema,
  selectKategoriSchema,
  patchKategoriSchema,
} from "@/db/schema";
import { notFoundSchema } from "@/lib/constants";
import { adminOnly, authenticated } from "@/middleware/auth.middleware";

const tags = ["News Category"];

export const newsCategory = createRoute({
  path: "/news-category",
  method: "get",
  middleware: authenticated,
  tags,
  summary: "Get all news category, bearer token is required",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectKategoriSchema),
      "Get All News Category"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Unauthorized"
    ),
  },
});

export const create = createRoute({
  path: "/news-category",
  method: "post",
  middleware: adminOnly,
  summary: "Create new category, bearer token (admin) is required",
  request: {
    body: jsonContentRequired(insertKategoriSchema, "The category to create"),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      insertKategoriSchema,
      "The created category"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertKategoriSchema),
      "The validation error(s)"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Unauthorized"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      createMessageObjectSchema("Forbidden"),
      "Forbidden"
    ),
  },
});

export const getOne = createRoute({
  path: "/news-category/{id}",
  method: "get",
  middleware: authenticated,
  summary: "Get a single news category by id, bearer token is required",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectKategoriSchema,
      "The requested news category"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "News category not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Unauthorized"
    ),
  },
});

export const patch = createRoute({
  path: "/news-category/{id}",
  method: "patch",
  middleware: adminOnly,
  summary: "Update news category by ID, bearer token (admin) is required",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(patchKategoriSchema, "The news category updates"),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectKategoriSchema,
      "The updated news category"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "News category not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchKategoriSchema).or(
        createErrorSchema(IdParamsSchema)
      ),
      "The validation error(s)"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Unauthorized"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      createMessageObjectSchema("Forbidden"),
      "Forbidden"
    ),
  },
});

export const remove = createRoute({
  path: "/news-category/{id}",
  method: "delete",
  middleware: adminOnly,
  summary: "Delete news category item by ID, bearer token (admin) is required",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "News category deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "News category not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Unauthorized"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      createMessageObjectSchema("Forbidden"),
      "Forbidden"
    ),
  },
});

export type NewsCategoryRoute = typeof newsCategory;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
