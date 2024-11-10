import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { Environment } from "@/lib/types";
import * as schema from "@/db/schema";

export function createDb(env: Environment) {
  const sql = neon(env.DATABASE_URL);

  const db = drizzle(sql, {
    schema,
  });

  return { db, sql };
}
