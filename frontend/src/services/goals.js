import apiClient from '../api/client';

export const goalsService = {
  // Obtenir tous les objectifs
  getAll: async () => {
    const response = await apiClient.get('/goals');
    return response.data;
  },

  // Créer un nouvel objectif
  create: async (goalData) => {
    const response = await apiClient.post('/goals', goalData);
    return response.data;
  },

  // Mettre à jour un objectif
  update: async (id, goalData) => {
    const response = await apiClient.put(`/goals/${id}`, goalData);
    return response.data;
  },

  // Supprimer un objectif
  delete: async (id) => {
    const response = await apiClient.delete(`/goals/${id}`);
    return response.data;
  },

  // Obtenir les objectifs par employé
  getByEmployee: async (employeeId) => {
    const response = await apiClient.get(`/goals/employee/${employeeId}`);
    return response.data;
  },

  // Mettre à jour la progression
  updateProgress: async (id, progress) => {
    const response = await apiClient.patch(`/goals/${id}/progress`, { progress });
    return response.data;
  }
};