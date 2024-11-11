import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  createErrorSchema,
  createMessageObjectSchema,
  IdParamsSchema,
} from "stoker/openapi/schemas";

import {
  insertBeritaSchema,
  patchBeritaSchema,
  selectBeritaSchema,
  beritaWithUser,
} from "@/db/schema";
import { notFoundSchema } from "@/lib/constants";
import { adminOnly, authenticated } from "@/middleware/auth.middleware";

const tags = ["News"];

export const news = createRoute({
  path: "/news",
  method: "get",
  middleware: authenticated,
  tags,
  summary: "Get all news, bearer token is required",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(beritaWithUser), "Get All News"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Unauthorized"
    ),
  },
});

export const create = createRoute({
  path: "/news",
  method: "post",
  middleware: adminOnly,
  summary: "Create new news, bearer token (admin) is required",
  request: {
    body: jsonContentRequired(insertBeritaSchema, "The news to create"),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectBeritaSchema,
      "The created news item"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertBeritaSchema),
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
  path: "/news/{id}",
  method: "get",
  middleware: authenticated,
  summary: "Get a single news by id, bearer token is required",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectBeritaSchema, "The requested news"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "news not found"),
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
  path: "/news/{id}",
  method: "patch",
  middleware: adminOnly,
  summary: "Update news item by ID, bearer token (admin) is required",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(patchBeritaSchema, "The news updates"),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectBeritaSchema,
      "The updated news item"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "News not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchBeritaSchema).or(
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
  path: "/news/{id}",
  method: "delete",
  middleware: adminOnly,
  summary: "Delete news item by ID, bearer token (admin) is required",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "News deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "News not found"),
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

export type NewsRoute = typeof news;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
