import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Calendar, AlertTriangle, CheckCircle, Clock, Calculator, Settings, FileText, BookOpen } from 'lucide-react';
import { payrollConfigAPI, payrollCalculationAPI } from '../../services/api';
import PayrollWorkflowGuide from '../../components/payroll/PayrollWorkflowGuide';

const PayrollOverview = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    variablesCount: 0,
    lastCalculation: null,
    monthlyTotal: 0,
    pendingCalculations: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      // Charger les variables de paie
      const variablesResponse = await payrollConfigAPI.getVariables();
      const variables = variablesResponse.data || [];

      // Charger l'historique des calculs
      const historyResponse = await payrollCalculationAPI.getCalculationHistory(5);
      const history = historyResponse.data || [];

      // Simulation des données employés
      const mockEmployees = [
        { id: 1, name: 'Jean Dupont', salary: 50000 },
        { id: 2, name: 'Marie Martin', salary: 45000 },
        { id: 3, name: 'Pierre Durand', salary: 60000 }
      ];

      const totalSalary = mockEmployees.reduce((sum, emp) => sum + emp.salary, 0);

      setStats({
        totalEmployees: mockEmployees.length,
        variablesCount: variables.length,
        lastCalculation: history[0]?.completed_at || null,
        monthlyTotal: totalSalary * 0.75, // Estimation net
        pendingCalculations: 0
      });

      // Activité récente simulée
      setRecentActivity([
        { id: 1, type: 'calculation', message: 'Calcul de paie Mars 2024 terminé', time: '2h', status: 'success' },
        { id: 2, type: 'variable', message: 'Variable "Prime transport" modifiée', time: '1j', status: 'info' },
        { id: 3, type: 'employee', message: '3 employés traités avec succès', time: '2j', status: 'success' }
      ]);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const quickActions = [
    { 
      name: 'Nouveau Calcul', 
      icon: Calculator, 
      bgColor: 'bg-blue-50 hover:bg-blue-100', 
      borderColor: 'border-blue-200 hover:border-blue-400', 
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600',
      action: (setActiveTab) => setActiveTab('calculation')
    },
    { 
      name: 'Gérer Variables', 
      icon: Settings, 
      bgColor: 'bg-green-50 hover:bg-green-100', 
      borderColor: 'border-green-200 hover:border-green-400', 
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
      action: (setActiveTab) => setActiveTab('variables')
    },
    { 
      name: 'Voir Bulletins', 
      icon: FileText, 
      bgColor: 'bg-purple-50 hover:bg-purple-100', 
      borderColor: 'border-purple-200 hover:border-purple-400', 
      textColor: 'text-purple-700',
      iconColor: 'text-purple-600',
      action: (setActiveTab) => setActiveTab('payslips')
    },
    { 
      name: 'Comptabilité', 
      icon: BookOpen, 
      bgColor: 'bg-orange-50 hover:bg-orange-100', 
      borderColor: 'border-orange-200 hover:border-orange-400', 
      textColor: 'text-orange-700',
      iconColor: 'text-orange-600',
      action: (setActiveTab) => setActiveTab('accounting')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Employés actifs</p>
              <p className="text-3xl font-bold text-blue-900">{stats.totalEmployees}</p>
            </div>
            <Users className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Variables configurées</p>
              <p className="text-3xl font-bold text-green-900">{stats.variablesCount}</p>
            </div>
            <Settings className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Total mensuel</p>
              <p className="text-3xl font-bold text-purple-900">{stats.monthlyTotal.toLocaleString()}€</p>
            </div>
            <DollarSign className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Calculs en attente</p>
              <p className="text-3xl font-bold text-orange-900">{stats.pendingCalculations}</p>
            </div>
            <Clock className="w-10 h-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Guide workflow */}
      <PayrollWorkflowGuide setActiveTab={setActiveTab} stats={stats} />

      {/* Actions rapides */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => action.action(setActiveTab)}
              className={`p-4 rounded-lg border-2 ${action.borderColor} ${action.bgColor} transition-all duration-200`}
            >
              <div className="flex flex-col items-center space-y-2">
                <action.icon className={`w-8 h-8 ${action.iconColor}`} />
                <span className={`text-sm font-medium ${action.textColor}`}>{action.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.status === 'success' ? 'bg-green-500' : 
                activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">Il y a {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statut du système */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut du système</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Variables de paie</p>
              <p className="text-xs text-green-600">Configurées et actives</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Moteur de calcul</p>
              <p className="text-xs text-green-600">Opérationnel</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Bulletins de paie</p>
              <p className="text-xs text-green-600">Opérationnel</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Comptabilité</p>
              <p className="text-xs text-green-600">Opérationnel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollOverview;