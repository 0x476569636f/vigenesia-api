import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";
import { createDb } from "@/db";
import { motivasi } from "@/db/schema";
import type {
  MotivationsRoute,
  CreateRoute,
  GetOneRoute,
  PatchRoute,
  RemoveRoute,
} from "@/routes/motivations/motivations.routes";
import { eq } from "drizzle-orm";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

export const motivations: AppRouteHandler<MotivationsRoute> = async (c) => {
  const { db } = createDb(c.env);
  const motivations = await db.query.motivasi.findMany({
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
  return c.json(motivations, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const { db } = createDb(c.env);

  const motivation = c.req.valid("json");
  const [insertedMotivation] = await db
    .insert(motivasi)
    .values(motivation)
    .returning();

  return c.json(insertedMotivation, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { db } = createDb(c.env);
  const { id } = c.req.valid("param");

  const motivation = await db.query.motivasi.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!motivation) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(motivation, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { db } = createDb(c.env);
  const { id } = c.req.valid("param");
  const motivation = c.req.valid("json");

  if (Object.keys(motivation).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  const [updatedMotivation] = await db
    .update(motivasi)
    .set(motivation)
    .where(eq(motivasi.id, id))
    .returning();

  if (!updatedMotivation) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updatedMotivation, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { db } = createDb(c.env);
  const { id } = c.req.valid("param");
  const deletedRecord = await db
    .delete(motivasi)
    .where(eq(motivasi.id, Number(id)))
    .returning({ deletedId: motivasi.id });

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
