import apiClient from '../api/client';

export const assetsService = {
  // Obtenir tous les équipements
  getAll: async () => {
    const response = await apiClient.get('/assets');
    return response.data;
  },

  // Créer un nouvel équipement
  create: async (assetData) => {
    const response = await apiClient.post('/assets', assetData);
    return response.data;
  },

  // Mettre à jour un équipement
  update: async (id, assetData) => {
    const response = await apiClient.put(`/assets/${id}`, assetData);
    return response.data;
  },

  // Supprimer un équipement
  delete: async (id) => {
    const response = await apiClient.delete(`/assets/${id}`);
    return response.data;
  },

  // Assigner un équipement
  assign: async (id, employeeId) => {
    const response = await apiClient.patch(`/assets/${id}/assign`, { assigned_to_id: employeeId });
    return response.data;
  },

  // Désassigner un équipement
  unassign: async (id) => {
    const response = await apiClient.patch(`/assets/${id}/unassign`);
    return response.data;
  },

  // Obtenir les équipements par employé
  getByEmployee: async (employeeId) => {
    const response = await apiClient.get(`/assets/employee/${employeeId}`);
    return response.data;
  }
};