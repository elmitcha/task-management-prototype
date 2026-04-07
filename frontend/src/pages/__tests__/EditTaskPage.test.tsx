import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter, useParams, useNavigate } from 'react-router-dom';
import { EditTaskPage } from '../EditTaskPage';
import { useTask, useTasks } from '@/hooks';
import { Priority, TaskStatus, type Task } from '@/types';

vi.mock('@/hooks', () => ({
  useTask: vi.fn(),
  useTasks: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

const mockedUseTask = vi.mocked(useTask);
const mockedUseTasks = vi.mocked(useTasks);
const mockedUseParams = vi.mocked(useParams);
const mockedUseNavigate = vi.mocked(useNavigate);

const mockTask: Task = {
  id: 'task-123',
  title: 'Tâche à modifier',
  description: 'Ancienne description',
  status: TaskStatus.IN_PROGRESS,
  priority: Priority.MEDIUM,
  dueDate: '2024-05-20T00:00:00.000Z',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('EditTaskPage', () => {
  const mockNavigate = vi.fn();
  const mockUpdateTask = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseParams.mockReturnValue({ id: 'task-123' });
    mockedUseNavigate.mockReturnValue(mockNavigate);

    mockedUseTasks.mockReturnValue({
      tasks: [],
      meta: undefined,
      isLoading: false,
      isError: false,
      createTask: vi.fn(),
      updateTask: mockUpdateTask,
      deleteTask: vi.fn(),
      isDeleting: false,
    });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <EditTaskPage />
      </BrowserRouter>,
    );

  it('affiche le loader pendant la récupération de la tâche', () => {
    mockedUseTask.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      isFetching: true,
      status: 'pending',
    } as ReturnType<typeof useTask>);

    renderComponent();
    expect(screen.getByText(/chargement de la tâche/i)).toBeInTheDocument();
  });

  it("affiche un message d'erreur si la tâche n'existe pas", () => {
    mockedUseTask.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Not Found'),
      isFetching: false,
      status: 'error',
    } as ReturnType<typeof useTask>);

    renderComponent();
    expect(screen.getByText(/tâche introuvable/i)).toBeInTheDocument();

    const backBtn = screen.getByRole('button', {
      name: /retourner à la liste/i,
    });
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('affiche le formulaire pré-rempli et gère la mise à jour', async () => {
    mockedUseTask.mockReturnValue({
      data: mockTask,
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
      status: 'success',
    } as ReturnType<typeof useTask>);

    renderComponent();

    const inputTitle = screen.getByLabelText(/titre/i) as HTMLInputElement;
    expect(inputTitle.value).toBe('Tâche à modifier');

    fireEvent.change(inputTitle, { target: { value: 'Tâche mise à jour' } });

    const submitBtn = screen.getByRole('button', { name: /confirmer/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'task-123',
          data: expect.objectContaining({
            title: 'Tâche mise à jour',
          }),
        }),
        expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      );
    });
  });

  it('appelle navigate("/") lors du clic sur le bouton annuler', () => {
    mockedUseTask.mockReturnValue({
      data: mockTask,
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
      status: 'success',
    } as ReturnType<typeof useTask>);

    renderComponent();

    const cancelBtn = screen.getByLabelText('back-button');
    fireEvent.click(cancelBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
