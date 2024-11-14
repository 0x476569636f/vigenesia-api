import { createRouter } from "@/lib/create-app";

import * as handlers from "@/routes/motivations/motivations.handler";
import * as routes from "@/routes/motivations/motivations.routes";

const router = createRouter()
  .openapi(routes.motivasions, handlers.motivations as any)
  .openapi(routes.create, handlers.create as any)
  .openapi(routes.getOne, handlers.getOne as any)
  .openapi(routes.patch, handlers.patch as any)
  .openapi(routes.remove, handlers.remove as any);

export default router;
