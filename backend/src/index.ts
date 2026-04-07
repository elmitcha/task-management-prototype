import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { tasksRoutes } from './modules/tasks/tasks.controller.js';
import { AppError } from './core/app-error.js';

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});

await fastify.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'CodesGenius Task API',
      description: 'API de gestion de tâches avec Prisma 7 et Fastify',
      version: '1.0.0',
    },
  },
});

await fastify.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

await fastify.register(tasksRoutes, { prefix: '/api/tasks' });

fastify.setErrorHandler((error, _request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
  }

  fastify.log.error(error);
  return reply.status(500).send({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Une erreur inattendue est survenue',
      details: {},
    },
  });
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Serveur prêt sur http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
