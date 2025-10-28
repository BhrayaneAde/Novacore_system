import apiClient from '../api/client';

export const evaluationsService = {
  // Récupérer toutes les évaluations
  getAll: async () => {
    try {
      const response = await apiClient.get('/performance/evaluations/test');
      return response.data.evaluations || [];
    } catch (error) {
      console.error('Failed to fetch evaluations:', error);
      return [];
    }
  },

  // Récupérer une évaluation par ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/performance/evaluations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch evaluation:', error);
      return null;
    }
  },

  // Créer une nouvelle évaluation
  create: async (data) => {
    try {
      const response = await apiClient.post('/performance/evaluations', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create evaluation:', error);
      throw error;
    }
  },

  // Mettre à jour une évaluation
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/performance/evaluations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update evaluation:', error);
      throw error;
    }
  },

  // Supprimer une évaluation
  delete: async (id) => {
    try {
      await apiClient.delete(`/performance/evaluations/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete evaluation:', error);
      throw error;
    }
  },

  // Récupérer les évaluations par employé
  getByEmployee: async (employeeId) => {
    try {
      const response = await apiClient.get(`/performance/evaluations?employee_id=${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employee evaluations:', error);
      return [];
    }
  }
};

export default evaluationsService;