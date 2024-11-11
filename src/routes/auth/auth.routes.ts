import { insertUserSchema, selectUserSchema } from "@/db/schema";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

const tags = ["Auth"];

const loginSchema = selectUserSchema.omit({
  created_at: true,
  name: true,
  id: true,
  role: true,
});

export const register = createRoute({
  path: "/auth/register",
  method: "post",
  summary: "Register a new user",
  tags,
  request: {
    body: jsonContentRequired(insertUserSchema, "The user to create"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      insertUserSchema.omit({
        password: true,
      }),
      "The created User"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUserSchema),
      "The validation error(s) | User Already Exists"
    ),
  },
});

export const login = createRoute({
  path: "/auth/login",
  method: "post",
  summary: "Login a user",
  tags,
  request: {
    body: jsonContentRequired(loginSchema, "The user to login"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        token: z.string(),
        user: z.object({
          id: z.number(),
          name: z.string(),
          email: z.string().email(),
          role: z.string(),
        }),
      }),
      "Token and the logged in user informations"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(loginSchema),
      "The validation error(s) | User Not Found | Invalid Cradentials"
    ),
  },
});

export type RegisterRoute = typeof register;
export type LoginRoute = typeof login;
