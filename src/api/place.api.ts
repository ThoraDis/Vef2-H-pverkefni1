import { Hono } from "hono";
import { prisma } from '../prisma.js'
import {zValidator} from '@hono/zod-validator'
import {pagingSchema,createPlaceSchema,updatePlaceSchema} from "../schema.zod.js"

export const app = new Hono();

//ná í 
app.get('/',zValidator('query',pagingSchema) ,async(c)=>{
    const limit=c.req.valid('query').limit
    const offset =c.req.valid('query').offset

    const place = await prisma.place.findMany({skip:offset, take:limit});

    const placeCount = await prisma.place.count()

    const response = {
        data: place,
        paging: {
            limit,
            offset,
            count: placeCount
            }
        }

    return c.json(response,200)
})

//Ná í eftir id eða slug
app.get('/:id',zValidator('query',pagingSchema) ,async(c)=>{
    const id = c.req.param('id')

    const place = await prisma.place.findUnique({
        where: { id: Number(id) },
    });

    if (!place) {
        return c.json({ error: 'no such place' }, 404);
    }

    const response = {
        data: place
    }

    return c.json(response,200)

})

//Búa til
app.post('/',zValidator('query',createPlaceSchema,(result, c) => { if (!result.success) {
      return c.json("Bad request",400)}}), async(c)=>{
        const email=c.req.valid('query').email
        const address =c.req.valid('query').address
        //const events = c.req.valid('query').events

        const newPlace = await prisma.place.create({
            data:{
                email:email,
                address:address,
                //events
            }
        })

        const response = {
            data: newPlace,

        }

        return c.json(response,201)
      })


//Uppfæra
app.put('/:id',zValidator('query',updatePlaceSchema,(result, c) => {if (!result.success) {
    return c.json("Bad request",400)}}), async(c)=>{
        const id = c.req.param('id')
        const email=c.req.valid('query').email
        const address =c.req.valid('query').address
        //const events = c.req.valid('query').events


        const updatedPlace=await prisma.place.update({
         where: {id:Number(id),},
            data:{
                email:email,
                address:address,

                },
            
            });

        const response = {
            data: updatedPlace
        }

        return c.json(response,200)

    })
    

//Eyða
app.delete('/:id',zValidator('query',pagingSchema) ,async(c)=>{
    const id = c.req.param('id')

    await prisma.event.delete({
    where: {
        id:Number(id),},});

    return c.json(204)
})