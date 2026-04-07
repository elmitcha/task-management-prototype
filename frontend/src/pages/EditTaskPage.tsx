import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { TaskForm, type TaskFormData } from '@/components';
import { useTasks, useTask } from '@/hooks';
import { fr } from '@/locales/fr';

export const EditTaskPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { updateTask } = useTasks();

  const { data: task, isLoading, isError } = useTask(id);

  const handleUpdate = (data: TaskFormData) => {
    if (!id) return;

    updateTask(
      {
        id,
        data: {
          ...data,
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : '',
        },
      },
      {
        onSuccess: () => navigate('/'),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-500 animate-pulse">
          Chargement de la tâche...
        </p>
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-slate-900">Tâche introuvable</h2>
        <p className="text-slate-500 mt-2 mb-6">
          Cette tâche n'existe pas ou a été supprimée.
        </p>
        <button
          onClick={() => navigate('/')}
          className="text-indigo-600 font-semibold hover:underline"
        >
          Retourner à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
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
              Modifier la tâche
            </h1>
            <p className="text-slate-500 text-sm mt-1">ID: {id}</p>
          </header>

          <TaskForm
            initialData={task}
            onSubmit={handleUpdate}
            onCancel={() => navigate('/')}
          />
        </div>
      </div>
    </div>
  );
};

export default EditTaskPage;
