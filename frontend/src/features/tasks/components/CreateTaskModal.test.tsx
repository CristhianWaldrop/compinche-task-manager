import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateTaskModal } from './CreateTaskModal';

describe('CreateTaskModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  it('no debe renderizar nada si isOpen es false', () => {
    const { container } = render(
      <CreateTaskModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isPending={false}
        apiError={null}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('debe mostrar el formulario completo cuando está abierto', () => {
    render(
      <CreateTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isPending={false}
        apiError={null}
      />
    );

    // Buscamos el encabezado principal
    expect(screen.getByText('Crear Nueva Tarea')).toBeInTheDocument();

    // En lugar de buscar la etiqueta vinculada, buscamos el input por su placeholder o tipo
    expect(screen.getByPlaceholderText('Ej. Aprender React Query')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Detalla los objetivos o notas de la tarea...')).toBeInTheDocument();
    
    // Para el campo tipo fecha que no suele llevar placeholder visible por defecto en HTML
    expect(screen.getByText(/Fecha de Vencimiento/i)).toBeInTheDocument();
  });

  it('debe mostrar un mensaje de error si el usuario intenta enviar el formulario vacío', () => {
    render(
      <CreateTaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isPending={false}
        apiError={null}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Guardar Tarea/i });
    fireEvent.click(submitButton);

    // Debe saltar la validación local que programaste en el cliente
    expect(screen.getByText('El título es requerido.')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});