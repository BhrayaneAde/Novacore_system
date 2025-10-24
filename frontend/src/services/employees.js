import apiClient from '../api/client';

export const employeesService = {
  getAll: () => apiClient.get('/hr/employees'),
  getById: (id) => apiClient.get(`/hr/employees/${id}`),
  create: (data) => apiClient.post('/hr/employees', data),
  update: (id, data) => apiClient.put(`/hr/employees/${id}`, data),
  delete: (id) => apiClient.delete(`/hr/employees/${id}`),
  
  // Departments
  departments: {
    getAll: () => apiClient.get('/hr/departments'),
    getById: (id) => apiClient.get(`/hr/departments/${id}`),
    create: (data) => apiClient.post('/hr/departments', data),
    update: (id, data) => apiClient.put(`/hr/departments/${id}`, data),
    delete: (id) => apiClient.delete(`/hr/departments/${id}`),
  }
};