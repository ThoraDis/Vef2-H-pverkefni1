import { Hono } from "hono";
import { prisma } from "../prisma.js";
import { zValidator } from "@hono/zod-validator";
import {
  pagingSchema,
  createMediaSchema,
  updateMediaSchema,
  idSchema,
} from "../schema.zod.js";
import {authenticateAdmin, authenticate} from "../authentication/jwtauth.js"

export const mediaApi = new Hono();

//ná í
mediaApi.get("/",authenticate, zValidator("json", pagingSchema), async (c) => {
  const limit = c.req.valid("json").limit;
  const offset = c.req.valid("json").offset;

  const media = await prisma.media.findMany({ skip: offset, take: limit });

  const mediaCount = await prisma.media.count();

  const response = {
    data: media,
    paging: {
      limit,
      offset,
      count: mediaCount,
    },
  };

  return c.json(response, 200);
});

//Ná í eftir id eða slug
mediaApi.get("/:id",authenticate, zValidator("param", idSchema), async (c) => {
  const id = c.req.valid("param").id;

  const media = await prisma.media.findUnique({ where: { id: id } });

  if (!media) {
    return c.json({ error: "No such media" }, 404);
  }

  return c.json(media, 200);
});

//Búa til
mediaApi.post(
  "/",authenticateAdmin,
  zValidator("json", createMediaSchema, (result, c) => {
    if (!result.success) {
      return c.json("Bad request", 400);
    }
  }),
  async (c) => {
    const eventId = c.req.valid("json").eventId;
    const website = c.req.valid("json").website;
    const facebook = c.req.valid("json").facebook;

    const newMedia = await prisma.media.create({
      data: {
        eventId: eventId,
        website: website,
        facebook: facebook,
      },
    });

    const response = {
      data: newMedia,
    };

    return c.json(response, 201);
  },
);

//Uppfæra
mediaApi.put(
  "/:id",authenticateAdmin,
  zValidator("json", updateMediaSchema, (result, c) => {
    if (!result.success) {
      return c.json("Bad request", 400);
    }
  }),
  zValidator("param", idSchema),
  async (c) => {
    const id = c.req.valid("param").id;

    const eventId = c.req.valid("json").eventId;
    const website = c.req.valid("json").website;
    const facebook = c.req.valid("json").facebook;

    const newMedia = await prisma.media.update({
      where: { id: id },
      data: {
        eventId: eventId,
        website: website,
        facebook: facebook,
      },
    });
    const response = {
      data: newMedia,
    };

    return c.json(response, 200);
  },
);

//Eyða
mediaApi.delete("/:id",authenticateAdmin, zValidator("param", idSchema), async (c) => {
  const id = c.req.valid("param").id;

  await prisma.media.delete({
    where: {
      id: id,
    },
  });

  return c.json(204);
});
