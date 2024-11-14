import { Context, Next } from "hono";
import { AuthService } from "@/services/auth.service";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { MiddlewareHandler } from "hono/types";
import { createDb } from "@/db";
import { motivasi } from "@/db/schema";
import { eq } from "drizzle-orm";

export const authMiddleware: MiddlewareHandler = async (
  c: Context,
  next: Next
) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ message: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];
    const authService = new AuthService(c.env.JWT_SECRET);
    const payload = await authService.verifyToken(token);

    c.set("user", payload);
    await next();
  } catch (error) {
    return c.json({ message: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
  }
};

export function requireRole(role: string) {
  return async function (c: Context, next: Next) {
    const user = c.get("user");

    if (!user || !role.includes(user.role)) {
      return c.json({ message: "Forbidden" }, HttpStatusCodes.FORBIDDEN);
    }

    await next();
  };
}

export function requireAdminOrOwner() {
  return async function (c: Context, next: Next) {
    const user = c.get("user");
    const { db } = createDb(c.env);

    const motivationId = Number(c.req.param("id"));

    if (isNaN(motivationId)) {
      return c.json(
        { message: "Invalid motivation ID" },
        HttpStatusCodes.BAD_REQUEST
      );
    }

    const motivations = await db
      .select()
      .from(motivasi)
      .where(eq(motivasi.id, motivationId))
      .limit(1)
      .execute();

    const motivation = motivations[0];

    if (!motivation) {
      return c.json({ message: "Not Found" }, HttpStatusCodes.NOT_FOUND);
    }

    if (user.role === "ADMIN" || Number(user.userId) === motivation.userId) {
      await next();
    } else {
      return c.json({ message: "Forbidden" }, HttpStatusCodes.FORBIDDEN);
    }
  };
}

export const adminOnly = [authMiddleware, requireRole("ADMIN")];
export const authenticated = [authMiddleware];
export const adminOrOwner = [authMiddleware, requireAdminOrOwner()];
