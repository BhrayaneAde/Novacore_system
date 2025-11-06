import api from './api';

// Service unifié pour toute la paie
export const payrollService = {
  // Configuration
  getConfig: () => api.get('/payroll-config/'),
  updateConfig: (data) => api.put('/payroll-config/', data),
  setupCompany: (data) => api.post('/payroll-config/setup', data),
  
  // Variables
  getVariables: () => api.get('/payroll-config/variables'),
  createVariable: (data) => api.post('/payroll-config/variables', data),
  updateVariable: (id, data) => api.put(`/payroll-config/variables/${id}`, data),
  deleteVariable: (id) => api.delete(`/payroll-config/variables/${id}`),
  toggleVariable: (id) => api.post(`/payroll-config/variables/${id}/toggle`),
  
  // Calculs
  calculate: (data) => api.post('/payroll-calculation/calculate', data),
  getIRPPBreakdown: (taxableIncome) => api.get(`/payroll-calculation/irpp-breakdown/${taxableIncome}`),
  batchCalculate: (employeesData) => api.post('/payroll-calculation/batch-calculate', employeesData),
  
  // Bulletins
  generatePayslips: (data) => api.post('/payslips/generate', data),
  getPayslips: (params = {}) => api.get('/payslips', { params }),
  downloadPayslip: (payslipId) => api.get(`/payslips/${payslipId}/download`, { responseType: 'blob' }),
  sendPayslip: (payslipId) => api.post(`/payslips/${payslipId}/send`),
  
  // Comptabilité
  generateAccountingEntries: (data) => api.post('/payroll-accounting/generate', data),
  getAccountingEntries: (params = {}) => api.get('/payroll-accounting/entries', { params }),
  validateEntry: (entryId) => api.put(`/payroll-accounting/entries/${entryId}/validate`),
  postEntry: (entryId) => api.put(`/payroll-accounting/entries/${entryId}/post`),
  
  // Déclarations sociales
  generateDeclaration: (data) => api.post('/social-declarations/generate', data),
  getDeclarations: (params = {}) => api.get('/social-declarations', { params }),
  submitDeclaration: (declarationId) => api.put(`/social-declarations/${declarationId}/submit`),
  downloadDeclaration: (declarationId) => api.get(`/social-declarations/${declarationId}/download`, { responseType: 'blob' })
};

export default payrollService;