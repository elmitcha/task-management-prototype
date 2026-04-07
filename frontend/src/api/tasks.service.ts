import { PAGINATION } from '@/constants';
import { apiClient } from './client';
import type { Task, ApiResponse } from '@/types';

export const tasksService = {
  getAll: async (
    page: number = PAGINATION.DEFAULT_PAGE,
    take: number = PAGINATION.ITEMS_PER_PAGE,
  ): Promise<ApiResponse<Task[]>> => {
    const response = await apiClient.get<ApiResponse<Task[]>>('/tasks', {
      params: {
        page,
        take,
      },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  create: async (data: Partial<Task>): Promise<Task> => {
    const response = await apiClient.post<Task>('/tasks', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Task>): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
