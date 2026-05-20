import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tasksService } from './tasks.service';
import { api } from '../../../config/api';
import type { Task, TaskFilters } from '../types/tasks.types';

// Mockear el módulo de la API de axios de forma automática
vi.mock('../../../config/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('tasksService', () => {
  
  // Limpiar todos los mocks antes de cada test para evitar colisiones de datos
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTasks', () => {
    it('debe obtener las tareas mandando los filtros de paginación por defecto', async () => {
      const mockFilters: TaskFilters = { page: 1, limit: 10, status: 'all' };
      const mockResponse = {
        data: {
          data: [],
          meta: { total: 0, page: 1, limit: 10, totalPages: 0 }
        }
      };

      // Simulamos que api.get resuelve con éxito nuestra estructura paginada
      vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

      const result = await tasksService.getTasks(mockFilters);

      // Verificamos que se llame al endpoint correcto con las páginas en los query params
      expect(api.get).toHaveBeenCalledWith('/tasks', {
        params: { page: 1, limit: 10 },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('debe incluir el query param status si el filtro es diferente de "all"', async () => {
      const mockFilters: TaskFilters = { page: 2, limit: 5, status: 'pending' };
      const mockResponse = { data: { data: [], meta: {} } };

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

      await tasksService.getTasks(mockFilters);

      // Verificamos que al ser 'pending', viaje el filtro en los params de la URL
      expect(api.get).toHaveBeenCalledWith('/tasks', {
        params: { page: 2, limit: 5, status: 'pending' },
      });
    });
  });

  describe('createTask', () => {
    it('debe enviar un POST al endpoint con los datos de la nueva tarea y retornar la tarea creada', async () => {
      const inputData = {
        title: 'Completar la prueba de Compinche',
        description: 'Escribir toda la documentación restante',
        dueDate: '2026-05-20T00:00:00.000Z',
        status: 'pending' as const,
      };

      const mockCreatedTask: Task = {
        id: 'new-id-123',
        createdAt: '2026-05-19T23:00:00.000Z',
        userId: 'user-777',
        ...inputData,
      };

      vi.mocked(api.post).mockResolvedValueOnce({ data: mockCreatedTask });

      const result = await tasksService.createTask(inputData);

      expect(api.post).toHaveBeenCalledWith('/tasks', inputData);
      expect(result).toEqual(mockCreatedTask);
    });
  });

  describe('updateTask', () => {
    it('debe enviar una petición PATCH al endpoint correcto usando el ID de la tarea', async () => {
      const updateData = {
        id: 'task-to-edit',
        title: 'Título Modificado Senior',
        status: 'done' as const,
      };

      const mockUpdatedTask: Task = {
        id: 'task-to-edit',
        title: 'Título Modificado Senior',
        description: 'Mantiene descripción anterior',
        dueDate: '2026-05-20T00:00:00.000Z',
        createdAt: '2026-05-20T00:00:00.000Z',
        status: 'done',
        userId: 'user-777',
      };

      vi.mocked(api.patch).mockResolvedValueOnce({ data: mockUpdatedTask });

      // Omitimos el id en el cuerpo porque viaja en la URL según tu implementación
      const { id, ...bodyWithoutId } = updateData;

      const result = await tasksService.updateTask(updateData);

      expect(api.patch).toHaveBeenCalledWith(`/tasks/${id}`, bodyWithoutId);
      expect(result).toEqual(mockUpdatedTask);
    });
  });

  describe('deleteTask', () => {
    it('debe enviar una petición DELETE a la URL con el ID de la tarea', async () => {
      const taskId = 'id-a-eliminar';
      const mockBackendMessage = { message: 'Task deleted successfully' };

      vi.mocked(api.delete).mockResolvedValueOnce({ data: mockBackendMessage });

      const result = await tasksService.deleteTask(taskId);

      expect(api.delete).toHaveBeenCalledWith(`/tasks/${taskId}`);
      expect(result).toEqual(mockBackendMessage);
    });
  });
});