import { useQuery } from '@tanstack/react-query';
import { tasksService } from '@/api';

export const useTask = (id: string | undefined) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => tasksService.getById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
