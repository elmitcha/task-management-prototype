import { vi, describe, it, expect, beforeEach } from 'vitest';
import { tasksService } from '../tasks.service';
import { apiClient } from '../client';
import { PAGINATION } from '@/constants';
import { Priority, TaskStatus, type Task, type ApiResponse } from '@/types';

vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApiClient = vi.mocked(apiClient);

const mockTask: Task = {
  id: '1',
  title: 'Test Service',
  description: 'Vérifier les appels API',
  status: TaskStatus.TODO,
  priority: Priority.MEDIUM,
  dueDate: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('tasksService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('devrait appeler GET /tasks avec les paramètres de pagination par défaut', async () => {
      const mockResponse: ApiResponse<Task[]> = {
        data: [mockTask],
        meta: { count: 1, totalPages: 1, currentPage: 1, take: 10 },
      };

      mockedApiClient.get.mockResolvedValue({ data: mockResponse });

      const result = await tasksService.getAll();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/tasks', {
        params: {
          page: PAGINATION.DEFAULT_PAGE,
          take: PAGINATION.ITEMS_PER_PAGE,
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('devrait appeler GET /tasks avec des paramètres personnalisés', async () => {
      mockedApiClient.get.mockResolvedValue({ data: { data: [] } });

      await tasksService.getAll(2, 50);

      expect(mockedApiClient.get).toHaveBeenCalledWith('/tasks', {
        params: { page: 2, take: 50 },
      });
    });
  });

  describe('getById', () => {
    it('devrait appeler GET /tasks/:id', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockTask });

      const result = await tasksService.getById('123');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/tasks/123');
      expect(result).toEqual(mockTask);
    });
  });

  describe('create', () => {
    it('devrait appeler POST /tasks avec le payload', async () => {
      const newTask: Partial<Task> = { title: 'New Task' };
      mockedApiClient.post.mockResolvedValue({
        data: { ...mockTask, ...newTask },
      });

      const result = await tasksService.create(newTask);

      expect(mockedApiClient.post).toHaveBeenCalledWith('/tasks', newTask);
      expect(result.title).toBe('New Task');
    });
  });

  describe('update', () => {
    it('devrait appeler PATCH /tasks/:id avec les données de mise à jour', async () => {
      const updateData: Partial<Task> = { status: TaskStatus.DONE };
      mockedApiClient.patch.mockResolvedValue({
        data: { ...mockTask, ...updateData },
      });

      const result = await tasksService.update('1', updateData);

      expect(mockedApiClient.patch).toHaveBeenCalledWith(
        '/tasks/1',
        updateData,
      );
      expect(result.status).toBe(TaskStatus.DONE);
    });
  });

  describe('delete', () => {
    it('devrait appeler DELETE /tasks/:id', async () => {
      mockedApiClient.delete.mockResolvedValue({ data: {} });

      await tasksService.delete('1');

      expect(mockedApiClient.delete).toHaveBeenCalledWith('/tasks/1');
    });
  });
});
