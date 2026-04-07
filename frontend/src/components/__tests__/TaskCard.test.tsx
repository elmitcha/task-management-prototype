import { render, screen, fireEvent } from '@testing-library/react';
import { TaskStatus, Priority, type Task } from '@/types';
import { vi, describe, it, expect } from 'vitest';
import { TaskCard } from '../TaskCard';

const mockTask: Task = {
  id: '1',
  title: 'Tâche de test',
  description: 'Une description',
  status: TaskStatus.TODO,
  priority: Priority.HIGH,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  dueDate: '2024-12-31T23:59:59.000Z',
};

describe('TaskCard', () => {
  const mockToggle = vi.fn();
  const mockDelete = vi.fn();
  const mockClick = vi.fn();

  it('devrait afficher les informations de la tâche', () => {
    render(
      <TaskCard
        task={mockTask}
        onToggleStatus={mockToggle}
        onDeleteRequest={mockDelete}
        onClick={mockClick}
      />,
    );

    expect(screen.getByText('Tâche de test')).toBeInTheDocument();
    expect(screen.getByText('Une description')).toBeInTheDocument();
    expect(screen.getByText(Priority.HIGH)).toBeInTheDocument();
  });

  it('devrait appeler onClick lors du clic sur la carte', () => {
    render(
      <TaskCard
        task={mockTask}
        onToggleStatus={mockToggle}
        onDeleteRequest={mockDelete}
        onClick={mockClick}
      />,
    );

    fireEvent.click(screen.getByText('Tâche de test'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('ne devrait PAS appeler onClick (édition) lors du clic sur la suppression', () => {
    render(
      <TaskCard
        task={mockTask}
        onToggleStatus={mockToggle}
        onDeleteRequest={mockDelete}
        onClick={mockClick}
      />,
    );

    const deleteBtn = screen.getByRole('button', { name: /supprimer/i });
    fireEvent.click(deleteBtn);
    expect(mockDelete).toHaveBeenCalled();

    expect(mockDelete).toHaveBeenCalledWith(mockTask);
  });
});
