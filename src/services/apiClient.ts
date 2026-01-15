/**
 * Cliente HTTP para comunicación con la API Backend
 * Usa axios con configuración centralizada
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

// Base URL desde variable de entorno (por defecto localhost para dev)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Instancia configurada de Axios
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para requests - agregar token si existe
 */
apiClient.interceptors.request.use(
  (config) => {
    // Si hay un token en localStorage, agregarlo
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor para responses - manejo de errores
 */
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url} - Status ${response.status}`);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Error del servidor (4xx, 5xx)
      console.error(`❌ API Error ${error.response.status}:`, error.response.data);
      
      // Si es 401, limpiar sesión
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token');
        // Opcional: redirigir a login
      }
    } else if (error.request) {
      // No hubo respuesta
      console.error('❌ No response from server:', error.message);
    } else {
      // Error en la configuración
      console.error('❌ Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Helper para extraer mensaje de error
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.detail) {
      return typeof error.response.data.detail === 'string'
        ? error.response.data.detail
        : JSON.stringify(error.response.data.detail);
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  return 'Error desconocido';
}

/**
 * Health Check
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch {
    return false;
  }
}

export default apiClient;
