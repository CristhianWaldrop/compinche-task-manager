import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { ApiError } from '../types/auth.types';
import axios from 'axios';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  // Estado local fuertemente tipado para el formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Mutación asíncrona mediante TanStack Query
  const { mutate, isPending } = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setErrorMessage(null);
      // El backend devuelve: { "message": "Usuario registrado con éxito", "userId": "..." }
      setSuccessMessage(`${data.message}. Redirigiendo al inicio de sesión...`);
      setFormData({ name: '', email: '', password: '' });
      
      // Simulamos una pequeña pausa para que el usuario lea el éxito antes de cambiar de pantalla
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    },
    onError: (error: unknown) => {
      setSuccessMessage(null);
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data as ApiError;
        // El backend puede responder con un array de strings (class-validator) o un solo string
        if (Array.isArray(apiError.message)) {
          setErrorMessage(apiError.message.join(', '));
        } else {
          setErrorMessage(apiError.message || 'Error al registrar el usuario.');
        }
      } else {
        setErrorMessage('No se pudo conectar con el servidor.');
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validación rápida en el cliente antes de disparar al servidor
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage('La contraseña debe tener un mínimo de 6 caracteres.'); // Regla explícita del backend
      return;
    }

    mutate(formData);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Crea tu cuenta</h2>
        <p className="text-slate-500 mt-2 text-sm">Comienza a organizar tus tareas eficientemente</p>
      </div>

      {/* Manejo de Alertas de Error */}
      {errorMessage && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl" role="alert">
          <span className="font-semibold">Error:</span> {errorMessage}
        </div>
      )}

      {/* Manejo de Alertas de Éxito */}
      {successMessage && (
        <div className="p-3 mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl" role="alert">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre Completo</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isPending}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all disabled:opacity-60"
            placeholder="Ej. Cristhian Molina"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isPending}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all disabled:opacity-60"
            placeholder="cristhian@compinche.io"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isPending}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all disabled:opacity-60"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors duration-200 shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Registrando...
            </>
          ) : (
            'Registrarse'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        ¿Ya tienes una cuenta?{' '}
        <button
          onClick={onSwitchToLogin}
          disabled={isPending}
          className="text-brand-600 font-semibold hover:underline focus:outline-none disabled:opacity-60"
        >
          Inicia sesión aquí
        </button>
      </div>
    </div>
  );
};