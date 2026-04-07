import { z } from 'zod';
import { TaskStatus, Priority } from '@prisma/client';

export const createTaskSchema = z
  .object({
    title: z.string().min(1, 'Le titre est obligatoire').max(255, 'Le titre est trop long'),

    description: z.string().nullable().optional(),

    status: z.nativeEnum(TaskStatus).optional(),

    priority: z.nativeEnum(Priority).optional(),

    dueDate: z
      .string()
      .datetime()
      .optional()
      .transform((val) => (val ? new Date(val) : undefined)),
  })
  .strict();

export const updateTaskSchema = createTaskSchema.partial();

export const getTasksQuerySchema = z
  .object({
    page: z.preprocess((val) => Number(val ?? 1), z.number().min(1).default(1)),

    take: z.preprocess((val) => Number(val ?? 10), z.number().min(1).max(100).default(10)),

    status: z.nativeEnum(TaskStatus).optional(),

    search: z.string().optional(),

    sortBy: z.enum(['title', 'status', 'priority', 'createdAt']).default('createdAt'),

    order: z.enum(['asc', 'desc']).default('desc'),
  })
  .strict();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;
