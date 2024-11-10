import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { logger } from "hono/logger";
import type { Bindings } from "@/lib/types";

export function createRouter() {
  return new OpenAPIHono<{ Bindings: Bindings }>({
    strict: false,
  });
}

function createApp() {
  const app = createRouter();
  app.use(logger());
  app.use(serveEmojiFavicon("🔥"));

  app.notFound(notFound);
  app.onError(onError);
  return app;
}

export default createApp;
