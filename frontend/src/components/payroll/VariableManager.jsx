import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Lock } from 'lucide-react';
import { usePayrollConfig } from '../../hooks/usePayrollConfig';
import { VARIABLE_TYPE_LABELS, VARIABLE_TYPE_COLORS, CALCULATION_METHOD_LABELS } from '../../data/payrollConstants';

const VariableManager = () => {
  const { variables, loading, error, loadVariables, updateVariable, deleteVariable, toggleVariable } = usePayrollConfig();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadVariables();
  }, []);

  const handleToggle = async (variableId) => {
    try {
      await toggleVariable(variableId);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const handleDelete = async (variableId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette variable ?')) {
      try {
        await deleteVariable(variableId);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Variables de paie</h2>
            <p className="text-gray-600">Gérez les variables de calcul de paie de votre entreprise</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une variable</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Code</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Nom</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Méthode de calcul</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Valeur/Taux</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Statut</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {variables.map((variable) => (
              <tr key={variable.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-medium text-gray-900">
                      {variable.code}
                    </span>
                    {variable.is_mandatory && (
                      <Lock className="w-4 h-4 text-orange-500" title="Variable obligatoire" />
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-900">{variable.name}</span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    VARIABLE_TYPE_COLORS[variable.variable_type] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {VARIABLE_TYPE_LABELS[variable.variable_type] || variable.variable_type}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-600">
                    {CALCULATION_METHOD_LABELS[variable.calculation_method] || variable.calculation_method}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-900">
                    {variable.fixed_amount && `${variable.fixed_amount.toLocaleString()} XOF`}
                    {variable.percentage_rate && `${variable.percentage_rate}%`}
                    {variable.formula && (
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {variable.formula.length > 20 ? `${variable.formula.substring(0, 20)}...` : variable.formula}
                      </span>
                    )}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => handleToggle(variable.id)}
                    disabled={variable.is_mandatory && variable.is_active}
                    className={`flex items-center space-x-1 ${
                      variable.is_mandatory && variable.is_active 
                        ? 'cursor-not-allowed opacity-50' 
                        : 'cursor-pointer'
                    }`}
                  >
                    {variable.is_active ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-green-500" />
                        <span className="text-green-600 text-sm">Actif</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-500 text-sm">Inactif</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {/* TODO: Ouvrir modal d'édition */}}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {!variable.is_mandatory && (
                      <button
                        onClick={() => handleDelete(variable.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {variables.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune variable de paie configurée</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Ajouter votre première variable
          </button>
        </div>
      )}
    </div>
  );
};

export default VariableManager;