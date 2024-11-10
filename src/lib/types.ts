import { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";

export type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

export interface AppBindings {
  Bindings: Bindings;
}

export type Environment = Bindings;

export type AppOpenAPI = OpenAPIHono<AppBindings>;
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;
