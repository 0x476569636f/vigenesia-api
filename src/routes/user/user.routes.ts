import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  createErrorSchema,
  createMessageObjectSchema,
  IdParamsSchema,
} from "stoker/openapi/schemas";

import {
  insertUserSchema,
  selectUserSchema,
  selectUserSchemaWithoutPassword
} from "@/db/schema";
import { notFoundSchema } from "@/lib/constants";
import { adminOnly, authenticated } from "@/middleware/auth.middleware";

const tags = ["Users"];

export const users = createRoute({
  path: "/users",
  method: "get",
  middleware: authenticated,
  tags,
  summary: "get all users, bearer token is required",
    responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectUserSchemaWithoutPassword),
      "Get All Users"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Unauthorized"
    ),
  },
});

export const remove = createRoute({
  path: "/users/{id}",
  method: "delete",
  middleware: adminOnly,
  summary: "Delete all users, bearer token is required",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "users deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "users not found"
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

export type UsersRoute = typeof users;
export type RemoveRoute = typeof remove;
