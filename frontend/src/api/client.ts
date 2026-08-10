import { ApiResponse, ApiErrorResponse } from '../types';

const API_BASE = 'https://ai-personal-os-dv7c.onrender.com/api';

function getAuthToken() {
  return localStorage.getItem('token');
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
      throw new Error('Session expired. Please log in again.');
    }
    const errorData = data as ApiErrorResponse;
    console.error("API Error Response:", errorData, "HTTP Status:", response.status);
    throw new Error(errorData.message || 'An unexpected error occurred. Please make sure the backend is running and connected to the database.');
  }

  const successData = data as ApiResponse<T>;
  return successData.data;
}
