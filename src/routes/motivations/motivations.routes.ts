import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  createErrorSchema,
  createMessageObjectSchema,
  IdParamsSchema,
} from "stoker/openapi/schemas";

import {
  insertMotivasiSchema,
  selectMotivasiSchema,
  selectMotivasiSchemaWithUser,
  patchMotivasiSchema,
} from "@/db/schema";
import { notFoundSchema } from "@/lib/constants";
import { adminOrOwner, authenticated } from "@/middleware/auth.middleware";

const tags = ["Motivations"];

export const motivasions = createRoute({
  path: "/motivations",
  method: "get",
  middleware: authenticated,
  tags,
  summary: "Get all motivations, bearer token is required",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectMotivasiSchemaWithUser),
      "Get all motivations"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Unauthorized"
    ),
  },
});

export const create = createRoute({
  path: "/motivations",
  method: "post",
  middleware: authenticated,
  summary: "Create new motivation, bearer token is required",
  request: {
    body: jsonContentRequired(insertMotivasiSchema, "The motivation to create"),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      insertMotivasiSchema,
      "The created motivation"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertMotivasiSchema),
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
  path: "/motivations/{id}",
  method: "get",
  middleware: authenticated,
  summary: "Get a single motivation by id, bearer token is required",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectMotivasiSchemaWithUser,
      "The requested motivation"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "motivation not found"
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
  path: "/motivations/{id}",
  method: "patch",
  middleware: adminOrOwner,
  summary:
    "Update motivation by ID, bearer token (owner of motivation or admin) is required",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(patchMotivasiSchema, "The motivation updates"),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectMotivasiSchema,
      "The updated motivation"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "motivation not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchMotivasiSchema).or(
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
  path: "/motivations/{id}",
  method: "delete",
  middleware: adminOrOwner,
  summary:
    "Delete motivation by ID, bearer token (owner of motivation or admin) is required",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "motivation deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "motivation not found"
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

export type MotivationsRoute = typeof motivasions;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
