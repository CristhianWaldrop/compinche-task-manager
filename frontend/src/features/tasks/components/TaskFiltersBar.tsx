import React from 'react';
import type { TaskFilters } from '../types/tasks.types';

interface TaskFiltersBarProps {
  filters: TaskFilters;
  onFilterChange: (newStatus: 'all' | 'pending' | 'done') => void;
}

export const TaskFiltersBar: React.FC<TaskFiltersBarProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-500">Filtrar por:</span>
        <div className="inline-flex rounded-lg bg-slate-100 p-1">
          {(['all', 'pending', 'done'] as const).map((status) => (
            <button
              key={status}
              onClick={() => onFilterChange(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                filters.status === status
                  ? 'bg-white text-brand-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status === 'all' ? 'Todas' : status === 'pending' ? 'Pendientes' : 'Completadas'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Botón de acción rápida que usaremos más adelante para abrir el modal de creación */}
      <button className="bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm py-2 px-4 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Nueva Tarea
      </button>
    </div>
  );
};