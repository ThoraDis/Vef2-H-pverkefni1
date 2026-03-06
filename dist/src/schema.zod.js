import { z } from "zod";
export const pagingSchema = z.object({
    limit: z.coerce.number().min(1).max(100).optional().default(10),
    offset: z.coerce.number().min(0).max(100).optional().default(0),
});
export const idSchema = z.object({
    id: z.coerce.number().int().min(0),
});
export const createEventSchema = z.object({
    title: z.coerce.string().min(1).max(256),
    description: z.coerce.string().min(1).max(256),
    soldOut: z.coerce.boolean().default(false),
    placeID: z.coerce.number(),
});
export const createImageSchema = z.object({
    image: z.coerce.string().min(1),
    eventId: z.coerce.number(),
});
export const createMediaSchema = z.object({
    facebook: z.coerce.string().min(1).max(256),
    website: z.coerce.string().min(1).max(256),
    eventId: z.coerce.number(),
});
export const createPlaceSchema = z.object({
    email: z.coerce.string().min(1).max(256),
    address: z.coerce.string().min(1).max(256),
});
export const createTicketSchema = z.object({
    eventId: z.coerce.number(),
    userId: z.coerce.number(),
});
export const createUserSchema = z.object({
    username: z.coerce.string().min(1).max(256),
    email: z.coerce.string().min(1).max(256),
    password: z.coerce.string().min(4).max(256),
});
export const updateEventSchema = z.object({
    title: z.coerce.string().min(1).max(256).optional(),
    description: z.coerce.string().min(1).max(256).optional(),
    soldOut: z.coerce.boolean().optional(),
    placeID: z.coerce.number().optional(),
});
export const updateImageSchema = z.object({
    image: z.coerce.string().min(1).optional(),
    eventId: z.coerce.number().optional(),
});
export const updateMediaSchema = z.object({
    facebook: z.coerce.string().min(1).max(256).optional(),
    website: z.coerce.string().min(1).max(256).optional(),
    eventID: z.coerce.number().optional(),
});
export const updatePlaceSchema = z.object({
    email: z.coerce.string().min(1).max(256).optional(),
    address: z.coerce.string().min(1).max(256).optional(),
});
export const updateTicketSchema = z.object({
    eventId: z.coerce.number().optional(),
    userId: z.coerce.number().optional(),
});
export const updateUserSchema = z.object({
    email: z.coerce.string().min(1).max(256).optional(),
});
export const loginUserSchema = z.object({
    email: z.coerce.string().min(1).max(256).optional(),
    password: z.coerce.string().min(4).max(256),
});
