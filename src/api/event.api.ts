import { Hono } from "hono";
import { prisma } from '../prisma.js'
import {zValidator} from '@hono/zod-validator'
import {pagingSchema, updateEventSchema,createEventSchema} from "../schema.zod.js"
import {authenticateAdmin, authenticate} from "../authentication/jwtauth.js"

export const eventApi = new Hono();

//ná í 
eventApi.get('/',authenticate,zValidator('query',pagingSchema) ,async(c)=>{

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
eventApi.get('/:id',authenticate,zValidator('query',pagingSchema) ,async(c)=>{
        const id = c.req.param('id')

        const event = await prisma.event.findUnique({
            where: { id: Number(id) },
        });

        if (!event) {
            return c.json({ error: 'no such event' }, 404);
        }


        const response = {
            data: event
        }

        return c.json(response,200)

    }
)

//Búa til
eventApi.post('/',authenticateAdmin,zValidator('query',createEventSchema,(result, c) => { if (!result.success) {
      return c.json("Bad request",400)}}), async(c)=>{

        const title=c.req.valid('query').title
        const description =c.req.valid('query').description
        const soldOut =c.req.valid('query').soldOut
        const placeID =c.req.valid('query').placeID

        const newEvent = await prisma.event.create({
            data:{
                title:title,
                description:description,
                soldOut:soldOut,
                placeID:placeID
            }
        })

        const response = {
            data: newEvent,

        }

        return c.json(response,201)
      })


//Uppfæra
eventApi.put('/:id',authenticateAdmin,zValidator('query',updateEventSchema,(result, c) => {
    if (!result.success) {return c.json("Bad request",400)}}), async(c)=>{

        const id = c.req.param('id')
        const title=c.req.valid('query').title
        const description =c.req.valid('query').description
        const soldOut =c.req.valid('query').soldOut
        const placeID =c.req.valid('query').placeID

        const updatedEvent=await prisma.event.update({
            where: {id:Number(id),},
                data:{
                    title:title,
                    description:description,
                    soldOut:soldOut,
                    placeID:placeID
                },
            
            });

        const response = {
            data: updatedEvent
        }

        return c.json(response,200)
    })
    

//Eyða
eventApi.delete('/:id',authenticateAdmin,zValidator('query',pagingSchema) ,async(c)=>{
    const id = c.req.param('id')

    await prisma.event.delete({
    where: {
        id:Number(id),},});

    return c.json(204)
})
