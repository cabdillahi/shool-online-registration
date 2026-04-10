import api from './api';
import { Application, ApplicationFormData, ApplicationStats } from '@/types';

export const applicationService = {
  async submitApplication(data: ApplicationFormData): Promise<{ message: string; application: Application }> {
    const response = await api.post<{ message: string; application: Application }>('/applications', data);
    return response.data;
  },

  async getMyApplication(): Promise<{ application: Application }> {
    const response = await api.get<{ application: Application }>('/applications/my-application');
    return response.data;
  },

  async getAllApplications(status?: string): Promise<{ applications: Application[] }> {
    const params = status && status !== 'ALL' ? { status } : {};
    const response = await api.get<{ applications: Application[] }>('/applications', { params });
    return response.data;
  },

  async updateApplicationStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<{ message: string; application: Application }> {
    const response = await api.patch<{ message: string; application: Application }>(`/applications/${id}/status`, { status });
    return response.data;
  },

  async getApplicationStats(): Promise<{ stats: ApplicationStats }> {
    const response = await api.get<{ stats: ApplicationStats }>('/applications/stats');
    return response.data;
  }
};