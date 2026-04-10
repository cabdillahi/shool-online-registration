import api from './api';
import { Notification } from '@/types';

export const notificationService = {
  async getMyNotifications(): Promise<{ notifications: Notification[] }> {
    const response = await api.get<{ notifications: Notification[] }>('/notifications');
    return response.data;
  },

  async markAsRead(id: string): Promise<{ notification: Notification }> {
    const response = await api.patch<{ notification: Notification }>(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead(): Promise<{ message: string }> {
    const response = await api.patch<{ message: string }>('/notifications/read-all');
    return response.data;
  }
};