import React, { useState, useEffect } from 'react';
import { Calculator, Users, DollarSign, TrendingUp, AlertCircle, CheckCircle, Play, Pause, RotateCcw, Eye } from 'lucide-react';
import { payrollConfigAPI, payrollCalculationAPI } from '../../services/api';
import IRPPBreakdown from '../../components/payroll/IRPPBreakdown';

const PayrollCalculationEngine = () => {
  const [employees, setEmployees] = useState([]);
  const [variables, setVariables] = useState([]);
  const [calculations, setCalculations] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    errors: 0
  });
  const [showIRPPDetail, setShowIRPPDetail] = useState(null);

  useEffect(() => {
    loadVariables();
    loadEmployees();
  }, []);

  const loadVariables = async () => {
    try {
      const response = await payrollConfigAPI.getVariables();
      setVariables(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des variables:', error);
    }
  };

  const loadEmployees = async () => {
    // Simulation d'employés - à remplacer par un vrai appel API
    const mockEmployees = [
      { id: 1, name: 'Jean Dupont', position: 'Développeur', salary: 50000 },
      { id: 2, name: 'Marie Martin', position: 'Designer', salary: 45000 },
      { id: 3, name: 'Pierre Durand', position: 'Manager', salary: 60000 }
    ];
    setEmployees(mockEmployees);
    setStats(prev => ({ ...prev, total: mockEmployees.length }));
  };

  const calculatePayroll = async () => {
    if (!selectedPeriod) {
      alert('Veuillez sélectionner une période');
      return;
    }

    setIsCalculating(true);
    setStats({ total: employees.length, completed: 0, inProgress: employees.length, errors: 0 });

    try {
      const response = await payrollCalculationAPI.startCalculation({
        period: selectedPeriod,
        employee_ids: employees.map(emp => emp.id)
      });

      const calculationData = response.data;
      
      // Mise à jour des stats
      setStats({
        total: calculationData.total_employees,
        completed: calculationData.completed_employees,
        inProgress: 0,
        errors: calculationData.failed_employees
      });

      // Formatage des résultats pour l'affichage
      const formattedCalculations = calculationData.calculations.map(calc => ({
        id: `${calc.employee_id}_${calc.period}`,
        employeeId: calc.employee_id,
        employeName: calc.employee_name || 'Inconnu',
        period: calc.period,
        baseSalary: calc.base_salary,
        grossSalary: calc.gross_salary,
        netSalary: calc.net_salary,
        deductions: calc.total_employee_deductions,
        cnssEmployee: calc.cnss_employee,
        cnssEmployer: calc.cnss_employer,
        irppAmount: calc.irpp_amount,
        overtimeAmount: calc.overtime_amount,
        absenceDeduction: calc.absence_deduction,
        costToCompany: calc.cost_to_company,
        status: 'completed',
        calculatedAt: calc.calculated_at
      }));

      setCalculations(formattedCalculations);
    } catch (error) {
      console.error('Erreur lors du calcul de paie:', error);
      setStats(prev => ({ ...prev, errors: prev.total, inProgress: 0 }));
      alert('Erreur lors du calcul de paie');
    } finally {
      setIsCalculating(false);
    }
  };

  const resetCalculations = () => {
    setCalculations([]);
    setStats({ total: employees.length, completed: 0, inProgress: 0, errors: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calculator className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Moteur de Calcul de Paie</h2>
              <p className="text-gray-600">Calcul automatique des salaires et charges</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sélectionner une période</option>
              <option value="2024-01">Janvier 2024</option>
              <option value="2024-02">Février 2024</option>
              <option value="2024-03">Mars 2024</option>
            </select>
            
            <button
              onClick={calculatePayroll}
              disabled={isCalculating || !selectedPeriod}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              <span>{isCalculating ? 'Calcul en cours...' : 'Lancer le calcul'}</span>
            </button>
            
            <button
              onClick={resetCalculations}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Employés à traiter</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Calculs terminés</p>
                <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">En cours</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.inProgress}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Erreurs</p>
                <p className="text-2xl font-bold text-red-900">{stats.errors}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {calculations.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Résultats des calculs</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Employé</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Salaire de base</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Salaire brut</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Déductions</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Salaire net</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.map((calc) => (
                    <tr key={calc.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{calc.employeName}</div>
                          <div className="text-xs text-gray-500">ID: {calc.employeeId}</div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">{calc.baseSalary.toLocaleString()} FCFA</td>
                      <td className="px-4 py-2">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{calc.grossSalary.toLocaleString()} FCFA</div>
                          {calc.overtimeAmount > 0 && (
                            <div className="text-xs text-blue-600">+{calc.overtimeAmount.toLocaleString()} heures sup</div>
                          )}
                          {calc.absenceDeduction > 0 && (
                            <div className="text-xs text-red-600">-{calc.absenceDeduction.toLocaleString()} absences</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-sm">
                          <div className="text-red-600 font-medium">{calc.deductions.toLocaleString()} FCFA</div>
                          <div className="text-xs text-gray-500">
                            CNSS: {calc.cnssEmployee.toLocaleString()}
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500">
                              IRPP: {calc.irppAmount.toLocaleString()}
                            </span>
                            {calc.irppAmount > 0 && (
                              <button
                                onClick={() => setShowIRPPDetail(calc.grossSalary - calc.cnssEmployee)}
                                className="text-blue-500 hover:text-blue-700"
                                title="Voir détail IRPP"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-sm font-medium text-green-600">{calc.netSalary.toLocaleString()} FCFA</div>
                        <div className="text-xs text-gray-500">Coût total: {calc.costToCompany.toLocaleString()}</div>
                      </td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Terminé
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Modal détail IRPP */}
        {showIRPPDetail && (
          <IRPPBreakdown 
            taxableIncome={showIRPPDetail}
            onClose={() => setShowIRPPDetail(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PayrollCalculationEngine;