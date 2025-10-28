import apiClient from '../api/client';

export const hrService = {
  // Contracts
  contracts: {
    getAll: () => apiClient.get('/contracts'),
    getById: (id) => apiClient.get(`/contracts/${id}`),
    create: (data) => apiClient.post('/contracts', data),
    update: (id, data) => apiClient.put(`/contracts/${id}`, data),
    delete: (id) => apiClient.delete(`/contracts/${id}`),
    
    templates: {
      getAll: () => apiClient.get('/contracts/templates'),
      getById: (id) => apiClient.get(`/contracts/templates/${id}`),
      create: (data) => apiClient.post('/contracts/templates', data),
      update: (id, data) => apiClient.put(`/contracts/templates/${id}`, data),
      delete: (id) => apiClient.delete(`/contracts/templates/${id}`),
    }
  },
  
  // Recruitment
  recruitment: {
    getAll: () => apiClient.get('/recruitment'),
    getById: (id) => apiClient.get(`/recruitment/${id}`),
    create: (data) => apiClient.post('/recruitment', data),
    update: (id, data) => apiClient.put(`/recruitment/${id}`, data),
    delete: (id) => apiClient.delete(`/recruitment/${id}`),

    // Gestion des offres d'emploi (utilise les services existants)
    createJobOpening: async (data) => {
      const response = await apiClient.post('/recruitment/job-openings', data);
      return response.data;
    },

    updateJobOpening: async (id, data) => {
      const response = await apiClient.put(`/recruitment/job-openings/${id}`, data);
      return response.data;
    },

    getJobOpening: async (id) => {
      const response = await apiClient.get(`/recruitment/job-openings/${id}`);
      return response.data;
    }
  },
  
  // Payroll
  payroll: {
    getAll: () => apiClient.get('/payroll'),
    getById: (id) => apiClient.get(`/payroll/${id}`),
    create: (data) => apiClient.post('/payroll', data),
    update: (id, data) => apiClient.put(`/payroll/${id}`, data),
    delete: (id) => apiClient.delete(`/payroll/${id}`),
  },
  
  // Attendance
  attendance: {
    getAll: () => apiClient.get('/attendance'),
    getById: (id) => apiClient.get(`/attendance/${id}`),
    create: (data) => apiClient.post('/attendance', data),
    update: (id, data) => apiClient.put(`/attendance/${id}`, data),
    delete: (id) => apiClient.delete(`/attendance/${id}`),
  },

  // Gestion des avantages (utilise les services existants)
  benefits: {
    getAll: () => apiClient.get('/payroll/benefits'),
    create: (data) => apiClient.post('/payroll/benefits', data),
    update: (id, data) => apiClient.put(`/payroll/benefits/${id}`, data),
    delete: (id) => apiClient.delete(`/payroll/benefits/${id}`)
  },
  
  // Departments
  departments: {
    getAll: () => apiClient.get('/settings/departments'),
    getById: (id) => apiClient.get(`/settings/departments/${id}`),
    create: (data) => apiClient.post('/settings/departments', data),
    update: (id, data) => apiClient.put(`/settings/departments/${id}`, data),
    delete: (id) => apiClient.delete(`/settings/departments/${id}`)
  }
};