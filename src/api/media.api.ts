import { Hono } from "hono";
import { prisma } from '../prisma.js'
import {zValidator} from '@hono/zod-validator'
import {pagingSchema,createMediaSchema,updateMediaSchema} from "../schema.zod.js"

export const mediaApi = new Hono();

//ná í 
mediaApi.get('/',zValidator('query',pagingSchema) ,async(c)=>{})

//Ná í eftir id eða slug
mediaApi.get('/:id',zValidator('query',pagingSchema) ,async(c)=>{})

//Búa til
mediaApi.post('/',zValidator('query',createMediaSchema,(result, c) => { if (!result.success) {
      return c.json("Bad request",400)}}), async(c)=>{})


//Uppfæra
mediaApi.put('/:id',zValidator('query',updateMediaSchema,(result, c) => {
    if (!result.success) {
      return c.json("Bad request",400)
    }
  }), async(c)=>{})
    

//Eyða
mediaApi.delete('/:id',zValidator('query',pagingSchema) ,async(c)=>{})
