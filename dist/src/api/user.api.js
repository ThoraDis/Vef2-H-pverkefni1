import { Hono } from "hono";
import { prisma } from "../prisma.js";
import { zValidator } from "@hono/zod-validator";
import { pagingSchema, createUserSchema, updateUserSchema, idSchema, } from "../schema.zod.js";
import { auth } from "../lib/auth.js";
export const userApi = new Hono();
//ná í
userApi.get("/", zValidator("query", pagingSchema), async (c) => {
    const limit = c.req.valid("query").limit;
    const offset = c.req.valid("query").offset;
    const users = await prisma.user.findMany({ skip: offset, take: limit });
    const usersCount = await prisma.user.count();
    const response = {
        data: users,
        paging: {
            limit,
            offset,
            count: usersCount,
        },
    };
    return c.json(response, 200);
});
//Ná í eftir id eða slug
userApi.get("/:id", zValidator("param", idSchema), async (c) => {
    const id = c.req.valid("param").id;
    const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user) {
        return c.json({ error: "no such user" }, 404);
    }
    return c.json(user, 200);
});
//Búa til
userApi.post("/", zValidator("form", createUserSchema, (result, c) => {
    if (!result.success) {
        return c.json("Bad request", 400);
    }
}), async (c) => {
    const email = c.req.valid("form").email;
    const username = c.req.valid("form").username;
    const newUser = await prisma.user.create({
        data: {
            username: username,
            email: email,
        },
    });
    const response = {
        data: newUser,
    };
    return c.json(response, 201);
});
userApi.post("/register", zValidator("form", createUserSchema, (result, c) => {
    if (!result.success) {
        return c.json("Bad request", 400);
    }
}), async (c) => {
    const { email, password, username } = c.req.valid("form");
    const req = new Request(`${process.env.BETTER_AUTH_URL}/api/auth/sign-up/email`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, username }),
    });
    const res = await auth.handler(req);
    return new Response(await res.text(), {
        status: res.status,
        headers: res.headers,
    });
});
userApi.post("/login", zValidator("form", createUserSchema, (result, c) => {
    if (!result.success) {
        return c.json("Bad request", 400);
    }
}), async (c) => {
    const { email, password } = c.req.valid("form");
    const signInReq = new Request(`${process.env.BETTER_AUTH_URL}/api/auth/sign-in/email`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const signInRes = await auth.handler(signInReq);
    if (!signInRes.ok) {
        return new Response(await signInRes.text(), { status: signInRes.status });
    }
    const tokenReq = new Request(`${process.env.BETTER_AUTH_URL}/api/auth/token`, {
        method: "GET",
        headers: { "content-type": "application/json" },
    });
    const tokenRes = await auth.handler(tokenReq);
    return new Response(await tokenRes.text(), { status: tokenRes.status });
});
//Uppfæra
userApi.put("/:id", zValidator("form", updateUserSchema, (result, c) => {
    if (!result.success) {
        return c.json("Bad request", 400);
    }
}), zValidator("param", idSchema), async (c) => {
    const id = c.req.valid("param").id;
    const email = c.req.valid("form").email;
    const newUser = await prisma.user.update({
        where: { id: id },
        data: {
            email: email,
        },
    });
    const response = {
        data: newUser,
    };
    return c.json(response, 201);
});
//Eyða
userApi.delete("/:id", zValidator("param", idSchema), async (c) => {
    const id = c.req.valid("param").id;
    await prisma.user.delete({
        where: {
            id: id,
        },
    });
    return c.json(204);
});
