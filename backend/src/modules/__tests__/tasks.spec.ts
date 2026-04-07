import { describe, it, expect, beforeAll } from 'vitest';
import fastify from 'fastify';
import { tasksRoutes } from '../tasks/tasks.controller.js';

const app = fastify();

let idToTest: string;

beforeAll(async () => {
  await app.register(tasksRoutes, { prefix: '/api/tasks' });
  await app.ready();
});

describe('Tasks Module - Full Controller Coverage', () => {
  it('POST / - should create a task and store the ID', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      payload: { title: 'Tâche de test complète', priority: 'MEDIUM' },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    idToTest = body.id;
    expect(idToTest).toBeDefined();
  });

  it('GET / - should return a list of tasks with meta data', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/tasks',
      query: { take: '5' },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.meta).toHaveProperty('count');
  });

  it('GET /:id - should return a single task by its ID', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/api/tasks/${idToTest}`,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.id).toBe(idToTest);
    expect(body.title).toBe('Tâche de test complète');
  });

  it('GET /:id - should return 404 for a non-existing UUID', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const response = await app.inject({
      method: 'GET',
      url: `/api/tasks/${fakeId}`,
    });
    expect(response.statusCode).toBe(404);
  });

  it('PATCH /:id - should update the status of a task', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${idToTest}`,
      payload: { status: 'IN_PROGRESS' },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.status).toBe('IN_PROGRESS');
  });

  it('DELETE /:id - should delete the task and return 204 or 200', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/api/tasks/${idToTest}`,
    });

    expect([200, 204]).toContain(response.statusCode);
  });

  it('POST / - should reject invalid priority levels', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      payload: { title: 'Fail Task', priority: 'SUPER_URGENT' },
    });

    expect(response.statusCode).toBe(400);
  });
});
