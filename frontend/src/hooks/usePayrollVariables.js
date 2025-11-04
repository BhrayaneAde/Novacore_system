import { useState, useEffect } from 'react';

export const usePayrollVariables = () => {
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  const loadVariables = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/payroll-config/variables', {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Erreur chargement variables');
      
      const data = await response.json();
      setVariables(data.variables || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createVariable = async (variableData) => {
    setError(null);
    try {
      const response = await fetch('/api/v1/payroll-config/variables', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(variableData)
      });

      if (!response.ok) throw new Error('Erreur création variable');

      const newVariable = await response.json();
      setVariables(prev => [...prev, newVariable]);
      return newVariable;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateVariable = async (id, updates) => {
    setError(null);
    try {
      const response = await fetch(`/api/v1/payroll-config/variables/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Erreur mise à jour variable');

      const updatedVariable = await response.json();
      setVariables(prev => prev.map(v => v.id === id ? updatedVariable : v));
      return updatedVariable;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteVariable = async (id) => {
    setError(null);
    try {
      const response = await fetch(`/api/v1/payroll-config/variables/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Erreur suppression variable');

      setVariables(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const toggleVariable = async (id) => {
    setError(null);
    try {
      const response = await fetch(`/api/v1/payroll-config/variables/${id}/toggle`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Erreur toggle variable');

      const data = await response.json();
      setVariables(prev => prev.map(v => 
        v.id === id ? { ...v, is_active: data.variable.is_active } : v
      ));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const reorderVariables = async (reorderedVariables) => {
    setError(null);
    try {
      const response = await fetch('/api/v1/payroll-config/variables/reorder', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          variable_orders: reorderedVariables.map((v, index) => ({
            id: v.id,
            display_order: index
          }))
        })
      });

      if (!response.ok) throw new Error('Erreur réorganisation');

      setVariables(reorderedVariables);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const createFromTemplate = async (template) => {
    return createVariable({
      ...template,
      display_order: variables.length
    });
  };

  const createBulkVariables = async (variablesData) => {
    setError(null);
    try {
      const response = await fetch('/api/v1/payroll-config/variables/bulk', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ variables: variablesData })
      });

      if (!response.ok) throw new Error('Erreur création en lot');

      const result = await response.json();
      await loadVariables(); // Recharger la liste
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    loadVariables();
  }, []);

  return {
    variables,
    loading,
    error,
    loadVariables,
    createVariable,
    updateVariable,
    deleteVariable,
    toggleVariable,
    reorderVariables,
    createFromTemplate,
    createBulkVariables
  };
};