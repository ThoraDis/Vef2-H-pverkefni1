import { Hono } from "hono";
import { prisma } from "../prisma.js";
import { zValidator } from "@hono/zod-validator";
import {
  pagingSchema,
  createUserSchema,
  updateUserSchema,
  idSchema,
} from "../schema.zod.js";

export const app = new Hono();

//ná í
app.get("/", zValidator("query", pagingSchema), async (c) => {
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
app.get("/:id", zValidator("param", idSchema), async (c) => {
  const id = c.req.valid("param").id;

  const user = await prisma.user.findUnique({ where: { id: id } });

  if (!user) {
    return c.json({ error: "no such user" }, 404);
  }

  return c.json(user, 200);
});

//Búa til
app.post(
  "/",
  zValidator("form", createUserSchema, (result, c) => {
    if (!result.success) {
      return c.json("Bad request", 400);
    }
  }),
  async (c) => {
    const email = c.req.valid("form").email;

    const newUser = await prisma.user.create({
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

//Uppfæra
app.put(
  "/:id",
  zValidator("form", updateUserSchema, (result, c) => {
    if (!result.success) {
      return c.json("Bad request", 400);
    }
  }),
  zValidator("param", idSchema),
  async (c) => {
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
  },
);

//Eyða
app.delete("/:id", zValidator("param", idSchema), async (c) => {
  const id = c.req.valid("param").id;

  await prisma.user.delete({
    where: {
      id: id,
    },
  });

  return c.json(204);
});
