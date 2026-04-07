import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { CreateTaskPage } from '../CreateTaskPage';
import { useTasks } from '@/hooks';
import { Priority } from '@/types';
import { fr } from '@/locales/fr';

vi.mock('@/hooks', () => ({
  useTasks: vi.fn(),
}));

const mockedUseTasks = vi.mocked(useTasks);

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('CreateTaskPage', () => {
  const mockCreateTask = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseTasks.mockReturnValue({
      tasks: [],
      meta: undefined,
      isLoading: false,
      isError: false,
      createTask: mockCreateTask,
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      isDeleting: false,
    });
  });

  it('devrait soumettre les données et naviguer vers la liste', async () => {
    render(
      <BrowserRouter>
        <CreateTaskPage />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByLabelText(/titre/i), {
      target: { value: 'Nouvelle tâche' },
    });

    const submitBtn = screen.getByRole('button', {
      name: new RegExp(fr.common.confirm, 'i'),
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Nouvelle tâche',
          priority: Priority.MEDIUM,
        }),
        expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      );
    });
  });

  it('devrait retourner à la liste lors du clic sur annuler', () => {
    render(
      <BrowserRouter>
        <CreateTaskPage />
      </BrowserRouter>,
    );

    const backBtn = screen.getByRole('button', { name: /retour/i });
    fireEvent.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
