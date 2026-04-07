import { Clock, Trash2, CheckCircle, Circle } from 'lucide-react';
import type { Task } from '@/types';
import { Priority, TaskStatus } from '@/types';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string, currentStatus: TaskStatus) => void;
  onDeleteRequest: (task: Task) => void;
  onClick: () => void;
}

export const TaskCard = ({
  task,
  onToggleStatus,
  onDeleteRequest,
  onClick,
}: TaskCardProps) => {
  const isDone = task.status === TaskStatus.DONE;

  const statusStyles = {
    [TaskStatus.TODO]: 'border-slate-200 bg-white hover:border-slate-300',
    [TaskStatus.IN_PROGRESS]:
      'border-blue-200 bg-blue-50/30 hover:border-blue-400',
    [TaskStatus.DONE]:
      'border-green-100 bg-green-50/20 opacity-75 hover:border-green-300',
  };

  const iconStyles = {
    [TaskStatus.TODO]: 'text-slate-300 hover:text-blue-500',
    [TaskStatus.IN_PROGRESS]: 'text-blue-500',
    [TaskStatus.DONE]: 'text-green-600',
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 ${statusStyles[task.status]}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(task.id, task.status);
          }}
          className={`transition-all transform hover:scale-110 ${iconStyles[task.status]}`}
        >
          {task.status === TaskStatus.DONE ? (
            <CheckCircle size={24} />
          ) : task.status === TaskStatus.IN_PROGRESS ? (
            <Clock className="animate-pulse" size={24} />
          ) : (
            <Circle size={24} />
          )}
        </button>

        <div className="flex-1">
          <h3
            className={`font-bold transition-colors ${
              task.status === TaskStatus.DONE
                ? 'line-through text-slate-400'
                : 'text-slate-800'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`text-sm mt-1 line-clamp-1 ${
                isDone ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-3">
            <span
              className={`badge ${
                task.priority === Priority.HIGH
                  ? 'badge-high'
                  : task.priority === Priority.MEDIUM
                    ? 'badge-medium'
                    : 'badge-low'
              }`}
            >
              {task.priority}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock size={12} />
              {new Date(task.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteRequest(task);
        }}
        aria-label="Supprimer la tâche"
        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
