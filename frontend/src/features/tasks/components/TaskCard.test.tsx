import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { TaskCard } from './TaskCard';
import type { Task } from '../types/tasks.types';

describe('TaskCard Component', () => {
  const mockPendingTask: Task = {
    id: 'task-1',
    title: 'Aprender Vitest para el frontend',
    description: 'Escribir las suites de pruebas unitarias',
    dueDate: '2026-05-19T00:00:00.000Z',
    createdAt: '2026-05-19T00:00:00.000Z',
    status: 'pending',
    userId: 'user-123'
  };

  const mockDoneTask: Task = {
    id: 'task-2',
    title: 'Tarea Completada',
    description: '',
    dueDate: '2026-06-01T00:00:00.000Z',
    createdAt: '2026-06-01T00:00:00.000Z',
    status: 'done',
    userId: 'user-123'
  };

  it('debe renderizar la información de una tarea pendiente correctamente', () => {
    render(<TaskCard task={mockPendingTask} />);

    expect(screen.getByText('Aprender Vitest para el frontend')).toBeInTheDocument();
    expect(screen.getByText('Escribir las suites de pruebas unitarias')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    
    // Verificamos que contenga el texto de la fecha formateada
    expect(screen.getByText(/Vence:/i)).toBeInTheDocument();
  });

  it('debe tachar el texto y cambiar el badge cuando la tarea esté en estado done', () => {
    render(<TaskCard task={mockDoneTask} />);

    const titleElement = screen.getByText('Tarea Completada');
    expect(titleElement).toHaveClass('line-through');
    expect(screen.getByText('Completada')).toBeInTheDocument();
  });

  it('debe mostrar "Sin descripción proporcionada." si la descripción está vacía', () => {
    render(<TaskCard task={mockDoneTask} />);
    expect(screen.getByText('Sin descripción proporcionada.')).toBeInTheDocument();
  });
});