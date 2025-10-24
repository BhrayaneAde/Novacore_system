import apiClient from '../api/client';

export const performanceService = {
  // Evaluations
  evaluations: {
    getAll: () => apiClient.get('/performance/evaluations'),
    getById: (id) => apiClient.get(`/performance/evaluations/${id}`),
    create: (data) => apiClient.post('/performance/evaluations', data),
    update: (id, data) => apiClient.put(`/performance/evaluations/${id}`, data),
    delete: (id) => apiClient.delete(`/performance/evaluations/${id}`),
    getByEmployee: (employeeId) => apiClient.get(`/performance/evaluations?employee_id=${employeeId}`),
  },
  
  // Goals
  goals: {
    getAll: () => apiClient.get('/goals'),
    getById: (id) => apiClient.get(`/goals/${id}`),
    create: (data) => apiClient.post('/goals', data),
    update: (id, data) => apiClient.put(`/goals/${id}`, data),
    delete: (id) => apiClient.delete(`/goals/${id}`),
    complete: (id) => apiClient.post(`/goals/${id}/complete`),
  }
};