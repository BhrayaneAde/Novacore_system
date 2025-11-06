import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Zap, List } from 'lucide-react';
import PayrollVariablesManager from './PayrollVariablesManager';
import QuickSetupWizard from '../../components/payroll/QuickSetupWizard';
import PayrollLoader from '../../components/payroll/PayrollLoader';
import api from '../../services/api';

const PayrollConfigPage = ({ setActiveTab }) => {
  const [view, setView] = useState('overview'); // overview, variables, setup
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  const [configStatus, setConfigStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConfigStatus();
  }, []);

  const checkConfigStatus = async () => {
    try {
      const response = await api.get('/payroll-config/status');
      setConfigStatus(response.data);
      
      // Si pas configuré, aller directement aux variables
      if (!response.data.is_configured) {
        setView('variables');
      }
    } catch (error) {
      console.error('Erreur statut config:', error);
      setConfigStatus({ is_configured: false, variables_count: 0, active_variables_count: 0 });
      setView('variables');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSetupComplete = (result) => {
    setShowQuickSetup(false);
    setView('variables');
    checkConfigStatus();
  };

  if (loading) {
    return <PayrollLoader message="Chargement de la configuration..." />;
  }

  if (view === 'variables') {
    return <PayrollVariablesManager />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => setActiveTab('payroll')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la paie
        </button>
        <div className="bg-gradient-to-r from-teal-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
          <h1 className="text-3xl font-bold mb-2">Configuration de Paie</h1>
          <p className="text-teal-100 text-lg">Système de paie intelligent et conforme à la législation béninoise</p>
        </div>
      </div>

      {/* Statut de la configuration */}
      {configStatus && (
        <div className="mb-6 bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Statut de la Configuration</h2>
            <div className={`px-3 py-1 rounded-full text-sm ${
              configStatus.setup_complete 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {configStatus.setup_complete ? 'Configuré' : 'En cours'}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{configStatus.variables_count}</div>
              <div className="text-sm text-gray-600">Variables totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{configStatus.active_variables_count}</div>
              <div className="text-sm text-gray-600">Variables actives</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                configStatus.is_configured ? 'text-green-600' : 'text-red-600'
              }`}>
                {configStatus.is_configured ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Configuration</div>
            </div>
          </div>

          {configStatus.next_steps && configStatus.next_steps.filter(Boolean).length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Prochaines étapes :</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                {configStatus.next_steps.filter(Boolean).map((step, index) => (
                  <li key={index}>• {step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Actions principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <List className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gérer les Variables</h3>
              <p className="text-sm text-gray-600">Créer, modifier et organiser vos variables de paie</p>
            </div>
          </div>
          <button
            onClick={() => setView('variables')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ouvrir le gestionnaire
          </button>
        </div>

        <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <Zap className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Configuration Rapide</h3>
              <p className="text-sm text-gray-600">Assistant pour configurer rapidement votre paie</p>
            </div>
          </div>
          <button
            onClick={() => setShowQuickSetup(true)}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Lancer l'assistant
          </button>
        </div>
      </div>

      {/* Guide de démarrage */}
      {!configStatus?.setup_complete && (
        <div className="mt-6 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Guide de Démarrage</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                1
              </div>
              <span className="text-gray-700">Utilisez la configuration rapide pour commencer</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                2
              </div>
              <span className="text-gray-700">Personnalisez vos variables dans le gestionnaire</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                3
              </div>
              <span className="text-gray-700">Configurez les salaires de vos employés</span>
            </div>
          </div>
        </div>
      )}

      {/* Assistant de configuration rapide */}
      {showQuickSetup && (
        <QuickSetupWizard
          onComplete={handleQuickSetupComplete}
          onCancel={() => setShowQuickSetup(false)}
        />
      )}
      </div>
    </div>
  );
};

export default PayrollConfigPage;