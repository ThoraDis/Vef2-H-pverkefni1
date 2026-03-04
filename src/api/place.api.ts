import { Hono } from "hono";
import { prisma } from '../prisma.js'
import {zValidator} from '@hono/zod-validator'
import {pagingSchema} from "../schema.zod.js"

export const app = new Hono();

app.get('/',zValidator('query',pagingSchema) ,async(c)=>{

    const limit=c.req.valid('query').limit
    const offset =c.req.valid('query').offset

    const events = await prisma.event.findMany({skip:offset, take:limit});

    const eventsCount = await prisma.event.count()

    const response = {
        data: events,
        paging: {
            limit,
            offset,
            count: eventsCount
            }
        }

    return c.json(response,200)

    }
)