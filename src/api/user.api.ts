import { Hono } from "hono";
import { prisma } from '../prisma.js'
import {zValidator} from '@hono/zod-validator'
import {pagingSchema} from "../schema.zod.js"

export const app = new Hono();

//ná í 
app.get('/',zValidator('query',pagingSchema) ,async(c)=>{)

//Ná í eftir id eða slug
app.get('/:id',zValidator('query',pagingSchema) ,async(c)=>{})

//Búa til
app.post('/',zValidator('query',createUserSchema,(result, c) => { if (!result.success) {
      return c.json("Bad request",400)}}), async(c)=>{})


//Uppfæra
app.put('/:id',zValidator('query',updateUserSchema,(result, c) => {
    if (!result.success) {
      return c.json("Bad request",400)
    }
  }), async(c)=>{})
    

//Eyða
app.delete('/:id',zValidator('query',pagingSchema) ,async(c)=>{})