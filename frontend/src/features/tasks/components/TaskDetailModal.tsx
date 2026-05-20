/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import type { Task } from '../types/tasks.types';
import { ConfirmationModal } from '../../../shared/components/ConfirmationModal';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: Partial<Task> & { id: string }) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  isPending,
}) => {
  if (!isOpen || !task) return null;

  // Estado para alternar entre Modo Vista ('view') y Modo Edición ('edit')
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  // Estados locales para los campos de edición
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState('');

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Sincronizar los estados cuando el modal se abre con una tarea específica
  useEffect(() => {
    if (task) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(task.title);
      setDescription(task.description);
      // Recortar el formato ISO (YYYY-MM-DDThh:mm...) a YYYY-MM-DD para el input de tipo date
      setDueDate(task.dueDate.split('T')[0]);
      setMode('view'); // Siempre abrir en modo vista
    }
  }, [task, isOpen]);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onUpdate({
      id: task.id,
      title: title.trim(),
      description: description.trim(),
      dueDate: new Date(dueDate).toISOString(),
    });
    setMode('view');
  };

  const toggleStatus = () => {
    onUpdate({
      id: task.id,
      status: task.status === 'done' ? 'pending' : 'done',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden transition-all">
        
        {/* Cabecera dinámica */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {mode === 'view' ? 'Detalle de Tarea' : 'Editando Tarea'}
          </span>
          <button onClick={onClose} disabled={isPending} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* MODO LECTURA / VISTA */}
        {mode === 'view' && (
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4">
                {/* 2. El Título: Añadimos 'line-clamp-2' para limitar líneas y 'break-words' para evitar desbordes */}
                <h2 
                  className="text-2xl font-bold text-slate-800 tracking-tight break-words line-clamp-2"
                  title={task.title} // Al pasar el mouse encima, el usuario puede ver el texto completo si está truncado
                >
                  {task.title}
                </h2>

                {/* 3. El Botón de Estado: La propiedad mágica es 'flex-shrink-0' e impedir saltos de línea con 'whitespace-nowrap' */}
                <button
                  onClick={toggleStatus}
                  disabled={isPending}
                  className={`flex-shrink-0 whitespace-nowrap px-3.5 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider cursor-pointer border transition-all ${
                    task.status === 'done'
                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  }`}
                  title="Click para cambiar estado"
                >
                  {task.status === 'done' ? '✓ Completada' : '⏱ Pendiente'}
                </button>
              </div>
              <p className="text-slate-600 mt-3 text-sm whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[80px]">
                {task.description || <span className="text-slate-400 italic">Sin descripción.</span>}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span>Vence el: <strong className="text-slate-700">{new Date(task.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
            </div>

            {/* Panel de control inferior */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setIsDeleteConfirmOpen(true)}
                disabled={isPending}
                className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9.149m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Eliminar
              </button>

              <button
                onClick={() => setMode('edit')}
                disabled={isPending}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
                Editar Tarea
              </button>
            </div>
          </div>
        )}

        {/* MODO FORMULARIO / EDICIÓN */}
        {mode === 'edit' && (
          <form onSubmit={handleSaveChanges} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Fecha de Vencimiento</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
                required
              />
            </div>

            <div className="pt-4 border-t border-slate-50 flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setMode('view')}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md cursor-pointer disabled:opacity-50"
              >
                {isPending ? 'Guardando...' : 'Confirmar Cambios'}
              </button>
            </div>
          </form>
        )}
      </div>

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => {
          onDelete(task.id);
          setIsDeleteConfirmOpen(false); // Cierra este sub-modal
        }}
        title="¿Eliminar tarea?"
        message={`Esta acción no se puede deshacer. La tarea "${task.title}" se borrará de forma permanente de tu cuenta.`}
        confirmText="Sí, eliminar"
        cancelText="No, cancelar"
        isPending={isPending}
      />
    </div>
  );
};