import { api } from '../../../config/api';
import type { PaginatedTasksResponse, Task, TaskFilters } from '../types/tasks.types';

export const tasksService = {
  // Obtener tareas con filtros de estado y paginación
  getTasks: async (filters: TaskFilters): Promise<PaginatedTasksResponse> => {
    const params: Record<string, string | number> = {
      page: filters.page,
      limit: filters.limit,
    };

    // Si el filtro es diferente de 'all', lo agregamos a los query params
    if (filters.status !== 'all') {
      params.status = filters.status;
    }

    const response = await api.get<PaginatedTasksResponse>('/tasks', { params });
    return response.data;
  },

  createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>): Promise<Task> => {
    const response = await api.post<Task>('/tasks', taskData);
    return response.data;
  },
};