import { ApiResponse, ApiErrorResponse } from '../types';

const API_BASE = 'https://ai-personal-os-dv7c.onrender.com';

function getAuthToken() {
  return localStorage.getItem('token');
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const isAuthEndpoint = endpoint.startsWith('/auth/');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && !isAuthEndpoint ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
      throw new Error(`Auth Error (${response.status}): Your session has expired or is invalid. Please try logging in again.`);
    }
    
    console.error("API Error Response:", errorData, "HTTP Status:", response.status);
    throw new Error(errorData.message || `Server Error (${response.status}): Could not complete the request.`);
  }

  const successData = data as ApiResponse<T>;
  return successData.data;
}
