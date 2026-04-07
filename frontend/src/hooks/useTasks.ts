import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksService } from '@/api';
import type { Task } from '@/types';
import { PAGINATION } from '@/constants';

export const useTasks = (
  page = PAGINATION.DEFAULT_PAGE,
  take = PAGINATION.ITEMS_PER_PAGE,
) => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks', { page, take }],
    queryFn: () => tasksService.getAll(page, take),
  });

  const createTaskMutation = useMutation({
    mutationFn: (newTask: Partial<Task>) => tasksService.create(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      tasksService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => tasksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks: tasksQuery.data?.data ?? [],
    meta: tasksQuery.data?.meta,
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    isDeleting: deleteTaskMutation.isPending,
  };
};
