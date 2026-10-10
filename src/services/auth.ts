import { apiRequest } from '../lib/api';
import type { LoginRequest, LoginResponse, User } from '../types/api';

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function logout(): Promise<void> {
  await apiRequest('/logout', { method: 'POST' });
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiRequest<{ user: User }>('/me');
  return response.user;
}
