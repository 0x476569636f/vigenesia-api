import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";
import { createDb } from "@/db";
import { users } from "@/db/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";
import type {
    UsersRoute,
    RemoveRoute
    // GetOneRoute
} from "@/routes/user/user.routes"
import { eq } from "drizzle-orm";

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

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { db } = createDb(c.env);
  const { id } = c.req.valid("param");
  const deletedRecord = await db
    .delete(users)
    .where(eq(users.id, Number(id)))
    .returning({ deletedId: users.id });

  if (deletedRecord.length === 0) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
