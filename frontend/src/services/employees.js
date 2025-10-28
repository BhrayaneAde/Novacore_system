import apiClient from '../api/client';

export const employeesService = {
  getAll: () => apiClient.get('/employees/employees'),
  getById: (id) => apiClient.get(`/employees/employees/${id}`),
  create: (data) => apiClient.post('/employees/employees', data),
  update: (id, data) => apiClient.put(`/employees/employees/${id}`, data),
  delete: (id) => apiClient.delete(`/employees/employees/${id}`),
  
  // Departments
  departments: {
    getAll: () => apiClient.get('/settings/departments'),
    getById: (id) => apiClient.get(`/settings/departments/${id}`),
    create: (data) => apiClient.post('/settings/departments', data),
    update: (id, data) => apiClient.put(`/settings/departments/${id}`, data),
    delete: (id) => apiClient.delete(`/settings/departments/${id}`),
  }
};