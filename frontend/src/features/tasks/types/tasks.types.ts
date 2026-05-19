export type TaskStatus = 'pending' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string; // ISO String
  createdAt: string; // ISO String
  userId: string;
}

// Contrato exacto para la respuesta paginada del Backend
export interface PaginatedTasksResponse {
  data: Task[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Filtros aplicables en el Frontend
export interface TaskFilters {
  status: 'all' | TaskStatus;
  page: number;
  limit: number;
}