// Cliente de API con axios para comunicación con el backend
// Incluye interceptores para agregar tokens automáticamente

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Tipos para las respuestas de la API
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    name: string;
    message: string;
    statusCode: number;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// Crear instancia de axios
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones: agregar token automáticamente
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obtener token del localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas: manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, retornarla
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // Manejar errores HTTP
    if (error.response) {
      const status = error.response.status;
      
      // 401 - No autorizado: token inválido o expirado
      if (status === 401) {
        console.error('❌ Error 401: Token inválido o expirado');
        
        // Limpiar token y redirigir a login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          
          // Solo redirigir si no estamos ya en login/register
          if (!window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/register')) {
            window.location.href = '/login';
          }
        }
      }
      
      // 403 - Prohibido
      if (status === 403) {
        console.error('❌ Error 403: No tienes permisos para esta acción');
      }
      
      // 500 - Error del servidor
      if (status >= 500) {
        console.error('❌ Error del servidor:', error.response.data);
      }
    } else if (error.request) {
      // Error de red
      console.error('❌ Error de red: No se pudo conectar con el servidor');
    } else {
      // Otro tipo de error
      console.error('❌ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

// Funciones helper para realizar peticiones
export const api = {
  get: <T = unknown>(url: string) => 
    apiClient.get<ApiResponse<T>>(url).then(res => res.data),
    
  post: <T = unknown>(url: string, data?: unknown) => 
    apiClient.post<ApiResponse<T>>(url, data).then(res => res.data),
    
  put: <T = unknown>(url: string, data?: unknown) => 
    apiClient.put<ApiResponse<T>>(url, data).then(res => res.data),
    
  delete: <T = unknown>(url: string) => 
    apiClient.delete<ApiResponse<T>>(url).then(res => res.data),
};

