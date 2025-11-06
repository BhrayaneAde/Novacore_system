import { useState } from 'react';
import { payrollService } from '../services/payroll';

export const usePayroll = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = async (requestFn) => {
    try {
      setLoading(true);
      setError(null);
      const result = await requestFn();
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Une erreur est survenue';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    
    // Variables
    getVariables: () => handleRequest(() => payrollService.getVariables()),
    createVariable: (data) => handleRequest(() => payrollService.createVariable(data)),
    updateVariable: (id, data) => handleRequest(() => payrollService.updateVariable(id, data)),
    deleteVariable: (id) => handleRequest(() => payrollService.deleteVariable(id)),
    toggleVariable: (id) => handleRequest(() => payrollService.toggleVariable(id)),
    
    // Calculs
    calculate: (data) => handleRequest(() => payrollService.calculate(data)),
    getIRPPBreakdown: (income) => handleRequest(() => payrollService.getIRPPBreakdown(income)),
    
    // Bulletins
    generatePayslips: (data) => handleRequest(() => payrollService.generatePayslips(data)),
    getPayslips: (params) => handleRequest(() => payrollService.getPayslips(params)),
    downloadPayslip: (id) => handleRequest(() => payrollService.downloadPayslip(id)),
    sendPayslip: (id) => handleRequest(() => payrollService.sendPayslip(id)),
    
    // Comptabilité
    generateAccountingEntries: (data) => handleRequest(() => payrollService.generateAccountingEntries(data)),
    getAccountingEntries: (params) => handleRequest(() => payrollService.getAccountingEntries(params)),
    validateEntry: (id) => handleRequest(() => payrollService.validateEntry(id)),
    postEntry: (id) => handleRequest(() => payrollService.postEntry(id)),
    
    // Déclarations
    generateDeclaration: (data) => handleRequest(() => payrollService.generateDeclaration(data)),
    getDeclarations: (params) => handleRequest(() => payrollService.getDeclarations(params)),
    submitDeclaration: (id) => handleRequest(() => payrollService.submitDeclaration(id)),
    downloadDeclaration: (id) => handleRequest(() => payrollService.downloadDeclaration(id))
  };
};

export default usePayroll;