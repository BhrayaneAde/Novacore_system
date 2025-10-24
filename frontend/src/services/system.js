import apiClient from '../api/client';

export const systemService = {
  // Notifications
  notifications: {
    getAll: () => apiClient.get('/notifications'),
    getById: (id) => apiClient.get(`/notifications/${id}`),
    create: (data) => apiClient.post('/notifications', data),
    markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
    markAllAsRead: () => apiClient.put('/notifications/read-all'),
    delete: (id) => apiClient.delete(`/notifications/${id}`),
  },
  
  // Settings
  settings: {
    getAll: () => apiClient.get('/settings'),
    getById: (id) => apiClient.get(`/settings/${id}`),
    update: (id, data) => apiClient.put(`/settings/${id}`, data),
    create: (data) => apiClient.post('/settings', data),
    delete: (id) => apiClient.delete(`/settings/${id}`),
  },
  
  // Assets
  assets: {
    getAll: () => apiClient.get('/assets'),
    getById: (id) => apiClient.get(`/assets/${id}`),
    create: (data) => apiClient.post('/assets', data),
    update: (id, data) => apiClient.put(`/assets/${id}`, data),
    delete: (id) => apiClient.delete(`/assets/${id}`),
  },
  
  // WebSocket connection
  websocket: {
    connect: () => {
      const token = localStorage.getItem('access_token');
      const wsUrl = `ws://localhost:8000/ws?token=${token}`;
      return new WebSocket(wsUrl);
    }
  }
};