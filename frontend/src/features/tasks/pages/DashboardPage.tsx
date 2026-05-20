import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksService } from '../services/tasks.service';
import type { Task, TaskFilters } from '../types/tasks.types';
import { TaskFiltersBar } from '../components/TaskFiltersBar';
import { TaskCard } from '../components/TaskCard';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { TaskDetailModal } from '../components/TaskDetailModal'; // <-- Importamos el nuevo modal
import axios from 'axios';
import type { ApiError } from '../../auth/types/auth.types';
import { useAuth } from '../../../context/useAuth';

export const DashboardPage: React.FC = () => {
  const { user, logoutUser } = useAuth();
  const queryClient = useQueryClient();
  
  // Control de Modales
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const [createError, setCreateError] = useState<string | null>(null);

  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    page: 1,
    limit: 6,
  });

  // Query: Leer tareas
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksService.getTasks(filters),
    placeholderData: (previousData) => previousData,
  });

  // Mutación: Crear tarea
  const createMutation = useMutation({
    mutationFn: tasksService.createTask,
    onSuccess: () => {
      setCreateError(null);
      setIsCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        const dataError = error.response.data as ApiError;
        setCreateError(Array.isArray(dataError.message) ? dataError.message.join(', ') : dataError.message);
      }
    },
  });

  // Mutación: Actualizar / Cambiar Status de una tarea
  const updateMutation = useMutation({
    mutationFn: tasksService.updateTask,
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // Sincronizar el modal de detalle con el nuevo dato refrescado al vuelo
      if (selectedTask && selectedTask.id === updatedTask.id) {
        setSelectedTask(updatedTask);
      }
    },
  });

  // Mutación: Eliminar tarea
  const deleteMutation = useMutation({
    mutationFn: tasksService.deleteTask,
    onSuccess: () => {
      setSelectedTask(null); // Cerrar el modal ya que la tarea fue pulverizada
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handlePageChange = (newPage: number) => {
    if (data && newPage >= 1 && newPage <= data.meta.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg">✓</div>
            <span className="font-bold text-slate-800 tracking-tight text-lg">Task Manager</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            <button
              onClick={logoutUser}
              className="text-sm text-red-600 hover:text-red-700 font-medium border border-red-100 hover:border-red-200 bg-red-50/50 py-1.5 px-3 rounded-lg transition-all cursor-pointer"
            >
            Salir
          </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <TaskFiltersBar 
            filters={filters} 
            onFilterChange={(status) => setFilters({ status, page: 1, limit: 6 })} 
            onCreateClick={() => setIsCreateOpen(true)} // <--- ENVIAMOS LA ACCIÓN AQUÍ
          />
        </div>

        {isLoading && <div className="text-center py-20 text-slate-500 text-sm">Cargando...</div>}
        {isError && <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-center text-sm">Error de sincronización.</div>}

        {!isLoading && !isError && (
          <>
            {data?.data.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 p-8 text-slate-400 font-medium">
                No hay tareas disponibles.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data.map((task) => (
                  /* Envolvemos la tarjeta con un handler de click para capturar la tarea seleccionada */
                  <div key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer transition-transform hover:scale-[1.01]">
                    <TaskCard task={task} />
                  </div>
                ))}
              </div>
            )}

            {data && data.meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-slate-200/60 pt-4">
                <span className="text-xs text-slate-500 font-medium">Página {data.meta.currentPage} de {data.meta.totalPages}</span>
                <div className="flex gap-2">
                  <button onClick={() => handlePageChange(filters.page - 1)} disabled={filters.page === 1} className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-50 cursor-pointer">Anterior</button>
                  <button onClick={() => handlePageChange(filters.page + 1)} disabled={filters.page === data.meta.totalPages} className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-50 cursor-pointer">Siguiente</button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal 1: Creación */}
      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => { setIsCreateOpen(false); setCreateError(null); }}
        onSubmit={(taskData) => createMutation.mutate(taskData)}
        isPending={createMutation.isPending}
        apiError={createError}
      />

      {/* Modal 2: Detalle (Vista / Edición / Mutaciones Integradas) */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={(taskData) => updateMutation.mutate(taskData)}
        onDelete={(id) => deleteMutation.mutate(id)}
        isPending={updateMutation.isPending || deleteMutation.isPending}
      />
    </div>
  );
};