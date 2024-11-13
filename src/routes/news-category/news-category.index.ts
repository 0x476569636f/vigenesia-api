import { createRouter } from "@/lib/create-app";

import * as handlers from "@/routes/news-category/news-category.handler";
import * as routes from "@/routes/news-category/news-category.routes";

const router = createRouter()
  .openapi(routes.newsCategory, handlers.newsCategory as any)
  .openapi(routes.create, handlers.create as any)
  .openapi(routes.getOne, handlers.getOne as any)
  .openapi(routes.patch, handlers.patch as any)
  .openapi(routes.remove, handlers.remove as any);

export default router;
