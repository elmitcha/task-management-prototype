import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { tasksService } from './tasks.service.js';
import { createTaskSchema, getTasksQuerySchema, updateTaskSchema } from './tasks.schema.js';
import { AppError } from '../../core/app-error.js';

const taskSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    title: { type: 'string' },
    description: { type: 'string', nullable: true },
    status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELED'] },
    priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
    dueDate: { type: 'string', format: 'date-time', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const getTasksSchema = {
  schema: {
    description: 'Liste des tâches avec pagination par page',
    tags: ['Tasks'],
    querystring: {
      type: 'object',
      properties: {
        page: {
          type: 'integer',
          default: 1,
          minimum: 1,
          description: 'Le numéro de la page à récupérer',
        },
        take: {
          type: 'integer',
          default: 10,
          minimum: 1,
          maximum: 100,
          description: "Nombre d'éléments par page",
        },
        search: { type: 'string', nullable: true },
        status: {
          type: 'string',
          enum: ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELED'],
          nullable: true,
        },
      },
      additionalProperties: false,
    },
    response: {
      200: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: taskSchema,
          },
          meta: {
            type: 'object',
            properties: {
              totalCount: { type: 'number', description: 'Nombre total de tâches en base' },
              totalPages: { type: 'number', description: 'Nombre total de pages disponibles' },
              currentPage: { type: 'number' },
              itemsPerPage: { type: 'number' },
            },
          },
        },
      },
    },
  },
};

const getByIdSchema = {
  schema: {
    description: 'Récupère une tâche spécifique par son ID',
    tags: ['Tasks'],
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          description: "L'identifiant unique de la tâche (UUID)",
        },
      },
    },
    response: {
      200: taskSchema,
      404: {
        description: 'Tâche non trouvée',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          code: { type: 'string' },
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
};

const createSchema = {
  schema: {
    description: 'Crée une nouvelle tâche',
    tags: ['Tasks'],
    body: {
      type: 'object',
      required: ['title'],
      properties: {
        title: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        status: { type: 'string' },
        priority: { type: 'string' },
        dueDate: { type: 'string', format: 'date-time' },
      },
    },
    response: {
      201: taskSchema,
    },
  },
};

const updateSchema = {
  schema: {
    description: 'Met à jour partiellement une tâche existante',
    tags: ['Tasks'],
    params: {
      type: 'object',
      properties: { id: { type: 'string' } },
    },
    body: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string', nullable: true },
        status: { type: 'string' },
        priority: { type: 'string' },
        dueDate: { type: 'string', format: 'date-time' },
      },
    },
  },
};

const deleteSchema = {
  schema: {
    description: 'Supprime une tâche par son ID',
    tags: ['Tasks'],
    params: {
      type: 'object',
      properties: { id: { type: 'string' } },
    },
    response: {
      204: { description: 'Succès sans contenu', type: 'null' },
    },
  },
};

export async function tasksRoutes(fastify: FastifyInstance) {
  fastify.get('/', getTasksSchema, async (request: FastifyRequest, reply: FastifyReply) => {
    const result = getTasksQuerySchema.safeParse(request.query);

    if (!result.success) {
      throw new AppError(
        'INVALID_QUERY',
        'Paramètres de requête invalides',
        400,
        result.error.format(),
      );
    }

    const tasksData = await tasksService.getAllTasks(result.data);

    return reply.send(tasksData);
  });

  fastify.get(
    '/:id',
    getByIdSchema,
    async (request: FastifyRequest<{ Params: { id: string } }>) => {
      const task = await tasksService.getById(request.params.id);
      if (!task) {
        throw new AppError('TASK_NOT_FOUND', `La tâche ${request.params.id} n'existe pas`, 404);
      }
      return task;
    },
  );

  fastify.post('/', createSchema, async (request: FastifyRequest, reply: FastifyReply) => {
    const result = createTaskSchema.safeParse(request.body);

    if (!result.success) {
      throw new AppError(
        'VALIDATION_ERROR',
        'Données de création invalides',
        400,
        result.error.format(),
      );
    }

    const { title, description, status, priority, dueDate } = result.data;

    const newTask = await tasksService.create({
      title,
      ...(description !== undefined && { description: description ?? null }),
      ...(status !== undefined && { status }),
      ...(priority !== undefined && { priority }),
      ...(dueDate !== undefined && { dueDate }),
    });

    return reply.code(201).send(newTask);
  });

  fastify.patch(
    '/:id',
    updateSchema,
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const taskExists = await tasksService.getById(request.params.id);
      if (!taskExists) {
        throw new AppError(
          'TASK_NOT_FOUND',
          'Impossible de mettre à jour une tâche inexistante',
          404,
        );
      }

      const result = updateTaskSchema.safeParse(request.body);
      if (!result.success) {
        throw new AppError(
          'VALIDATION_ERROR',
          'Données de mise à jour invalides',
          400,
          result.error.format(),
        );
      }

      const data = result.data;
      const updatedTask = await tasksService.update(request.params.id, {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description ?? null }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
      });

      return reply.send(updatedTask);
    },
  );

  fastify.delete(
    '/:id',
    deleteSchema,
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      await tasksService.delete(request.params.id);
      return reply.code(204).send();
    },
  );
}
