import apiClient from '../api/client';

export const leavesService = {
  getAll: () => apiClient.get('/leaves'),
  getById: (id) => apiClient.get(`/leaves/${id}`),
  create: (data) => apiClient.post('/leaves', data),
  update: (id, data) => apiClient.put(`/leaves/${id}`, data),
  delete: (id) => apiClient.delete(`/leaves/${id}`),
  
  // Leave actions
  approve: (id) => apiClient.post(`/leaves/${id}/approve`),
  reject: (id, reason) => apiClient.post(`/leaves/${id}/reject`, { reason }),
  cancel: (id) => apiClient.post(`/leaves/${id}/cancel`),
  
  // Filters
  getByEmployee: (employeeId) => apiClient.get(`/leaves?employee_id=${employeeId}`),
  getByStatus: (status) => apiClient.get(`/leaves?status=${status}`),
  getByType: (type) => apiClient.get(`/leaves?type=${type}`),
  getPending: () => apiClient.get('/leaves?status=pending'),
};