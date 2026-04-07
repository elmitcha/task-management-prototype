import { renderHook, waitFor } from '@testing-library/react';
import { useTasks } from '../useTasks';
import { tasksService } from '@/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mockTask } from '@/test/mocks';

vi.mock('@/api', () => ({
  tasksService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedTasksService = vi.mocked(tasksService);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTasks Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait charger les tâches avec succès', async () => {
    const mockApiResponse = {
      data: [mockTask],
      meta: { count: 1, totalPages: 1, currentPage: 1, take: 10 },
    };

    mockedTasksService.getAll.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    expect(result.current.tasks[0].title).toBe(mockTask.title);
  });

  it('devrait appeler le service de suppression', async () => {
    mockedTasksService.delete.mockResolvedValue(undefined);

    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper(),
    });

    result.current.deleteTask('1');

    await waitFor(() => {
      expect(mockedTasksService.delete).toHaveBeenCalledWith('1');
    });
  });
});
