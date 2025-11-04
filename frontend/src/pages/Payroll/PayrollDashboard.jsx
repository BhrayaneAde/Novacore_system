import React, { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, Calendar, Settings, Calculator, FileText, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePayrollConfig } from '../../hooks/usePayrollConfig';

const PayrollDashboard = () => {
  const navigate = useNavigate();
  const { config, loadConfig } = usePayrollConfig();
  const [stats, setStats] = useState({
    totalPayroll: 125000,
    employeeCount: 15,
    averageSalary: 8333,
    pendingCalculations: 3
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const quickActions = [
    {
      title: 'Calculer la paie',
      description: 'Traiter les salaires du mois',
      icon: Calculator,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => navigate('/payroll/processing')
    },
    {
      title: 'Valider les calculs',
      description: 'Approuver les bulletins',
      icon: FileText,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => navigate('/payroll/validation')
    },
    {
      title: 'Configuration',
      description: 'Gérer les variables',
      icon: Settings,
      color: 'bg-gray-600 hover:bg-gray-700',
      action: () => navigate('/settings/payroll-variables')
    }
  ];

  const recentActivity = [
    { id: 1, action: 'Calcul de paie', employee: 'Marie Dubois', amount: 4667, date: '2024-01-15' },
    { id: 2, action: 'Validation', employee: 'Thomas Martin', amount: 5550, date: '2024-01-15' },
    { id: 3, action: 'Export bulletin', employee: 'Sophie Laurent', amount: 3733, date: '2024-01-14' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord Paie</h1>
        <p className="text-gray-600">Vue d'ensemble de la gestion de paie</p>
      </div>

      {/* Configuration Alert */}
      {!config && (
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-800">Configuration requise</h3>
              <p className="text-yellow-700 text-sm">
                Configurez votre système de paie pour commencer à traiter les salaires.
              </p>
            </div>
            <button
              onClick={() => navigate('/settings/payroll-setup')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Configurer
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {stats.totalPayroll.toLocaleString()} €
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Masse salariale</h3>
          <p className="text-sm text-gray-600">Ce mois</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">{stats.employeeCount}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Employés</h3>
          <p className="text-sm text-gray-600">Actifs</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-purple-600">
              {stats.averageSalary.toLocaleString()} €
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Salaire moyen</h3>
          <p className="text-sm text-gray-600">Par employé</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-orange-600">{stats.pendingCalculations}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">En attente</h3>
          <p className="text-sm text-gray-600">Calculs à traiter</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Actions rapides</h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`w-full p-4 ${action.color} text-white rounded-lg transition-colors flex items-center space-x-4`}
                >
                  <Icon className="w-6 h-6" />
                  <div className="text-left">
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Activité récente</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.employee}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{activity.amount.toLocaleString()} €</p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Configuration Status */}
      {config && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration actuelle</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900">Type d'entreprise</h3>
              <p className="text-green-700">{config.company_type}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900">Variables configurées</h3>
              <p className="text-blue-700">
                {config.payroll_variables?.variables?.length || 0} variables actives
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-medium text-purple-900">Dernière mise à jour</h3>
              <p className="text-purple-700">
                {new Date(config.updated_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollDashboard;