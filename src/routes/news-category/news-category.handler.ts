import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";
import { createDb } from "@/db";
import { kategori } from "@/db/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";
import type {
  NewsCategoryRoute,
  CreateRoute,
  GetOneRoute,
  PatchRoute,
  RemoveRoute,
} from "@/routes/news-category/news-category.routes";
import { eq } from "drizzle-orm";

export const newsCategory: AppRouteHandler<NewsCategoryRoute> = async (c) => {
  const { db } = createDb(c.env);
  const { withNews } = c.req.query();
  if (withNews) {
    const newsCategory = await db.query.kategori.findMany({
      with: {
        berita: true,
      },
    });
    return c.json(newsCategory, HttpStatusCodes.OK);
  }
  const newsCategory = await db.query.kategori.findMany();
  return c.json(newsCategory, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const { db } = createDb(c.env);
  const categoryToInsert = c.req.valid("json");
  const [insertedCategory] = await db
    .insert(kategori)
    .values(categoryToInsert)
    .returning();

  return c.json(insertedCategory, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { db } = createDb(c.env);
  const { id } = c.req.valid("param");
  const { withNews } = c.req.query();

  const category = await db.query.kategori.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!category) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  if (withNews) {
    const category = await db.query.kategori.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, id);
      },
      with: {
        berita: true,
      },
    });
    return c.json(category, HttpStatusCodes.OK);
  }

  return c.json(category, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { db } = createDb(c.env);
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  if (Object.keys(updates).length === 0) {
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

  const [category] = await db
    .update(kategori)
    .set(updates)
    .where(eq(kategori.id, Number(id)))
    .returning();

  if (!category) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(category, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { db } = createDb(c.env);
  const { id } = c.req.valid("param");
  const deletedRecord = await db
    .delete(kategori)
    .where(eq(kategori.id, Number(id)))
    .returning({ deletedId: kategori.id });

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
