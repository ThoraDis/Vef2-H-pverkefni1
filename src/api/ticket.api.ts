import { Hono } from "hono";
import { prisma } from "../prisma.js";
import { zValidator } from "@hono/zod-validator";
import {
  pagingSchema,
  createTicketSchema,
  updateTicketSchema,
  idSchema,
} from "../schema.zod.js";
import { authenticateAdmin, authenticate } from "../authentication/jwtauth.js";

export const ticketApi = new Hono();

//ná í

ticketApi.get(
  "/",
  authenticate,
  zValidator("query", pagingSchema),
  async (c) => {
    const limit = c.req.valid("query").limit;
    const offset = c.req.valid("query").offset;

    try {
      const ticket = await prisma.ticket.findMany({
        skip: offset,
        take: limit,
      });

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
    } catch (err) {
      return c.json(err, 400);
    }
  },
);

//Ná í eftir id eða slug
ticketApi.get(
  "/:id",
  authenticate,
  zValidator("param", idSchema),
  async (c) => {
    const id = c.req.valid("param").id;

    try {
      const ticket = await prisma.ticket.findUnique({ where: { id: id } });

      if (!ticket) {
        return c.json({ error: "No such ticket" }, 404);
      }

      return c.json(ticket, 200);
    } catch (err) {
      return c.json(err, 400);
    }
  },
);

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

    try {
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
    } catch (err) {
      return c.json(err, 400);
    }
  },
);

//Uppfæra
ticketApi.put(
  "/:id",
  authenticate,
  authenticateAdmin,
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

    try {
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
    } catch (err) {
      return c.json(err, 400);
    }
  },
);

//Eyða

ticketApi.delete(
  "/:id",
  authenticate,
  authenticateAdmin,
  zValidator("param", idSchema),
  async (c) => {
    const id = c.req.valid("param").id;

    try {
      await prisma.ticket.delete({
        where: { id: id },
      });

      return c.json(204);
    } catch (err) {
      return c.json(err, 400);
    }
  },
);
