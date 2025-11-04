import { useState, useEffect } from 'react';
import payrollConfigService from '../services/payrollConfigService';

export const usePayrollConfig = () => {
  const [config, setConfig] = useState(null);
  const [variables, setVariables] = useState([]);
  const [templates, setTemplates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await payrollConfigService.getConfig();
      setConfig(response.data);
    } catch (err) {
      // 404 est normal si pas encore configuré
      if (err.response?.status === 404) {
        setConfig(null);
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        // Erreur d'authentification - configuration requise
        setConfig(null);
      } else {
        setError(err.response?.data?.detail || 'Erreur lors du chargement de la configuration');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadVariables = async () => {
    try {
      setLoading(true);
      const response = await payrollConfigService.getVariables();
      setVariables(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors du chargement des variables');
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await payrollConfigService.getTemplates();
      setTemplates(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors du chargement des templates');
    }
  };

  const setupCompany = async (setupData) => {
    try {
      setLoading(true);
      const response = await payrollConfigService.setupCompany(setupData);
      setConfig(response.data);
      await loadVariables();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la configuration');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addVariable = async (variableData) => {
    try {
      setLoading(true);
      const response = await payrollConfigService.createVariable(variableData);
      setVariables(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de l\'ajout de la variable');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateVariable = async (id, variableData) => {
    try {
      setLoading(true);
      const response = await payrollConfigService.updateVariable(id, variableData);
      setVariables(prev => prev.map(v => v.id === id ? response.data : v));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la modification');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVariable = async (id) => {
    try {
      setLoading(true);
      await payrollConfigService.deleteVariable(id);
      setVariables(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleVariable = async (id) => {
    try {
      const response = await payrollConfigService.toggleVariable(id);
      setVariables(prev => prev.map(v => 
        v.id === id ? { ...v, is_active: response.data.is_active } : v
      ));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors du changement de statut');
      throw err;
    }
  };

  // Remove automatic config loading on mount
  // Templates will be loaded when needed

  return {
    config,
    variables,
    templates,
    loading,
    error,
    loadConfig,
    loadVariables,
    loadTemplates,
    setupCompany,
    addVariable,
    updateVariable,
    deleteVariable,
    toggleVariable,
    setError
  };
};

export default usePayrollConfig;