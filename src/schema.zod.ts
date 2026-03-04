import { z } from 'zod'

export const pagingSchema=z.object({
    limit:z.coerce.number().min(1).max(100).optional().default(10),
    offset: z.coerce.number().min(0).max(100).optional().default(0)
})