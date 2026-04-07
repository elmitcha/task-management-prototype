import { Search, Filter } from 'lucide-react';
import { TaskStatus } from '@/types';

interface TaskFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: string) => void;
}

export const TaskFilters = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: TaskFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Rechercher une tâche..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex items-center gap-2">
        <Filter className="text-slate-400" size={18} />
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les statuts</option>
          <option value={TaskStatus.TODO}>À faire</option>
          <option value={TaskStatus.IN_PROGRESS}>En cours</option>
          <option value={TaskStatus.DONE}>Terminé</option>
        </select>
      </div>
    </div>
  );
};
