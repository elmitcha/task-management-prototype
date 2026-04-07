import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TaskForm, type TaskFormData } from '@/components';
import { useTasks } from '@/hooks';
import { Priority, TaskStatus } from '@/types';
import { fr } from '@/locales/fr';

export const CreateTaskPage = () => {
  const navigate = useNavigate();
  const { createTask } = useTasks();

  const defaultValues: Partial<TaskFormData> = {
    priority: Priority.MEDIUM,
    dueDate: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
  };

  const handleCreate = (data: TaskFormData) => {
    const payload = {
      ...data,
      status: TaskStatus.TODO,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : '',
    };

    createTask(payload, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
          aria-label="Retour"
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          {fr.common.cancel}
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              {fr.header.newBtn}
            </h1>
          </header>

          <TaskForm
            initialData={defaultValues}
            onSubmit={handleCreate}
            onCancel={() => navigate('/')}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;
