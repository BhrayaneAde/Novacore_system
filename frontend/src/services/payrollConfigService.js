import api from './api';

export const payrollConfigService = {
  // Templates
  getTemplates: () => api.get('/payroll-config/templates'),
  getTemplate: (companyType) => api.get(`/payroll-config/templates/${companyType}`),
  getTaxRates: () => api.get('/payroll-config/tax-rates'),
  
  // Configuration entreprise
  setupCompany: (data) => api.post('/payroll-config/setup', data),
  getConfig: () => api.get('/payroll-config/'),
  updateConfig: (data) => api.put('/payroll-config/', data),
  
  // Variables de paie
  getVariables: () => api.get('/payroll-config/variables'),
  createVariable: (data) => api.post('/payroll-config/variables', data),
  updateVariable: (id, data) => api.put(`/payroll-config/variables/${id}`, data),
  deleteVariable: (id) => api.delete(`/payroll-config/variables/${id}`),
  toggleVariable: (id) => api.post(`/payroll-config/variables/${id}/toggle`)
};

export default payrollConfigService;