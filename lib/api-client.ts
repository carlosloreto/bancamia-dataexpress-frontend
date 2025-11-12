// Cliente de API con axios para comunicación con el backend
// Incluye interceptores para agregar tokens automáticamente usando Firebase idToken

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { auth } from './firebase';

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
// Validar que NEXT_PUBLIC_API_URL esté configurada
const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;

if (!apiBaseURL) {
  console.error('❌ ERROR: NEXT_PUBLIC_API_URL no está configurada en las variables de entorno');
  console.error('Por favor, configura NEXT_PUBLIC_API_URL en tu archivo .env');
  
  // Solo permitir localhost en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Usando localhost:3001 como fallback para desarrollo');
  } else {
    throw new Error('NEXT_PUBLIC_API_URL es requerida en producción. Configura esta variable en .env');
  }
}

const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseURL || 'http://localhost:3001',
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones: agregar idToken de Firebase automáticamente
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Obtener idToken de Firebase
    if (typeof window !== 'undefined') {
      const user = auth.currentUser;
      
      if (user && config.headers) {
        try {
          // Obtener token (Firebase lo renueva automáticamente si es necesario)
          const idToken = await user.getIdToken();
          
          if (idToken) {
            config.headers.Authorization = `Bearer ${idToken}`;
          }
        } catch (error) {
          console.error('❌ Error al obtener idToken:', error);
          // Continuar sin token si hay error
        }
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
  async (error: AxiosError<ApiErrorResponse>) => {
    // Manejar errores HTTP
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      // 400 - Error de validación: mostrar mensajes al usuario
      if (status === 400) {
        console.error('❌ Error 400: Error de validación');
        
        // Los errores de validación se manejan en el componente que hace la petición
        // Aquí solo logueamos para debugging
        if (errorData?.error?.details) {
          console.error('Detalles del error:', errorData.error.details);
        }
      }
      
      // 401 - No autorizado: token inválido o expirado
      if (status === 401) {
        console.error('❌ Error 401: Token inválido o expirado');
        
        // Intentar renovar el token una vez
        if (typeof window !== 'undefined') {
          const user = auth.currentUser;
          
          if (user) {
            try {
              // Forzar renovación del token
              const newToken = await user.getIdToken(true);
              
              if (newToken && error.config) {
                // Reintentar la petición con el nuevo token
                if (error.config.headers) {
                  error.config.headers.Authorization = `Bearer ${newToken}`;
                }
                return apiClient.request(error.config);
              }
            } catch (refreshError) {
              console.error('❌ Error al renovar token:', refreshError);
            }
          }
          
          // Si no se pudo renovar, limpiar y redirigir a login
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

