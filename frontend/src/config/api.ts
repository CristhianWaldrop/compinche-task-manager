import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Ruta base uniforme de la API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar automáticamente el token JWT si existe en el almacenamiento local
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});