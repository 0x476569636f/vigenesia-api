import { OpenAPIHono } from "@hono/zod-openapi";

export type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

export type Environment = Bindings;

export type AppOpenAPI = OpenAPIHono<{ Bindings: Bindings }>;
