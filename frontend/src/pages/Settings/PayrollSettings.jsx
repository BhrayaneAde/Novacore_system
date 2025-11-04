import React, { useState, useEffect } from 'react';
import { Settings, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePayrollConfig } from '../../hooks/usePayrollConfig';
import VariableManager from '../../components/payroll/VariableManager';
import { COMPANY_TYPES } from '../../data/payrollConstants';

const PayrollSettings = () => {
  const navigate = useNavigate();
  const { config, loading, error, loadConfig } = usePayrollConfig();
  const [activeTab, setActiveTab] = useState('variables');

  useEffect(() => {
    loadConfig();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configuration de la paie</h1>
              <p className="text-gray-600">Gérez les paramètres de calcul de paie de votre entreprise</p>
            </div>
          </div>
        </div>

        {config && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Configuration active: {COMPANY_TYPES[config.company_type] || config.company_type}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('variables')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'variables'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Variables de paie
            </button>
            <button
              onClick={() => setActiveTab('formulas')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'formulas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Formules personnalisées
            </button>
            <button
              onClick={() => setActiveTab('taxes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'taxes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Barèmes fiscaux
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'variables' && <VariableManager />}
        
        {activeTab === 'formulas' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Formules personnalisées</h3>
            <p className="text-gray-600">
              Cette section permettra de définir des formules de calcul personnalisées pour les variables complexes.
            </p>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                🚧 Fonctionnalité en cours de développement
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'taxes' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Barèmes fiscaux et sociaux</h3>
            <p className="text-gray-600">
              Configuration des taux de cotisations sociales et des tranches d'imposition.
            </p>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                🚧 Fonctionnalité en cours de développement
              </p>
            </div>
          </div>
        )}
      </div>

      {!config && !loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Configuration requise</h3>
          <p className="text-blue-700 mb-4">
            Vous devez d'abord configurer votre type d'entreprise pour utiliser le module de paie.
          </p>
          <button
            onClick={() => navigate('/settings/payroll-setup')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Commencer la configuration
          </button>
        </div>
      )}
    </div>
  );
};

export default PayrollSettings;