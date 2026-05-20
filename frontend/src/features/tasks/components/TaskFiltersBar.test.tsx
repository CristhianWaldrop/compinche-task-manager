import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { TaskFiltersBar } from './TaskFiltersBar';
import type { TaskFilters } from '../types/tasks.types';

describe('TaskFiltersBar Component', () => {
  const mockFilters : TaskFilters = { status: 'pending', page: 1, limit: 1 };
  const mockOnFilterChange = vi.fn();
  const mockOnCreateClick = vi.fn();

  it('debe renderizar todos los botones de filtro y el botón de creación', () => {
    render(
      <TaskFiltersBar
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onCreateClick={mockOnCreateClick}
      />
    );

    expect(screen.getByText('Todas')).toBeInTheDocument();
    expect(screen.getByText('Pendientes')).toBeInTheDocument();
    expect(screen.getByText('Completadas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Nueva Tarea/i })).toBeInTheDocument();
  });

  it('debe aplicar las clases activas de Tailwind al filtro seleccionado actualmente', () => {
    render(
      <TaskFiltersBar
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onCreateClick={mockOnCreateClick}
      />
    );

    const pendingButton = screen.getByText('Pendientes');
    expect(pendingButton).toHaveClass('bg-white');
    expect(pendingButton).toHaveClass('text-brand-600');
  });

  it('debe disparar la función onFilterChange con el argumento correcto al hacer clic en un filtro', () => {
    render(
      <TaskFiltersBar
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onCreateClick={mockOnCreateClick}
      />
    );

    const doneButton = screen.getByText('Completadas');
    fireEvent.click(doneButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('done');
  });

  it('debe llamar a onCreateClick al pulsar el botón "Nueva Tarea"', () => {
    render(
      <TaskFiltersBar
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onCreateClick={mockOnCreateClick}
      />
    );

    const createButton = screen.getByRole('button', { name: /Nueva Tarea/i });
    fireEvent.click(createButton);

    expect(mockOnCreateClick).toHaveBeenCalledTimes(1);
  });
});