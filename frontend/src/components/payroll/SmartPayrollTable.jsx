import React, { useState, useEffect } from 'react';
import { Users, Save, Calculator, ArrowLeft, AlertCircle } from 'lucide-react';
import { calculerSalaireComplet, formaterMontant, validerSalaireNet } from '../../services/payrollCalculationEngine';
import api from '../../services/api';

const SmartPayrollTable = ({ onBack, onEmployeeSelect }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculations, setCalculations] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await api.get('/employee-payroll/employees');
      const employeesData = response.data.employees || [];
      
      // Récupérer les calculs existants depuis les enregistrements de paie
      const currentPeriod = new Date().toISOString().slice(0, 7);
      const payrollResponse = await api.get(`/payroll/records/?period=${currentPeriod}`);
      const existingRecords = payrollResponse.data.records || [];
      
      // Pré-remplir les calculs existants
      const existingCalculations = {};
      existingRecords.forEach(record => {
        if (record.salary_breakdown) {
          existingCalculations[record.employee_id] = {
            netSouhaite: record.net_salary,
            salaireBrut: record.gross_salary,
            coutTotal: record.salary_breakdown.cout_total || record.gross_salary * 1.185,
            netAPayer: record.net_salary,
            variables: {
              salaireBase: record.salary_breakdown.salaire_base || record.gross_salary,
              primeTransport: record.salary_breakdown.prime_transport || 0,
              primeFonction: record.salary_breakdown.prime_fonction || 0,
              cnssEmploye: record.salary_breakdown.cnss_employe || 0,
              cnssEmployeur: record.salary_breakdown.cnss_employeur || 0,
              irpp: record.salary_breakdown.irpp || 0
            },
            validation: { isValid: true }
          };
        }
      });
      
      setEmployees(employeesData);
      setCalculations(existingCalculations);
    } catch (error) {
      console.error('Erreur chargement employés:', error);
      // Fallback vers l'API employés standard
      try {
        const fallbackResponse = await api.get('/employees');
        const employeesData = fallbackResponse.data || [];
        const formattedEmployees = employeesData.map(emp => ({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          role: emp.role,
          department: emp.department?.name || 'Non assigné',
          salary: emp.salary,
          payroll_variables: {}
        }));
        setEmployees(formattedEmployees);
      } catch (fallbackError) {
        console.error('Erreur fallback:', fallbackError);
        setEmployees([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNetSalaireChange = (employeeId, netSouhaite) => {
    if (!netSouhaite || netSouhaite <= 0) {
      setCalculations(prev => {
        const newCalc = { ...prev };
        delete newCalc[employeeId];
        return newCalc;
      });
      return;
    }

    const employee = employees.find(emp => emp.id === employeeId);
    const profil = employee?.role?.toLowerCase() || 'default';
    const validation = validerSalaireNet(netSouhaite);
    const calcul = calculerSalaireComplet(netSouhaite, profil);

    setCalculations(prev => ({
      ...prev,
      [employeeId]: {
        ...calcul,
        validation,
        netSouhaite: netSouhaite,
        profil: profil
      }
    }));
  };

  const saveAllCalculations = async () => {
    setSaving(true);
    try {
      // 1. Sauvegarder les variables de paie individuelles
      const variableUpdates = Object.entries(calculations).map(([employeeId, calc]) => ({
        employee_id: parseInt(employeeId),
        payroll_data: {
          SB: calc.variables.salaireBase,
          PT: calc.variables.primeTransport,
          PF: calc.variables.primeFonction,
          CNSS: calc.variables.cnssEmploye,
          IRPP: calc.variables.irpp
        }
      }));

      await api.post('/employee-payroll/bulk-update', variableUpdates);

      // 2. Créer les enregistrements de paie pour les autres onglets
      const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM
      const payrollRecords = Object.entries(calculations).map(([employeeId, calc]) => {
        const employee = employees.find(emp => emp.id === parseInt(employeeId));
        return {
          employee_id: parseInt(employeeId),
          period: currentPeriod,
          gross_salary: calc.salaireBrut,
          total_allowances: calc.variables.primeTransport + calc.variables.primeFonction,
          total_deductions: calc.variables.cnssEmploye + calc.variables.irpp,
          taxable_income: calc.salaireBrut,
          tax_amount: calc.variables.irpp,
          social_contributions: calc.variables.cnssEmploye,
          net_salary: calc.netAPayer,
          salary_breakdown: {
            salaire_base: calc.variables.salaireBase,
            prime_transport: calc.variables.primeTransport,
            prime_fonction: calc.variables.primeFonction,
            cnss_employe: calc.variables.cnssEmploye,
            cnss_employeur: calc.variables.cnssEmployeur,
            irpp: calc.variables.irpp,
            cout_total: calc.coutTotal
          },
          status: 'draft'
        };
      });

      // Sauvegarder les enregistrements de paie
      await api.post('/payroll/records/bulk-create', payrollRecords);
      
      alert('Configuration sauvegardée avec succès ! Les données sont maintenant disponibles dans tous les onglets.');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde: ' + (error.response?.data?.detail || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent absolute top-0 left-0"></div>
          </div>
          <p className="text-teal-700 font-medium">Chargement des employés...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold mb-2">Configuration Rapide des Salaires</h1>
                <p className="text-teal-100 text-lg">Tableau de saisie des salaires nets - Calcul automatique</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{employees.length}</div>
                <div className="text-teal-100 text-sm">Employés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{Object.keys(calculations).length}</div>
                <div className="text-teal-100 text-sm">Configurés</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {Object.keys(calculations).length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 mb-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-gray-700 font-medium">
                  {Object.keys(calculations).length} employé(s) configuré(s)
                </span>
              </div>
              <button
                onClick={saveAllCalculations}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 font-medium shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2 inline" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder tout'}
              </button>
            </div>
          </div>
        )}

        {/* Tableau des employés */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-100 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Employé</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                    Net souhaité (F CFA)
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                    Salaire brut
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                    <div className="space-y-1">
                      <div>Coût total</div>
                      <div className="text-xs text-gray-500">(Brut + charges patronales)</div>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                    CNSS employé
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                    IRPP
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((employee, index) => {
                  const calc = calculations[employee.id];
                  return (
                    <tr key={employee.id} className={`hover:bg-blue-50/50 transition-colors ${
                      index % 2 === 0 ? 'bg-white/60' : 'bg-slate-50/60'
                    }`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {employee.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.role || 'Employé'}</div>
                            <div className="text-xs text-gray-400">{employee.department || 'Non assigné'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input
                          type="number"
                          placeholder="500000"
                          value={calc?.netSouhaite || ''}
                          className="w-32 px-3 py-2 text-center border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          onChange={(e) => handleNetSalaireChange(employee.id, parseFloat(e.target.value))}
                        />
                      </td>
                      <td className="px-4 py-4 text-center">
                        {calc ? (
                          <span className="font-semibold text-green-600">
                            {calc.salaireBrut.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {calc ? (
                          <span className="font-semibold text-purple-600">
                            {calc.coutTotal.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {calc ? (
                          <span className="text-orange-600">
                            {calc.variables.cnssEmploye.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {calc ? (
                          <span className="text-red-600">
                            {calc.variables.irpp.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {calc ? (
                            calc.validation.isValid ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ✓ Configuré
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Attention
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              En attente
                            </span>
                          )}
                          {onEmployeeSelect && (
                            <button
                              onClick={() => onEmployeeSelect(employee)}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            >
                              Avancé
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {employees.length === 0 && (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
            <div className="p-4 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun employé trouvé</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Ajoutez des employés dans la section RH pour pouvoir configurer leur paie
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartPayrollTable;