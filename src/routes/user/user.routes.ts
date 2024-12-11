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



export type UsersRoute = typeof users;

