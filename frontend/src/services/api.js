import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// DEPRECATED - Utiliser payrollService depuis services/payroll.js
// Ces exports sont conservés pour compatibilité temporaire
import { payrollService } from './payroll';

export const payrollConfigAPI = {
  getVariables: () => payrollService.getVariables(),
  createVariable: (data) => payrollService.createVariable(data),
  updateVariable: (id, data) => payrollService.updateVariable(id, data),
  deleteVariable: (id) => payrollService.deleteVariable(id),
  toggleVariable: (id) => payrollService.toggleVariable(id)
};

export const payrollCalculationAPI = {
  startCalculation: (data) => payrollService.calculate(data),
  getIRPPBreakdown: (taxableIncome) => payrollService.getIRPPBreakdown(taxableIncome),
  batchCalculate: (employeesData) => payrollService.batchCalculate(employeesData)
};

export const payslipsAPI = {
  generatePayslips: (data) => payrollService.generatePayslips(data),
  getPayslips: (params) => payrollService.getPayslips(params),
  downloadPayslip: (payslipId) => payrollService.downloadPayslip(payslipId),
  sendPayslip: (payslipId) => payrollService.sendPayslip(payslipId)
};

export const payrollAccountingAPI = {
  generateEntries: (data) => payrollService.generateAccountingEntries(data),
  getAccountingEntries: (params) => payrollService.getAccountingEntries(params),
  validateEntry: (entryId) => payrollService.validateEntry(entryId),
  postEntry: (entryId) => payrollService.postEntry(entryId)
};

export const socialDeclarationsAPI = {
  generateDeclaration: (data) => payrollService.generateDeclaration(data),
  getDeclarations: (params) => payrollService.getDeclarations(params),
  submitDeclaration: (declarationId) => payrollService.submitDeclaration(declarationId),
  downloadDeclaration: (declarationId) => payrollService.downloadDeclaration(declarationId)
};

export default api;