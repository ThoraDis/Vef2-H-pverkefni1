import { Hono } from "hono";
import { prisma } from "../prisma.js";
import { zValidator } from "@hono/zod-validator";
import {
  pagingSchema,
  createUserSchema,
  updateUserSchema,
  idSchema,
  loginUserSchema,
  userIdSchema,
} from "../schema.zod.js";
import { auth } from "../lib/auth.js";
import { authenticateAdmin, authenticate } from "../authentication/jwtauth.js";

export const userApi = new Hono();

//ná í
userApi.get("/", authenticate, zValidator("json", pagingSchema), async (c) => {
  const limit = c.req.valid("json").limit;
  const offset = c.req.valid("json").offset;

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
userApi.get(
  "/:id",
  authenticate,
  zValidator("param", userIdSchema),
  async (c) => {
    const id = c.req.valid("param").id;

    const user = await prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      return c.json({ error: "no such user" }, 404);
    }

    return c.json(user, 200);
  },
);

//Búa til
userApi.post(
  "/",
  authenticateAdmin,
  zValidator("json", createUserSchema, (result, c) => {
    if (!result.success) {
      return c.json("Bad request", 400);
    }
  }),

  async (c) => {
    const username = c.req.valid("json").username;
    const email = c.req.valid("json").email;

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
  },
);

//Uppfæra
userApi.put(
  "/:id",
  authenticateAdmin,
  zValidator("json", updateUserSchema, (result, c) => {
    if (!result.success) {
      return c.json("Bad request", 400);
    }
  }),
  zValidator("param", userIdSchema),
  async (c) => {
    const id = c.req.valid("param").id;
    const email = c.req.valid("json").email;

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
  },
);

//Eyða
userApi.delete(
  "/:id",
  authenticateAdmin,
  zValidator("param", userIdSchema),
  async (c) => {
    const id = c.req.valid("param").id;

    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return c.json(204);
  },
);
