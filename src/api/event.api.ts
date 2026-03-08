import { Hono } from "hono";
import { prisma } from '../prisma.js'
import {zValidator} from '@hono/zod-validator'
import {pagingSchema, updateEventSchema,createEventSchema,idSchema} from "../schema.zod.js"
import {authenticateAdmin, authenticate} from "../authentication/jwtauth.js"

export const eventApi = new Hono();

//ná í 
eventApi.get('/',authenticate,zValidator('query',pagingSchema) ,async(c)=>{

    const limit=c.req.valid('query').limit
    const offset =c.req.valid('query').offset

    try{
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

    catch(err){
        return c.json(err,400)
    }

})

//Ná í eftir id eða slug
eventApi.get('/:id', zValidator("param", idSchema) ,async(c)=>{
    const id = c.req.valid("param").id;
    try{
        const event = await prisma.event.findUnique({
            where: { id: id },
        });

        if (!event) {
            return c.json({ error: 'No such event' }, 404);
        }

        const response = {
            data: event
        }

        return c.json(response,200)
    }
    catch(err){
        return c.json(err,400)
    }
})

//Búa til
eventApi.post('/',authenticateAdmin,zValidator('json',createEventSchema,(result, c) => { if (!result.success) {
      return c.json("Bad request",400)}}), async(c)=>{

    const title=c.req.valid('json').title
    const description =c.req.valid('json').description
    const soldOut =c.req.valid('json').soldOut
    const placeID =c.req.valid('json').placeID

    try{ 
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
    }
    catch(err){
        return c.json(err,400)
    }
})


//Uppfæra
eventApi.put('/:id',authenticateAdmin, zValidator("param", idSchema),zValidator('json',updateEventSchema,(result, c) => {
    if (!result.success) {return c.json("Bad request",400)}}), async(c)=>{

    const id = c.req.valid("param").id;
    const title=c.req.valid('json').title
    const description =c.req.valid('json').description
    const soldOut =c.req.valid('json').soldOut
    const placeID =c.req.valid('json').placeID

    try{
        const updatedEvent=await prisma.event.update({
            where: {id:id,},
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
    }
    catch(err){
        return c.json(err,400)
    }
})
    

//Eyða
eventApi.delete('/:id', zValidator("param", idSchema),authenticateAdmin,async(c)=>{
    const id = c.req.valid("param").id;

    try{
        await prisma.event.delete({
        where: {
            id:id,},});

        return c.status(204)
    }catch(err){
        return c.json(err,400)
    }
})
