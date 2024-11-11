import { Context, Next } from "hono";
import { AuthService } from "@/services/auth.service";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { MiddlewareHandler } from "hono/types";

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

export const adminOnly = [authMiddleware, requireRole("ADMIN")];
export const authenticated = [authMiddleware];
