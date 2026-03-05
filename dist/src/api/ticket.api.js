import { Hono } from "hono";
import { prisma } from "../prisma.js";
import { zValidator } from "@hono/zod-validator";
import { pagingSchema, createTicketSchema, updateTicketSchema, } from "../schema.zod.js";
export const ticketApi = new Hono();
//ná í
ticketApi.get("/", zValidator("query", pagingSchema), async (c) => { });
//Ná í eftir id eða slug
ticketApi.get("/:id", zValidator("query", pagingSchema), async (c) => { });
//Búa til
ticketApi.post("/", zValidator("query", createTicketSchema, (result, c) => {
    if (!result.success) {
        return c.json("Bad request", 400);
    }
}), async (c) => { });
// TODO vantar aðgerð þannig users geti keypt miða
//Uppfæra
ticketApi.put("/:id", zValidator("query", updateTicketSchema, (result, c) => {
    if (!result.success) {
        return c.json("Bad request", 400);
    }
}), async (c) => { });
//Eyða
ticketApi.delete("/:id", zValidator("query", pagingSchema), async (c) => { });
