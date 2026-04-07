import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Plus,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTasks } from '@/hooks';
import { TaskStatus, type Task } from '@/types';
import { TaskCard } from '@/components';
import { fr } from '@/locales/fr';
import { PAGINATION } from '@/constants';

export const TaskListPage = () => {
  const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const navigate = useNavigate();
  const ITEMS_PER_PAGE = PAGINATION.ITEMS_PER_PAGE;
  const { tasks, meta, isLoading, isError, updateTask, deleteTask } = useTasks(
    currentPage,
    ITEMS_PER_PAGE,
  );

  const isLastPage = currentPage >= (meta?.totalPages ?? 1);

  const handleEditTask = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleToggleStatus = (id: string, currentStatus: TaskStatus) => {
    let newStatus: TaskStatus;
    switch (currentStatus) {
      case TaskStatus.TODO:
        newStatus = TaskStatus.IN_PROGRESS;
        break;
      case TaskStatus.IN_PROGRESS:
        newStatus = TaskStatus.DONE;
        break;
      case TaskStatus.DONE:
        newStatus = TaskStatus.TODO;
        break;
      default:
        newStatus = TaskStatus.TODO;
    }
    updateTask({ id, data: { status: newStatus } });
  };

  const confirmDeletion = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <CheckCircle2 className="text-indigo-600" size={32} />
              {fr.header.title}
            </h1>
            <p className="text-slate-500 mt-1">
              {meta?.count !== undefined
                ? `${meta.count} tâches au total en base de données`
                : fr.header.subtitle}
            </p>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
          >
            <Plus size={20} />
            {fr.header.newBtn}
          </button>
        </header>

        {!isLoading && meta && meta.count > 0 && (
          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-400 italic">
                Page
              </span>
              <span className="text-lg font-bold text-indigo-600">
                {currentPage}
              </span>
            </div>

            <button
              disabled={isLastPage}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        <div className="space-y-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="animate-spin mb-2" size={40} />
              <p>{fr.common.loading}</p>
            </div>
          )}

          {isError && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle size={20} />
              <p>{fr.common.error}</p>
            </div>
          )}

          {!isLoading && tasks.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
              {fr.common.empty}
            </div>
          )}

          <div className="grid gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onDeleteRequest={setTaskToDelete}
                onClick={() => handleEditTask(task.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {taskToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              {fr.common.confirmDelete}
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => setTaskToDelete(null)}
                className="flex-1 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                {fr.common.cancel}
              </button>
              <button
                onClick={confirmDeletion}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {fr.common.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskListPage;
