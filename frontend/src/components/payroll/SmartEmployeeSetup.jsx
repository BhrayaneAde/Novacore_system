import React, { useState, useEffect } from 'react';
import { Users, Calculator, ArrowLeft, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { calculerSalaireComplet, formaterMontant, validerSalaireNet } from '../../services/payrollCalculationEngine';
import api from '../../services/api';

const SmartEmployeeSetup = ({ onBack }) => {
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
      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error('Erreur chargement employés:', error);
      // Fallback vers l'API employés standard
      try {
        const fallbackResponse = await api.get('/employees');
        const employeesData = fallbackResponse.data || [];
        // Transformer les données pour correspondre au format attendu
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

  const handleNetSalaireChange = (employeeId, netSouhaite, profil = 'default') => {
    if (!netSouhaite || netSouhaite <= 0) {
      setCalculations(prev => {
        const newCalc = { ...prev };
        delete newCalc[employeeId];
        return newCalc;
      });
      return;
    }

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
      const updates = Object.entries(calculations).map(([employeeId, calc]) => ({
        employee_id: parseInt(employeeId),
        payroll_data: {
          SB: calc.variables.salaireBase,
          PT: calc.variables.primeTransport,
          PF: calc.variables.primeFonction,
          CNSS: calc.variables.cnssEmploye,
          IRPP: calc.variables.irpp
        }
      }));

      await api.post('/employee-payroll/bulk-update', updates);
      alert('Configuration sauvegardée avec succès !');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
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
                <h1 className="text-3xl font-bold mb-2">Configuration Intelligente</h1>
                <p className="text-teal-100 text-lg">Saisissez le salaire net souhaité, le système calcule tout automatiquement</p>
              </div>
            </div>
            <div className="text-center">
              <Calculator className="w-12 h-12 mx-auto mb-2" />
              <div className="text-sm text-teal-100">Calcul automatique</div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 mb-8 shadow-xl">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-teal-600 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Comment ça fonctionne</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span className="text-gray-700">Saisissez le salaire net souhaité</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span className="text-gray-700">Le système calcule automatiquement</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span className="text-gray-700">Toutes les variables sont configurées</span>
                </div>
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
                <Calculator className="w-5 h-5 mr-2 inline" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder la configuration'}
              </button>
            </div>
          </div>
        )}

        {/* Liste des employés */}
        <div className="space-y-6">
          {employees.map((employee) => {
            const calc = calculations[employee.id];
            return (
              <div key={employee.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{employee.name}</h3>
                        <p className="text-gray-600">{employee.role || 'Employé'} • {employee.department || 'Non assigné'}</p>
                        {employee.salary && (
                          <p className="text-sm text-blue-600 font-medium">Salaire actuel: {formaterMontant(employee.salary)}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Salaire net souhaité (F CFA)
                        </label>
                        <input
                          type="number"
                          placeholder="Ex: 500000"
                          className="w-48 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right font-semibold"
                          onChange={(e) => handleNetSalaireChange(employee.id, parseFloat(e.target.value), employee.role?.toLowerCase())}
                        />
                      </div>
                    </div>
                  </div>

                  {calc && (
                    <div className="border-t border-gray-200 pt-6">
                      {!calc.validation.isValid && (
                        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                            <div>
                              {calc.validation.errors.map((error, index) => (
                                <p key={index} className="text-yellow-800 text-sm">{error}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-blue-600">{formaterMontant(calc.netAPayer)}</div>
                          <div className="text-sm text-blue-700 font-medium">Net à payer</div>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                          <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-green-600">{formaterMontant(calc.salaireBrut)}</div>
                          <div className="text-sm text-green-700 font-medium">Salaire brut</div>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                          <Calculator className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-purple-600">{formaterMontant(calc.coutTotal)}</div>
                          <div className="text-sm text-purple-700 font-medium">Coût total</div>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
                          <div className="text-2xl font-bold text-amber-600">{calc.details.tauxGlobal}%</div>
                          <div className="text-sm text-amber-700 font-medium">Charges totales</div>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-medium text-gray-900 mb-3">Détail des variables configurées automatiquement :</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div>Salaire de base : <span className="font-semibold">{formaterMontant(calc.variables.salaireBase)}</span></div>
                          <div>Prime transport : <span className="font-semibold">{formaterMontant(calc.variables.primeTransport)}</span></div>
                          <div>Prime fonction : <span className="font-semibold">{formaterMontant(calc.variables.primeFonction)}</span></div>
                          <div>CNSS employé : <span className="font-semibold">{formaterMontant(calc.variables.cnssEmploye)}</span></div>
                          <div>CNSS employeur : <span className="font-semibold">{formaterMontant(calc.variables.cnssEmployeur)}</span></div>
                          <div>IRPP : <span className="font-semibold">{formaterMontant(calc.variables.irpp)}</span></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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

export default SmartEmployeeSetup;