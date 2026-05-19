export interface User {
  id: string;
  name: string;
  email: string;
}

// Estructura idéntica a la respuesta de POST /api/auth/login [cite: 75]
export interface LoginResponse {
  access_token: string;
  user: User;
}

// Estructura idéntica a la respuesta de POST /api/auth/register [cite: 62]
export interface RegisterResponse {
  message: string;
  userId: string;
}

// Contrato de errores de Axios mapeado con las respuestas homogéneas del backend [cite: 178]
export interface ApiError {
  statusCode: number;
  message: string | string[]; // El backend puede mandar un string o un array de errores de class-validator [cite: 179]
  error: string;
}