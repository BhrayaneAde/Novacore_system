import apiClient from '../api/client';

export const recruitmentService = {
  // Job Openings
  jobOpenings: {
    getAll: async () => {
      const response = await apiClient.get('/recruitment/job-openings');
      return response.data;
    },

    create: async (jobData) => {
      const response = await apiClient.post('/recruitment/job-openings', jobData);
      return response.data;
    },

    update: async (id, jobData) => {
      const response = await apiClient.put(`/recruitment/job-openings/${id}`, jobData);
      return response.data;
    },

    delete: async (id) => {
      const response = await apiClient.delete(`/recruitment/job-openings/${id}`);
      return response.data;
    },

    getById: async (id) => {
      const response = await apiClient.get(`/recruitment/job-openings/${id}`);
      return response.data;
    }
  },

  // Candidates
  candidates: {
    getAll: async () => {
      const response = await apiClient.get('/recruitment/candidates');
      return response.data;
    },

    create: async (candidateData) => {
      const response = await apiClient.post('/recruitment/candidates', candidateData);
      return response.data;
    },

    update: async (id, candidateData) => {
      const response = await apiClient.put(`/recruitment/candidates/${id}`, candidateData);
      return response.data;
    },

    delete: async (id) => {
      const response = await apiClient.delete(`/recruitment/candidates/${id}`);
      return response.data;
    },

    updateStatus: async (id, status) => {
      const response = await apiClient.patch(`/recruitment/candidates/${id}/status`, { status });
      return response.data;
    },

    getByJobOpening: async (jobOpeningId) => {
      const response = await apiClient.get(`/recruitment/candidates/job/${jobOpeningId}`);
      return response.data;
    }
  }
};