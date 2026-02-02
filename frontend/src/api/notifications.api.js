import { api } from '@/api/axios';

export async function getNotifications({ limit = 20, includeRead = false } = {}) {
  const response = await api.get('/auth/notificaciones', {
    params: { limit, includeRead },
  });
  return response.data;
}

export async function getUnreadCount() {
  const response = await api.get('/auth/notificaciones/unread-count');
  return response.data;
}

export async function markAsRead(notificationId) {
  const response = await api.patch(`/auth/notificaciones/${notificationId}/read`);
  return response.data;
}

export async function markAllAsRead() {
  const response = await api.patch('/auth/notificaciones/mark-all-read');
  return response.data;
}

export async function deleteNotification(notificationId) {
  const response = await api.delete(`/auth/notificaciones/${notificationId}`);
  return response.data;
}
