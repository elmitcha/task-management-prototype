import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { TaskListPage } from '../TaskListPage';
import { useTasks } from '@/hooks';
import { TaskStatus, Priority, type Task } from '@/types';
import { fr } from '@/locales/fr';

vi.mock('@/hooks', () => ({
  useTasks: vi.fn(),
}));

const mockedUseTasks = vi.mocked(useTasks);

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Desc 1',
    status: TaskStatus.TODO,
    priority: Priority.MEDIUM,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: '2024-12-31T23:59:59.000Z',
  },
];

describe('TaskListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <TaskListPage />
      </BrowserRouter>,
    );

  it('affiche le loader pendant le chargement', () => {
    mockedUseTasks.mockReturnValue({
      tasks: [],
      meta: undefined,
      isLoading: true,
      isError: false,
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      isDeleting: false,
    });

    renderComponent();
    expect(screen.getByText(fr.common.loading)).toBeInTheDocument();
  });

  it("affiche un message d'erreur en cas d'échec", () => {
    mockedUseTasks.mockReturnValue({
      tasks: [],
      meta: undefined,
      isLoading: false,
      isError: true,
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      isDeleting: false,
    });

    renderComponent();
    expect(screen.getByText(fr.common.error)).toBeInTheDocument();
  });

  it('affiche la liste des tâches et gère la navigation vers la création', () => {
    mockedUseTasks.mockReturnValue({
      tasks: mockTasks,
      meta: { count: 1, totalPages: 1, currentPage: 1, take: 10 },
      isLoading: false,
      isError: false,
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      isDeleting: false,
    });

    renderComponent();

    expect(screen.getByText('Task 1')).toBeInTheDocument();

    const createBtn = screen.getByRole('button', {
      name: new RegExp(fr.header.newBtn, 'i'),
    });
    fireEvent.click(createBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/create');
  });

  it('ouvre la modal de confirmation et supprime une tâche', () => {
    const mockDeleteTask = vi.fn();
    mockedUseTasks.mockReturnValue({
      tasks: mockTasks,
      meta: { count: 1, totalPages: 1, currentPage: 1, take: 10 },
      isLoading: false,
      isError: false,
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: mockDeleteTask,
      isDeleting: false,
    });

    renderComponent();

    const deleteButton = screen.getByRole('button', { name: /supprimer/i });
    fireEvent.click(deleteButton);

    expect(screen.getByText(fr.common.confirmDelete)).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: fr.common.delete });
    fireEvent.click(confirmBtn);

    expect(mockDeleteTask).toHaveBeenCalledWith('1');
  });

  it("navigue vers la page d'édition au clic sur une tâche", () => {
    mockedUseTasks.mockReturnValue({
      tasks: mockTasks,
      meta: { count: 1, totalPages: 1, currentPage: 1, take: 10 },
      isLoading: false,
      isError: false,
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      isDeleting: false,
    });

    renderComponent();

    const taskItem = screen.getByText('Task 1');
    fireEvent.click(taskItem);

    expect(mockNavigate).toHaveBeenCalledWith('/edit/1');
  });
});
