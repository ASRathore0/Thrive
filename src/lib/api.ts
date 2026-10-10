export type ApiErrorShape = {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL = (configuredApiBaseUrl || `${window.location.protocol}//${window.location.hostname}:8000/api`).replace(/\/$/, '');

export function getAuthToken(): string | null {
  return localStorage.getItem('travelomate_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('travelomate_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('travelomate_token');
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json().catch(() => ({})) : await response.text().catch(() => '');

  if (!response.ok) {
    const errorMessage = typeof payload === 'string'
      ? payload
      : (payload as ApiErrorShape)?.message || (payload as ApiErrorShape)?.error || 'Request failed';
    throw new Error(errorMessage);
  }

  return (payload ?? {}) as T;
}

export function isMockAuthEnabled(): boolean {
  return import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true';
}
