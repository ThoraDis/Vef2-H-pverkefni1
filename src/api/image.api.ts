import { Hono } from "hono";
import { prisma } from '../prisma.js'
import {zValidator} from '@hono/zod-validator'
import {pagingSchema, createImageSchema,updateImageSchema, idSchema} from "../schema.zod.js"
import {authenticateAdmin, authenticate} from "../authentication/jwtauth.js"

export const imageApi = new Hono();

//ná í 
imageApi.get('/',authenticate,zValidator('query',pagingSchema) ,async(c)=>{
    const limit=c.req.valid('query').limit
    const offset =c.req.valid('query').offset

    try{
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
    }

    catch(err){
        return c.json(err,400)
    }

})

//Ná í eftir id eða slug
imageApi.get('/:id',authenticate, zValidator("param", idSchema),async(c)=>{
    const id = c.req.valid("param").id;

    try{
        const image = await prisma.image.findUnique({
            where: { id: id },
        });

        if (!image) {
            return c.json({ error: 'no such image' }, 404);
        }

        const response = {
            data: image
        }

        return c.json(response,200)
    
    }catch(err){
        return c.json(err,400)
    }

})

//Búa til
imageApi.post('/',authenticateAdmin,zValidator('json',createImageSchema,(result, c) => { if (!result.success) {
      return c.json("Bad request",400)}}), async(c)=>{
    const image=c.req.valid('json').image
    const eventId =c.req.valid('json').eventId

    try{
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


    }catch(err){
        return c.json(err,400)
    }
})


//Uppfæra
imageApi.put('/:id',authenticateAdmin, zValidator("param", idSchema),zValidator('json',updateImageSchema,(result, c) => {if (!result.success) {
      return c.json("Bad request",400)}}), async(c)=>{
    const id = c.req.valid("param").id;
    const image=c.req.valid('json').image
    const eventId =c.req.valid('json').eventId
    try{
        const updatedImage=await prisma.image.update({
            where: {id:id,},
                data:{
                image:image,
                eventId:eventId
                },
            
            });

        const response = {
            data: updatedImage
        }

        return c.json(response,200)
    }catch(err){
        return c.json(err,400)
    }

})
    

//Eyða
imageApi.delete('/:id',authenticateAdmin, zValidator("param", idSchema),async(c)=>{
    const id = c.req.valid("param").id;
    try{
        await prisma.image.delete({
        where: {id:id,},});

        return c.json(204)
    }catch(err){
        return c.json(err,400)
    }
})
