import type { Context, Next } from "hono";
import { prisma } from "../db/client.js";
import { auth } from "../lib/auth.js"; 

export const authenticate = async (c: Context, next: Next) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session || !session.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("userId", session.user.id);
    await next();
  } catch(err) {
    console.log(err);
    return c.json({ error: "Unauthorized" }, 401);
  }
};

export const authenticateAdmin = async (c: Context, next: Next) => {
  const userId = c.get("userId");

  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (user.role !== "ADMIN") {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
};
