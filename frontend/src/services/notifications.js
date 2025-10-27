import apiClient from '../api/client';

export const notificationsService = {
  // Récupérer toutes les notifications de l'utilisateur
  getAll: async () => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },

  // Récupérer les notifications non lues
  getUnread: async () => {
    const response = await apiClient.get('/notifications/unread');
    return response.data;
  },

  // Marquer une notification comme lue
  markAsRead: async (id) => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Marquer toutes les notifications comme lues
  markAllAsRead: async () => {
    const response = await apiClient.put('/notifications/mark-all-read');
    return response.data;
  },

  // Supprimer une notification
  delete: async (id) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },

  // Créer une nouvelle notification
  create: async (data) => {
    const response = await apiClient.post('/notifications', data);
    return response.data;
  },

  // Envoyer une notification push
  sendPush: async (data) => {
    const response = await apiClient.post('/notifications/push', data);
    return response.data;
  },

  // Envoyer une notification email
  sendEmail: async (data) => {
    const response = await apiClient.post('/notifications/email', data);
    return response.data;
  },

  // Gérer les préférences de notifications
  preferences: {
    get: async () => {
      const response = await apiClient.get('/notifications/preferences');
      return response.data;
    },

    update: async (preferences) => {
      const response = await apiClient.put('/notifications/preferences', preferences);
      return response.data;
    }
  },

  // Notifications en temps réel (WebSocket)
  realtime: {
    connect: (userId, onMessage) => {
      const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/notifications/${userId}`);
      
      ws.onmessage = (event) => {
        const notification = JSON.parse(event.data);
        onMessage(notification);
      };

      ws.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
      };

      return ws;
    }
  }
};