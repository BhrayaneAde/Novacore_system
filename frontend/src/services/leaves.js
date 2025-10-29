import apiClient from '../api/client';

export const leavesService = {
  // Obtenir toutes les demandes de congés
  getAll: async () => {
    const response = await apiClient.get('/leaves');
    return response.data;
  },

  // Créer une nouvelle demande
  create: async (leaveData) => {
    const response = await apiClient.post('/leaves', leaveData);
    return response.data;
  },

  // Mettre à jour une demande
  update: async (id, leaveData) => {
    const response = await apiClient.put(`/leaves/${id}`, leaveData);
    return response.data;
  },

  // Supprimer une demande
  delete: async (id) => {
    const response = await apiClient.delete(`/leaves/${id}`);
    return response.data;
  },

  // Approuver/rejeter une demande
  updateStatus: async (id, status, reason = '') => {
    const response = await apiClient.patch(`/leaves/${id}/status`, { status, reason });
    return response.data;
  },

  // Obtenir les demandes par employé
  getByEmployee: async (employeeId) => {
    const response = await apiClient.get(`/leaves/employee/${employeeId}`);
    return response.data;
  }
};