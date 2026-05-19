import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';

// Inicializamos el cliente de TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const MainAppContent: React.FC = () => {
  const { isAuthenticated, user, logoutUser, isLoading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-white text-center">
          <svg className="animate-spin h-8 w-8 text-brand-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm font-medium text-slate-400">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si el usuario está autenticado, mostramos un cascarón temporal del Dashboard
  if (isAuthenticated && user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md text-center border border-slate-100">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">¡Sesión Iniciada con Éxito! 🔓</h1>
          <p className="text-slate-600 mb-1 font-medium">Usuario: {user.name}</p>
          <p className="text-slate-400 text-sm mb-6">Email: {user.email}</p>
          <button
            onClick={logoutUser}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200"
          >
            Cerrar Sesión (Logout)
          </button>
        </div>
      </div>
    );
  }

  // Vista de Autenticación si no está logueado
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
      {authView === 'login' ? (
        <LoginPage onSwitchToRegister={() => setAuthView('register')} />
      ) : (
        <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;