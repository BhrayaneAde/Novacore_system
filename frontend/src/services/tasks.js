import apiClient from '../api/client';

export const tasksService = {
  getAll: () => apiClient.get('/tasks'),
  getById: (id) => apiClient.get(`/tasks/${id}`),
  create: (data) => apiClient.post('/tasks', data),
  update: (id, data) => apiClient.put(`/tasks/${id}`, data),
  delete: (id) => apiClient.delete(`/tasks/${id}`),
  
  // Task actions
  complete: (id) => apiClient.post(`/tasks/${id}/complete`),
  assign: (id, userId) => apiClient.post(`/tasks/${id}/assign`, { user_id: userId }),
  updateStatus: (id, status) => apiClient.put(`/tasks/${id}/status`, { status }),
  
  // Filters
  getByEmployee: (employeeId) => apiClient.get(`/tasks?employee_id=${employeeId}`),
  getByStatus: (status) => apiClient.get(`/tasks?status=${status}`),
  getByPriority: (priority) => apiClient.get(`/tasks?priority=${priority}`),
  
  // Analytics
  getAnalytics: () => apiClient.get('/tasks/analytics/overview'),
};