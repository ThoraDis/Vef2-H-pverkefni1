import { Hono } from "hono";
import { prisma } from "../prisma.js";
import { zValidator } from "@hono/zod-validator";
import {
  pagingSchema,
  createTicketSchema,
  updateTicketSchema,
  idSchema,
} from "../schema.zod.js";

export const ticketApi = new Hono();

ticketApi.get("/", zValidator("query", pagingSchema), async (c) => {
  const limit = c.req.valid("query").limit;
  const offset = c.req.valid("query").offset;

  const ticket = await prisma.ticket.findMany({ skip: offset, take: limit });

  const ticketCount = await prisma.ticket.count();

  const response = {
    data: ticket,
    paging: {
      limit,
      offset,
      count: ticketCount,
    },
  };

  return c.json(response, 200);
});

//Ná í eftir id eða slug
ticketApi.get("/:id", zValidator("param", idSchema), async (c) => {
  const id = c.req.valid("param").id;

  const ticket = await prisma.ticket.findUnique({ where: { id: id } });

  if (!ticket) {
    return c.json({ error: "No such ticket" }, 404);
  }

  return c.json(ticket, 200);
});

//Búa til
ticketApi.post(
  "/",
  zValidator("json", createTicketSchema, (result, c) => {
    if (!result.success) {
      console.log(result);

      return c.json("Bad request", 400);
    }
  }),
  async (c) => {
    const eventId = c.req.valid("json").eventId;
    const userId = c.req.valid("json").userId;

    const newTicket = await prisma.ticket.create({
      data: {
        eventId: eventId,
        userId: String(userId),
      },
    });

    const response = {
      data: newTicket,
    };

    return c.json(response, 201);
  },
);

//Uppfæra
ticketApi.put(
  "/:id",
  zValidator("json", updateTicketSchema, (result, c) => {
    if (!result.success) {
      return c.json("Bad request", 400);
    }
  }),
  zValidator("param", idSchema),
  async (c) => {
    const id = c.req.valid("param").id;

    const eventId = c.req.valid("json").eventId;
    const userId = c.req.valid("json").userId;

    const newTicket = await prisma.ticket.update({
      where: { id: id },
      data: {
        eventId: eventId,
        userId: userId,
      },
    });

    const response = {
      data: newTicket,
    };

    return c.json(response, 200);
  },
);

//Eyða
ticketApi.delete("/:id", zValidator("param", idSchema), async (c) => {
  const id = c.req.valid("param").id;

  await prisma.ticket.delete({
    where: {
      id: id,
    },
  });

  return c.json(204);
});
