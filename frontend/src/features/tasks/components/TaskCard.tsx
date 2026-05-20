import React from 'react';
import type { Task } from '../types/tasks.types';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const isDone = task.status === 'done';
  
  // Formatear la fecha ISO a algo legible
  const formattedDate = new Date(task.dueDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[160px]">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className={`font-semibold tracking-tight text-slate-800 text-base ${isDone ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </h3>
          <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full uppercase tracking-wider ${
            isDone ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {isDone ? 'Completada' : 'Pendiente'}
          </span>
        </div>
        <p className={`text-sm text-slate-600 line-clamp-2 ${isDone ? 'text-slate-400' : ''}`}>
          {task.description || 'Sin descripción proporcionada.'}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span>Vence: {formattedDate}</span>
        </div>
      </div>
    </div>
  );
};