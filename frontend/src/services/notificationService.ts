import api from './api';

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: 0 | 1 | boolean;
  created_at: string;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  unread: number;
}

export const notificationService = {
  async list(params?: { onlyUnread?: boolean; limit?: number }): Promise<NotificationsResponse> {
    const response = await api.get<NotificationsResponse>('/notifications', {
      params: {
        only_unread: params?.onlyUnread ? 'true' : undefined,
        limit: params?.limit,
      },
    });
    return response.data;
  },

  async markAsRead(id: number): Promise<{ message: string; unread: number }> {
    const response = await api.put<{ message: string; unread: number }>(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead(): Promise<{ message: string; unread: number }> {
    const response = await api.put<{ message: string; unread: number }>(`/notifications/read-all`);
    return response.data;
  },
};

export default notificationService;
