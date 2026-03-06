import { Hono } from "hono";
import { prisma } from '../prisma.js'
import {zValidator} from '@hono/zod-validator'
import {pagingSchema, createImageSchema,updateImageSchema} from "../schema.zod.js"
import {authenticateAdmin, authenticate} from "../authentication/jwtauth.js"

export const imageApi = new Hono();

//ná í 
imageApi.get('/',authenticate,zValidator('query',pagingSchema) ,async(c)=>{
    const limit=c.req.valid('query').limit
    const offset =c.req.valid('query').offset

    const image = await prisma.image.findMany({skip:offset, take:limit});

    const imageCount = await prisma.image.count()

    const response = {
        data: image,
        paging: {
            limit,
            offset,
            count: imageCount
            }
        }

    return c.json(response,200)

})

//Ná í eftir id eða slug
imageApi.get('/:id',authenticate,zValidator('query',pagingSchema) ,async(c)=>{
    const id = c.req.param('id')

    const image = await prisma.image.findUnique({
        where: { id: Number(id) },
    });

    if (!image) {
        return c.json({ error: 'no such image' }, 404);
    }

    const response = {
        data: image
    }

    return c.json(response,200)

})

//Búa til
imageApi.post('/',authenticateAdmin,zValidator('query',createImageSchema,(result, c) => { if (!result.success) {
      return c.json("Bad request",400)}}), async(c)=>{
        const image=c.req.valid('query').image
        const eventId =c.req.valid('query').eventId

        const newImage = await prisma.image.create({
            data:{
                image:image,
                eventId:eventId
            }
        })

        const response = {
            data: newImage,

        }

        return c.json(response,201)
      })


//Uppfæra
imageApi.put('/:id',authenticateAdmin,zValidator('query',updateImageSchema,(result, c) => {if (!result.success) {
      return c.json("Bad request",400)}}), async(c)=>{
        const id = c.req.param('id')
        const image=c.req.valid('query').image
        const eventId =c.req.valid('query').eventId

        const updatedImage=await prisma.image.update({
            where: {id:Number(id),},
                data:{
                image:image,
                eventId:eventId
                },
            
            });

        const response = {
            data: updatedImage
        }

        return c.json(response,200)

      })
    

//Eyða
imageApi.delete('/:id',authenticateAdmin,zValidator('query',pagingSchema) ,async(c)=>{
    const id = c.req.param('id')

    await prisma.image.delete({
    where: {
        id:Number(id),},});

    return c.json(204)
})
