import { apiRequest } from '../lib/api';
import type { DashboardResponse } from '../types/api';

export async function getDashboard(): Promise<DashboardResponse> {
  return apiRequest<DashboardResponse>('/dashboard');
}
