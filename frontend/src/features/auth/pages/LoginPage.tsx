import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuth } from '../../../context/AuthContext';
import type { ApiError } from '../types/auth.types';
import axios from 'axios';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mutación asíncrona para Login
  const { mutate, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setErrorMessage(null);
      // Inyectamos el JWT y los datos del usuario en el contexto de autenticación global
      loginUser(data.access_token, data.user);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data as ApiError;
        // El backend responde habitualmente 401: { "message": "Credenciales incorrectas" }
        if (Array.isArray(apiError.message)) {
          setErrorMessage(apiError.message.join(', '));
        } else {
          setErrorMessage(apiError.message || 'Credenciales incorrectas.');
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

    if (!formData.email || !formData.password) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }

    mutate(formData);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Bienvenido de nuevo</h2>
        <p className="text-slate-500 mt-2 text-sm">Ingresa tus credenciales para acceder a tus tareas</p>
      </div>

      {/* Control de Errores de Login (ej. Código 401) */}
      {errorMessage && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl" role="alert">
          <span className="font-semibold">Error:</span> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
              Autenticando...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        ¿No tienes una cuenta todavía? Gentileza de la casa.{' '}
        <button
          onClick={onSwitchToRegister}
          disabled={isPending}
          className="text-brand-600 font-semibold hover:underline focus:outline-none disabled:opacity-60"
        >
          Regístrate aquí
        </button>
      </div>
    </div>
  );
};