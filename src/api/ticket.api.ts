import { Hono } from "hono";
import { prisma } from "../prisma.js";
import { zValidator } from "@hono/zod-validator";
import {
  pagingSchema,
  createTicketSchema,
  updateTicketSchema,
  idSchema
} from "../schema.zod.js";
import {authenticateAdmin, authenticate} from "../authentication/jwtauth.js"

export const ticketApi = new Hono();

//ná í
ticketApi.get("/",authenticate, zValidator("query", pagingSchema), async (c) => {});

//Ná í eftir id eða slug
ticketApi.get("/:id",authenticate, zValidator("param", idSchema), async (c) => {});

//Búa til
ticketApi.post(
  "/",authenticateAdmin,
  zValidator("json", createTicketSchema, (result, c) => {
    if (!result.success) {
      return c.json("Bad request", 400);
    }
  }),
  async (c) => {},
);

// TODO vantar aðgerð þannig users geti keypt miða

//Uppfæra
ticketApi.put(
  "/:id",authenticateAdmin,
  zValidator("json", updateTicketSchema, (result, c) => {
    if (!result.success) {
      return c.json("Bad request", 400);
    }
  }),
  async (c) => {},
);

//Eyða
ticketApi.delete("/:id", authenticateAdmin, zValidator("param", idSchema), async (c) => {});
