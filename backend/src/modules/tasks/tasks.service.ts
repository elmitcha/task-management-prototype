import { db } from '../../core/db.js';
import { Prisma, TaskStatus } from '@prisma/client';
import type { GetTasksQuery } from './tasks.schema.js';

export class TasksService {
  async getAllTasks(params: GetTasksQuery) {
    const { page = 1, take = 10, status, search, sortBy = 'createdAt', order = 'desc' } = params;

    const skip = (page - 1) * take;

    const where: Prisma.TaskWhereInput = {
      AND: [
        status ? { status } : {},
        search ? { title: { contains: search, mode: 'insensitive' } } : {},
      ],
    };

    const [tasks, totalCount] = await Promise.all([
      db.task.findMany({
        where,
        take,
        skip,
        orderBy: { [sortBy]: order },
      }),
      db.task.count({ where }),
    ]);

    return {
      data: tasks,
      meta: {
        count: totalCount,
        totalPages: Math.ceil(totalCount / take),
        currentPage: page,
        take: take,
      },
    };
  }

  async create(data: Prisma.TaskCreateInput) {
    return db.task.create({ data });
  }

  async update(id: string, data: Prisma.TaskUpdateInput) {
    return db.task.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return db.task.delete({ where: { id } });
  }

  async getById(id: string) {
    return db.task.findUnique({ where: { id } });
  }
}

export const tasksService = new TasksService();
