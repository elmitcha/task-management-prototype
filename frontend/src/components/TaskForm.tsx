import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save } from 'lucide-react';
import { Priority } from '@/types';
import { fr } from '@/locales/fr';

const taskSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  dueDate: z.string().min(1, 'Veuillez choisir une date'),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority),
});

export type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TaskForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      priority: initialData?.priority ?? Priority.MEDIUM,
      dueDate: initialData?.dueDate
        ? initialData.dueDate.split('T')[0]
        : new Date().toISOString().split('T')[0],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Titre de la tâche
        </label>
        <input
          {...register('title')}
          id="title"
          className={`w-full p-3 rounded-xl border outline-none transition-all ${errors.title ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-indigo-500'}`}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1 italic">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Date d'échéance
        </label>
        <input
          id="dueDate"
          type="date"
          {...register('dueDate')}
          className="w-full p-3 rounded-xl border border-slate-200"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Description
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={4}
          className="w-full p-3 rounded-xl border border-slate-200 resize-none"
        />
      </div>

      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Priorité
        </label>
        <select
          {...register('priority')}
          id="priority"
          className="w-full p-3 rounded-xl border border-slate-200 bg-white"
        >
          {Object.values(Priority).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          aria-label="back-button"
          className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
        >
          {fr.common.cancel}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save size={18} />
          {fr.common.confirm}
        </button>
      </div>
    </form>
  );
};
