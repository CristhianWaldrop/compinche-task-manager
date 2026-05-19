import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tasksService } from '../services/tasks.service';
import type { TaskFilters } from '../types/tasks.types';
import { TaskFiltersBar } from '../components/TaskFiltersBar';
import { TaskCard } from '../components/TaskCard';
import { useAuth } from '../../../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user, logoutUser } = useAuth();
  
  // Estado de filtros y paginación acoplados
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    page: 1,
    limit: 6, // Traer de 6 en 6 se acomoda excelente en grillas de 3 columnas
  });

  // Query asíncrona dependiente del estado de filtros
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksService.getTasks(filters),
    placeholderData: (previousData) => previousData, // Evita parpadeos molestos en la UI al cambiar de página
  });

  const handleStatusFilterChange = (newStatus: 'all' | 'pending' | 'done') => {
    setFilters((prev) => ({ ...prev, status: newStatus, page: 1 })); // Resetear a página 1 al cambiar filtro
  };

  const handlePageChange = (newPage: number) => {
    if (data && newPage >= 1 && newPage <= data.meta.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra de Navegación del Sistema */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg">✓</div>
            <span className="font-bold text-slate-800 tracking-tight text-lg">TaskCompinche</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            <button
              onClick={logoutUser}
              className="text-sm text-red-600 hover:text-red-700 font-medium border border-red-100 hover:border-red-200 bg-red-50/50 py-1.5 px-3 rounded-lg transition-all"
            >
              Salir
            </button>
          </div>
        </div>
      </nav>

      {/* Contenedor Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Componente de Filtros */}
        <div className="mb-6">
          <TaskFiltersBar filters={filters} onFilterChange={handleStatusFilterChange} />
        </div>

        {/* Estados de Carga y Error de la API */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-brand-600 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-slate-500 text-sm">Cargando tus tareas desde el servidor...</p>
          </div>
        )}

        {isError && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-center text-red-700 text-sm">
            Ocurrió un error al intentar sincronizar las tareas. Por favor intenta de nuevo.
          </div>
        )}

        {/* Listado de Tareas */}
        {!isLoading && !isError && (
          <>
            {data?.data.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 p-8">
                <p className="text-slate-400 font-medium">No se encontraron tareas con el filtro seleccionado.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}

            {/* Sistema de Paginación Avanzada */}
            {data && data.meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-slate-200/60 pt-4">
                <span className="text-xs text-slate-500 font-medium">
                  Mostrando página {data.meta.page} de {data.meta.totalPages} (Total: {data.meta.total} tareas)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === data.meta.totalPages}
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};