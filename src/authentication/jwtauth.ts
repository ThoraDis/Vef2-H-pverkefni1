import type { Context, Next } from "hono";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { prisma } from "../db/client.js";

const jwks = createRemoteJWKSet(
  new URL(`${process.env.BETTER_AUTH_URL}/api/auth/jwks`),
);

function getBearerToken(c: Context): string | null {
  const auth = c.req.header("Authorization");
  if (!auth) return null;

  const [type, token] = auth.split(" ");
  if (type !== "Bearer" || !token) return null;

  return token;
}

export const authenticate = async (c: Context, next: Next) => {
  const token = getBearerToken(c);
  if (!token) return c.json({ error: "Unauthorized" }, 401);

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: process.env.BETTER_AUTH_URL,
    });

    const sub = payload.sub;
    if (!sub) return c.json({ error: "Unauthorized" }, 401);

    const userId = Number(sub);
    if (!Number.isFinite(userId)) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("userId", userId);
    await next();
  } catch(err) {
    console.log(err)
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
    return c.json({ error: "Required role not possessed" }, 401);
  }

  await next();
};
