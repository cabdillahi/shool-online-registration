import api from './api';
import { Application, ApplicationFormData, ApplicationStats } from '@/types';

export const applicationService = {
  async submitApplication(data: ApplicationFormData): Promise<{ message: string; application: Application }> {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('parentName', data.parentName);
    formData.append('phoneNumber1', data.phoneNumber1);
    if (data.phoneNumber2) {
      formData.append('phoneNumber2', data.phoneNumber2);
    }
    if (data.photo) {
      formData.append('photo', data.photo, data.photo.name);
    }
    if (data.document) {
      formData.append('document', data.document, data.document.name);
    }

    const response = await api.post<{ message: string; application: Application }>(
      '/applications',
      formData,
      {
        timeout: 60000,
      }
    );
    return response.data;
  },

  async getMyApplication(): Promise<{ application: Application }> {
    const response = await api.get<{ application: Application }>('/applications/my-application');
    return response.data;
  },

  async uploadApplicationFiles(files: {
    photo?: File | null;
    document?: File | null;
  }): Promise<{ message: string; application: Application }> {
    const formData = new FormData();
    if (files.photo) {
      formData.append('photo', files.photo, files.photo.name);
    }
    if (files.document) {
      formData.append('document', files.document, files.document.name);
    }

    const response = await api.post<{ message: string; application: Application }>(
      '/applications/my-application/files',
      formData,
      { timeout: 60000 }
    );
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
