import { z } from 'zod';

export const TodoItemSchema = z.object({
    title: z.string().min(1).max(255),
    finished: z.boolean().default(false),
})

export type TodoItem = z.infer<typeof TodoItemSchema>