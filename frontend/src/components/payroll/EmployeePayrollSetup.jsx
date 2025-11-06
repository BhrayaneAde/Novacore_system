import React, { useState, useEffect } from 'react';
import { Users, Save, ArrowLeft, DollarSign } from 'lucide-react';
import api from '../../services/api';

const EmployeePayrollSetup = ({ onBack }) => {
  const [employees, setEmployees] = useState([]);
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changes, setChanges] = useState({});

  useEffect(() => {
    loadEmployeesData();
  }, []);

  const loadEmployeesData = async () => {
    try {
      const response = await api.get('/employee-payroll/employees');
      setEmployees(response.data.employees);
      setVariables(response.data.variables);
    } catch (error) {
      console.error('Erreur chargement employés:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (employeeId, variableCode, value) => {
    setChanges(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [variableCode]: parseFloat(value) || 0
      }
    }));
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(changes).map(([employeeId, payrollData]) => ({
        employee_id: parseInt(employeeId),
        payroll_data: payrollData
      }));

      await api.post('/employee-payroll/bulk-update', updates);
      setChanges({});
      await loadEmployeesData();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  const getVariableValue = (employee, variableCode) => {
    if (changes[employee.id]?.[variableCode] !== undefined) {
      return changes[employee.id][variableCode];
    }
    return employee.payroll_variables[variableCode] || '';
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
                <h1 className="text-3xl font-bold mb-2">Paramétrage des Employés</h1>
                <p className="text-teal-100 text-lg">Configurez les données salariales individuelles</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{employees.length}</div>
                <div className="text-teal-100 text-sm">Employés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{variables.length}</div>
                <div className="text-teal-100 text-sm">Variables</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {Object.keys(changes).length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 mb-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-gray-700 font-medium">
                  {Object.keys(changes).length} employé(s) modifié(s)
                </span>
              </div>
              <button
                onClick={saveChanges}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 font-medium shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2 inline" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        )}

        {/* Table des employés */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-100 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-gradient-to-r from-slate-100 to-gray-100">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Employé</span>
                    </div>
                  </th>
                  {variables.map(variable => (
                    <th key={variable.code} className="px-4 py-4 text-center text-sm font-semibold text-gray-900 min-w-[150px]">
                      <div className="space-y-1">
                        <div className="font-medium">{variable.name}</div>
                        <div className="text-xs text-gray-500">{variable.code}</div>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          variable.type === 'FIXE' ? 'bg-teal-100 text-teal-800' :
                          variable.type === 'PRIME' ? 'bg-amber-100 text-amber-800' :
                          variable.type === 'INDEMNITE' ? 'bg-purple-100 text-purple-800' :
                          variable.type === 'RETENUE' ? 'bg-red-100 text-red-800' :
                          variable.type === 'COTISATION' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {variable.type}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((employee, index) => (
                  <tr key={employee.id} className={`hover:bg-blue-50/50 transition-colors ${
                    index % 2 === 0 ? 'bg-white/60' : 'bg-slate-50/60'
                  }`}>
                    <td className="px-6 py-4 sticky left-0 bg-inherit">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.role}</div>
                          <div className="text-xs text-gray-400">{employee.department}</div>
                        </div>
                      </div>
                    </td>
                    {variables.map(variable => (
                      <td key={variable.code} className="px-4 py-4 text-center">
                        <div className="relative">
                          <input
                            type="number"
                            value={getVariableValue(employee, variable.code)}
                            onChange={(e) => handleValueChange(employee.id, variable.code, e.target.value)}
                            className={`w-full px-3 py-2 text-center border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                              changes[employee.id]?.[variable.code] !== undefined 
                                ? 'border-amber-300 bg-amber-50' 
                                : 'border-gray-200'
                            }`}
                            placeholder={variable.calculation_method === 'fixed' ? '0' : '%'}
                          />
                          {variable.calculation_method === 'percentage' && (
                            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
                          )}
                          {variable.calculation_method === 'fixed' && (
                            <DollarSign className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
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

export default EmployeePayrollSetup;