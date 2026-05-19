import { api } from '../../../config/api';
import type { LoginResponse, RegisterResponse } from '../types/auth.types';

export const authService = {
  // Envía las credenciales para iniciar sesión [cite: 66, 70]
  login: async (data: Record<string, string>): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  // Registra un nuevo usuario en la base de datos [cite: 52, 55]
  register: async (data: Record<string, string>): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },
};