import { createContext } from 'react';
import type { User } from '../features/auth/types/auth.types';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginUser: (token: string, user: User) => void;
  logoutUser: () => void;
}

// Exportamos únicamente el contexto y su interfaz
export const AuthContext = createContext<AuthContextType | undefined>(undefined);