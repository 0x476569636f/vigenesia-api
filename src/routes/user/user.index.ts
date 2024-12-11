import { createRouter } from "@/lib/create-app";

import * as handlers from "@/routes/user/user.handler";
import * as routes from "@/routes/user/user.routes";

const router = createRouter()
    .openapi(routes.users, handlers.getAllUsers as any)
    // .openapi(routes.getOne, handlers.getOne as any)

export default router;