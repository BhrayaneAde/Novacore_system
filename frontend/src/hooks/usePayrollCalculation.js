import { useState } from 'react';
import payrollCalculationService from '../services/payrollCalculationService';

export const usePayrollCalculation = () => {
  const [calculationResult, setCalculationResult] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculate = async (employeeId, period, variableValues) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await payrollCalculationService.calculate({
        employee_id: employeeId,
        period: period,
        variable_values: variableValues
      });
      
      setCalculationResult(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Erreur lors du calcul de paie';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const calculateBatch = async (employeeIds, period) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await payrollCalculationService.calculateBatch(employeeIds, period);
      setBatchResults(response.data.results);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Erreur lors du calcul en lot';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveCalculation = async (calculationResult) => {
    try {
      setLoading(true);
      const response = await payrollCalculationService.saveCalculation(calculationResult);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Erreur lors de la sauvegarde';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = (variableValues, requiredVariables) => {
    const errors = [];
    
    requiredVariables.forEach(variable => {
      if (variable.is_mandatory && !variableValues[variable.code]) {
        errors.push(`${variable.name} est obligatoire`);
      }
    });

    Object.entries(variableValues).forEach(([code, value]) => {
      if (value < 0) {
        errors.push(`La valeur de ${code} ne peut pas être négative`);
      }
    });

    return errors;
  };

  const resetCalculation = () => {
    setCalculationResult(null);
    setBatchResults([]);
    setError(null);
  };

  return {
    calculationResult,
    batchResults,
    loading,
    error,
    calculate,
    calculateBatch,
    saveCalculation,
    validateInputs,
    resetCalculation,
    setError
  };
};

export default usePayrollCalculation;