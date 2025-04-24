
import { useAuth } from '@/contexts/AuthContext';

export const useApi = () => {
  const { token, logout } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL || '';

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    // Check if the API URL is defined
    if (!apiUrl) {
      console.warn('API URL is not defined in environment variables');
    }
    
    const url = `${apiUrl}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle unauthorized errors by logging out
      if (response.status === 401) {
        logout();
        throw new Error('Session expired. Please login again.');
      }

      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API request failed');
      }

      // Parse and return JSON response
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  return {
    get: (endpoint: string) => fetchWithAuth(endpoint, { method: 'GET' }),
    post: (endpoint: string, data: any) => fetchWithAuth(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    put: (endpoint: string, data: any) => fetchWithAuth(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (endpoint: string) => fetchWithAuth(endpoint, { method: 'DELETE' }),
  };
};
