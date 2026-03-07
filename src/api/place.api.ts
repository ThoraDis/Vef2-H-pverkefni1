import { Hono } from "hono";
import { prisma } from '../prisma.js'
import {zValidator} from '@hono/zod-validator'
import {pagingSchema,createPlaceSchema,updatePlaceSchema} from "../schema.zod.js"
import {authenticateAdmin, authenticate} from "../authentication/jwtauth.js"

export const placeApi = new Hono();

//ná í 
placeApi.get('/',authenticate,zValidator('json',pagingSchema) ,async(c)=>{
    const limit=c.req.valid('json').limit
    const offset =c.req.valid('json').offset

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
placeApi.get('/:id',authenticate,zValidator('json',pagingSchema) ,async(c)=>{
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
placeApi.post('/',authenticateAdmin,zValidator('json',createPlaceSchema,(result, c) => { if (!result.success) {
      return c.json("Bad request",400)}}), async(c)=>{
        const email=c.req.valid('json').email
        const address =c.req.valid('json').address
        //const events = c.req.valid('json').events

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
placeApi.put('/:id',authenticateAdmin,zValidator('json',updatePlaceSchema,(result, c) => {if (!result.success) {
    return c.json("Bad request",400)}}), async(c)=>{
        const id = c.req.param('id')
        const email=c.req.valid('json').email
        const address =c.req.valid('json').address
        //const events = c.req.valid('json').events


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
placeApi.delete('/:id',authenticateAdmin,zValidator('json',pagingSchema) ,async(c)=>{
    const id = c.req.param('id')

    await prisma.image.delete({
    where: {
        id:Number(id),},});

    return c.json(204)
})
