import React, { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, Calendar, Settings, Calculator, FileText, AlertCircle, UserCog, Download, Send, Search } from 'lucide-react';
import { usePayroll } from '../../../hooks/usePayroll';
import EmployeePayrollSetup from '../../../components/payroll/EmployeePayrollSetup';
import SmartEmployeeSetup from '../../../components/payroll/SmartEmployeeSetup';
import SmartPayrollTable from '../../../components/payroll/SmartPayrollTable';

import AdvancedEmployeeSetup from '../../../components/payroll/AdvancedEmployeeSetup';
import MonthlyProcessing from '../../../components/payroll/MonthlyProcessing';
import PayrollReports from '../../../components/payroll/PayrollReports';

import api from '../../../services/api';

const PayrollPage = ({ setActiveTab }) => {
  const { getConfig } = usePayroll();
  const [config, setConfig] = useState(null);

  const loadConfig = async () => {
    try {
      const response = await getConfig();
      setConfig(response.data);
    } catch (error) {
      console.error('Config not found:', error);
      setConfig(null);
    }
  };
  const [activeView, setActiveView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeForSetup, setSelectedEmployeeForSetup] = useState(null);
  const [payrollStats, setPayrollStats] = useState({
    totalPayroll: 0,
    employeeCount: 0,
    averageSalary: 0,
    processedCount: 0,
    pendingCount: 0
  });
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    loadConfig().catch(() => {
      // Ignore 404 errors - config doesn't exist yet
    });
    loadPayrollStats();
    loadPayrollRecords();
    loadHistoryData();
  }, [selectedMonth]);

  const loadPayrollStats = async () => {
    try {
      const response = await api.get(`/payroll/records/stats?period=${selectedMonth}`);
      setPayrollStats(response.data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const loadPayrollRecords = async () => {
    try {
      const response = await api.get(`/payroll/records/?period=${selectedMonth}`);
      setPayrollRecords(response.data.records || []);
    } catch (error) {
      console.error('Erreur chargement records:', error);
      setPayrollRecords([]);
    }
  };

  const loadHistoryData = async () => {
    try {
      const response = await api.get('/payroll/records/');
      const records = response.data.records || [];
      
      // Grouper par période
      const groupedByPeriod = records.reduce((acc, record) => {
        const period = record.period;
        if (!acc[period]) {
          acc[period] = {
            period: period,
            employeeCount: 0,
            totalAmount: 0,
            records: []
          };
        }
        acc[period].employeeCount++;
        acc[period].totalAmount += record.net_salary;
        acc[period].records.push(record);
        return acc;
      }, {});
      
      // Tri par date avec une vraie bibliothèque de dates
      const sortedData = Object.values(groupedByPeriod).sort((a, b) => {
        const dateA = new Date(a.period + '-01');
        const dateB = new Date(b.period + '-01');
        return dateB - dateA; // Tri décroissant (plus récent en premier)
      });
      
      setHistoryData(sortedData);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      setHistoryData([]);
    }
  };



  const filteredRecords = payrollRecords.filter(record => 
    record.employee_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPayroll = payrollRecords.reduce((sum, record) => sum + (record.net_salary || 0), 0);
  const processedCount = payrollRecords.filter((r) => r.status === "processed").length;

  // Vue de paramétrage intelligent des employés
  if (activeView === 'employee-setup') {
    if (selectedEmployeeForSetup) {
      return (
        <AdvancedEmployeeSetup 
          employee={selectedEmployeeForSetup}
          onSave={() => {
            setSelectedEmployeeForSetup(null);
            loadPayrollRecords();
          }}
          onBack={() => setSelectedEmployeeForSetup(null)}
        />
      );
    }
    return (
      <SmartPayrollTable 
        onBack={() => setActiveView('overview')}
        onEmployeeSelect={(employee) => setSelectedEmployeeForSetup(employee)}
      />
    );
  }
  
  // Vue de traitement mensuel
  if (activeView === 'processing') {
    return (
      <MonthlyProcessing 
        period={selectedMonth}
        onComplete={() => {
          setActiveView('overview');
          loadPayrollRecords();
        }}
      />
    );
  }

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Paie & Avantages</h1>
            <p className="text-gray-600">Gérez les salaires et les avantages sociaux</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                if (setActiveTab) {
                  setActiveTab('payroll-config');
                } else {
                  alert('Configuration de paie - Fonctionnalité en cours de développement');
                }
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Configuration</span>
            </button>
          </div>
        </div>
        
        {!config && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              ⚠️ Configuration de paie requise. 
              <button 
                onClick={() => {
                  if (setActiveTab) {
                    setActiveTab('payroll-config');
                  } else {
                    alert('Configuration de paie - Fonctionnalité en cours de développement');
                  }
                }}
                className="text-yellow-900 underline hover:no-underline ml-1"
              >
                Configurer maintenant
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {(payrollStats.total_payroll || 0).toLocaleString("fr-FR")} F
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Total mensuel</h3>
          <p className="text-sm text-gray-600">Salaires nets</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">{payrollStats.processed_count || 0}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Salaires traités</h3>
          <p className="text-sm text-gray-600">Ce mois</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-orange-600">{payrollStats.pending_count || 0}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">En attente</h3>
          <p className="text-sm text-gray-600">Traitement</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-purple-600">
              {(payrollStats.average_salary || 0).toLocaleString("fr-FR")} F
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Salaire moyen</h3>
          <p className="text-sm text-gray-600">Par employé</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveView('overview')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeView === 'overview' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Tableau de bord</span>
              </button>
              <button
                onClick={() => setActiveView('employee-setup')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeView === 'employee-setup' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <UserCog className="w-4 h-4" />
                <span>Paramétrage</span>
              </button>
              <button
                onClick={() => setActiveView('processing')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeView === 'processing' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>Traitement</span>
              </button>
              <button
                onClick={() => setActiveView('history')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeView === 'history' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Historique</span>
              </button>
              <button
                onClick={() => setActiveView('reports')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeView === 'reports' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Rapports</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const current = new Date(selectedMonth + '-01');
                  const prev = new Date(current.getFullYear(), current.getMonth() - 1, 1);
                  setSelectedMonth(`${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ←
              </button>
              <span className="px-4 py-2 bg-gray-50 rounded-lg font-medium text-gray-900 min-w-[140px] text-center">
                {new Date(selectedMonth + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => {
                  const current = new Date(selectedMonth + '-01');
                  const next = new Date(current.getFullYear(), current.getMonth() + 1, 1);
                  setSelectedMonth(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeView === 'overview' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Employé</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Période</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Salaire de base</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Bonus</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Déductions</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Net à payer</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Statut</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {record.employee_name?.split(' ').map(n => n[0]).join('') || 'N/A'}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{record.employee_name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{record.period || 'N/A'}</td>
                    <td className="py-4 px-6 text-gray-900">
                      {(record.gross_salary || 0).toLocaleString("fr-FR")} F
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-green-600 font-medium">
                        +{(record.bonus || 0).toLocaleString("fr-FR")} F
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-red-600 font-medium">
                        -{(record.total_deductions || 0).toLocaleString("fr-FR")} F
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-gray-900">
                        {(record.net_salary || 0).toLocaleString("fr-FR")} F
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status === 'processed' ? 'Traité' : 'En attente'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        {record.status === 'pending' && (
                          <button className="text-green-600 hover:text-green-700 transition-colors">
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total de la période</span>
              <div className="flex items-center space-x-6">
                <span className="text-sm font-medium text-gray-900">
                  Salaires traités: <span className="font-bold">{processedCount}/{payrollRecords.length}</span>
                </span>
                <span className="text-sm font-medium text-gray-900">
                  Montant total: <span className="font-bold text-blue-600">{totalPayroll.toLocaleString("fr-FR")} F</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}



      {activeView === 'history' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des paies</h3>
          <p className="text-gray-600">Fonctionnalité disponible dans l'onglet Rapports</p>
        </div>
      )}

      {activeView === 'reports' && <PayrollReports period={selectedMonth} />}
    </div>
  );
};

export default PayrollPage;