import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";
import { createDb } from "@/db";
import { users } from "@/db/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";
import type {
    UsersRoute,
    GetOneRoute
} from "@/routes/user/user.routes"

export const getAllUsers: AppRouteHandler<UsersRoute> = async (c) => {
    const { db } = createDb(c.env);
    const userList = await db.query.users.findMany({
        columns: {
            id: true,
            name: true,
            email: true,
            role: true,
            created_at: true
        }
        
    })
  return c.json(userList, HttpStatusCodes.OK);
};


