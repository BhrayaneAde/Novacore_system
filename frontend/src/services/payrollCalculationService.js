import api from './api';

export const payrollCalculationService = {
  // Calculs de paie
  calculate: (data) => api.post('/payroll/calculate', data),
  calculateBatch: (employeeIds, period) => api.post('/payroll/calculate/batch', {
    employee_ids: employeeIds,
    period: period
  }),
  saveCalculation: (result) => api.post('/payroll/save-calculation', result),
  
  // Données employé
  getEmployeePayrollData: (employeeId, period) => api.get(`/payroll/employee-data/${employeeId}/${period}`),
  saveEmployeePayrollData: (data) => api.post('/payroll/employee-data', data),
  
  // Validation et finalisation
  validatePayroll: (period) => api.post('/payroll/validate', { period }),
  finalizePayroll: (data) => api.post('/payroll/finalize', data)
};

export default payrollCalculationService;