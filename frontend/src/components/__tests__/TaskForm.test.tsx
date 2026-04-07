import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TaskForm, type TaskFormData } from '../TaskForm';
import { Priority } from '@/types';
import { fr } from '@/locales/fr';

describe('TaskForm', () => {
  const mockSubmit = vi.fn();
  const mockCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait afficher des erreurs de validation pour un titre trop court', async () => {
    render(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    const input = screen.getByLabelText(/titre/i);
    fireEvent.change(input, { target: { value: 'ab' } });

    fireEvent.click(screen.getByRole('button', { name: /confirmer/i }));

    const error = await screen.findByText(/au moins 3 caractères/i);
    expect(error).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('devrait soumettre les données correctement', async () => {
    render(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    fireEvent.change(screen.getByLabelText(/Titre de la tâche/i), {
      target: { value: 'Acheter du lait' },
    });
    fireEvent.change(screen.getByLabelText(/Date d'échéance/i), {
      target: { value: '2024-12-31' },
    });
    fireEvent.change(screen.getByLabelText(/Priorité/i), {
      target: { value: Priority.HIGH },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Aller au supermarché' },
    });

    const submitBtn = screen.getByRole('button', {
      name: new RegExp(fr.common.confirm, 'i'),
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
      const submittedData = mockSubmit.mock.calls[0][0];

      expect(submittedData).toMatchObject({
        title: 'Acheter du lait',
        dueDate: '2024-12-31',
        priority: Priority.HIGH,
        description: 'Aller au supermarché',
      });
    });
  });

  it('devrait pré-remplir le formulaire avec initialData', () => {
    const initialData: Partial<TaskFormData> = {
      title: 'Tâche existante',
      priority: Priority.LOW,
      description: 'Ma description',
    };

    render(
      <TaskForm
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        initialData={initialData}
      />,
    );

    expect(screen.getByDisplayValue('Tâche existante')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Ma description')).toBeInTheDocument();
    expect(screen.getByDisplayValue(Priority.LOW)).toBeInTheDocument();
  });
});
