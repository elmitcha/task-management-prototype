import { renderHook, waitFor } from '@testing-library/react';
import { useTask } from '../useTask';
import { tasksService } from '@/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mockTask } from '@/test/mocks';

vi.mock('@/api', () => ({
  tasksService: {
    getById: vi.fn(),
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

describe('useTask Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait récupérer une tâche par son ID', async () => {
    mockedTasksService.getById.mockResolvedValue(mockTask);

    const { result } = renderHook(() => useTask('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockTask);
    });

    expect(mockedTasksService.getById).toHaveBeenCalledWith('1');
  });

  it("ne devrait pas lancer de requête si l'ID est undefined", () => {
    const { result } = renderHook(() => useTask(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockedTasksService.getById).not.toHaveBeenCalled();
  });
});
