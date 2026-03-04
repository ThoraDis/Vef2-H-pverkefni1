import { Hono } from "hono";
import { prisma } from '../prisma.js'
import {zValidator} from '@hono/zod-validator'
import {pagingSchema} from "../schema.zod.js"

export const app = new Hono();

//ná í 
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

//Ná í eftir id eða slug
app.get('/:id',zValidator('query',pagingSchema) ,async(c)=>{

    }
)

//Búa til
app.post('/',zValidator('query',createEventSchema,(result, c) => { if (!result.success) {
      return c.json("Bad request",400)}}), async(c)=>{})


//Uppfæra
app.put('/:id',zValidator('query',aupdateEventSchema,(result, c) => {
    if (!result.success) {
      return c.json("Bad request",400)
    }
  }), async(c)=>{})
    

//Eyða
app.delete('/:id',zValidator('query',pagingSchema) ,async(c)=>{})