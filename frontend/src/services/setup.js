import apiClient from '../api/client';

export const setupService = {
  appearance: {
    get: async () => {
      const response = await apiClient.get('/setup/appearance');
      return response.data;
    },
    
    update: async (data) => {
      const response = await apiClient.put('/setup/appearance', data);
      return response.data;
    }
  }
};