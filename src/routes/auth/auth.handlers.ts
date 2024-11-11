import { createDb } from "@/db";
import { users } from "@/db/schema";
import type { AppRouteHandler } from "@/lib/types";
import { LoginRoute, RegisterRoute } from "./auth.routes";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { verify } from "hono/jwt";
import { AuthService } from "@/services/auth.service";

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
  const { db } = createDb(c.env);
  const { name, email, password } = c.req.valid("json");

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (existingUser) {
    return c.json(
      {
        success: false,
        error: {
          name: "ValidationError",
          issues: [
            {
              code: "user_exists",
              path: [],
              message: "User already exists.",
            },
          ],
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  const hashedPassword = await hashPassword(password);

  const [newUser] = await db
    .insert(users)
    .values({ name, email, password: hashedPassword })
    .returning();

  return c.json(
    {
      name: newUser.name,
      email: newUser.email,
    },
    HttpStatusCodes.OK
  );
};

export const login: AppRouteHandler<LoginRoute> = async (c) => {
  const { db } = createDb(c.env);
  const { email, password } = c.req.valid("json");
  const authService = new AuthService(c.env.JWT_SECRET);

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return c.json(
      {
        success: false,
        error: {
          name: "Auth Error",
          issues: [
            {
              code: "user_not_found",
              path: [],
              message: "User not found.",
            },
          ],
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    return c.json(
      {
        success: false,
        error: {
          name: "Auth Error",
          issues: [
            {
              code: "cradential_not_valid",
              path: [],
              message: "Email Or Password Is Wrong",
            },
          ],
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  const token = await authService.createToken({
    userId: user.id.toString(),
    role: user.role,
  });

  return c.json(
    {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    HttpStatusCodes.OK
  );
};
