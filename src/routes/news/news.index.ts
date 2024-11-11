import { createRouter } from "@/lib/create-app";

import * as handlers from "@/routes/news/news.handlers";
import * as routes from "@/routes/news/news.routes";

const router = createRouter()
  .openapi(routes.news, handlers.news as any)
  .openapi(routes.create, handlers.create as any)
  .openapi(routes.getOne, handlers.getOne as any)
  .openapi(routes.patch, handlers.patch as any)
  .openapi(routes.remove, handlers.remove as any);

export default router;
