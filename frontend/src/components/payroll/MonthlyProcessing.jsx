import React, { useState, useEffect } from 'react';
import { Calendar, Upload, CheckCircle, AlertCircle, Users, Calculator, FileText, Download } from 'lucide-react';
import api from '../../services/api';

const MonthlyProcessing = ({ period, onComplete }) => {
  const [step, setStep] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [variableData, setVariableData] = useState({});
  const [attendanceData, setAttendanceData] = useState({});
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error('Erreur chargement employés:', error);
    }
  };

  const handleVariableDataChange = (employeeId, variable, value) => {
    setVariableData(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [variable]: parseFloat(value) || 0
      }
    }));
  };

  const handleAttendanceChange = (employeeId, field, value) => {
    setAttendanceData(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const calculatePayroll = async () => {
    setLoading(true);
    try {
      const payload = {
        period,
        employees: employees.map(emp => ({
          employee_id: emp.id,
          variable_data: variableData[emp.id] || {},
          attendance_data: attendanceData[emp.id] || {}
        }))
      };

      const response = await api.post('/payroll/calculate-batch', payload);
      setCalculations(response.data.calculations || []);
      setStep(3);
    } catch (error) {
      console.error('Erreur calcul paie:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateAndSave = async () => {
    setLoading(true);
    try {
      await api.post('/payroll/validate-batch', {
        period,
        calculations
      });
      onComplete();
    } catch (error) {
      console.error('Erreur validation:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Données variables - {period}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Employé</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Heures sup.</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Prime ponctuelle</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Avance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Autres retenues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map(employee => (
                <tr key={employee.id}>
                  <td className="py-3 px-4 font-medium text-gray-900">{employee.name}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      placeholder="0"
                      className="w-20 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleVariableDataChange(employee.id, 'overtime_hours', e.target.value)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-24 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleVariableDataChange(employee.id, 'bonus', e.target.value)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-24 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleVariableDataChange(employee.id, 'advance', e.target.value)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-24 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleVariableDataChange(employee.id, 'other_deductions', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Présences et absences
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Employé</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Jours travaillés</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Jours d'absence</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Congés payés</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map(employee => (
                <tr key={employee.id}>
                  <td className="py-3 px-4 font-medium text-gray-900">{employee.name}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min="0"
                      max="31"
                      defaultValue="22"
                      className="w-16 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleAttendanceChange(employee.id, 'worked_days', e.target.value)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-16 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleAttendanceChange(employee.id, 'absent_days', e.target.value)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-16 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleAttendanceChange(employee.id, 'paid_leave_days', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Suivant: Calculs
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Lancement des calculs
        </h3>
        <div className="text-center py-8">
          <Calculator className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-6">
            Prêt à calculer les salaires pour {employees.length} employé(s)
          </p>
          <button
            onClick={calculatePayroll}
            disabled={loading}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2 mx-auto"
          >
            <Calculator className="w-5 h-5" />
            <span>{loading ? 'Calcul en cours...' : 'Lancer les calculs'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Résultats des calculs
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Employé</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Salaire brut</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Cotisations</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">IRPP</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Net à payer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {calculations.map(calc => (
                <tr key={calc.employee_id}>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {employees.find(e => e.id === calc.employee_id)?.name}
                  </td>
                  <td className="py-3 px-4">{calc.gross_salary?.toLocaleString()} F</td>
                  <td className="py-3 px-4 text-red-600">-{calc.social_contributions?.toLocaleString()} F</td>
                  <td className="py-3 px-4 text-red-600">-{calc.tax_amount?.toLocaleString()} F</td>
                  <td className="py-3 px-4 font-bold text-green-600">{calc.net_salary?.toLocaleString()} F</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Calculé
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Validation requise</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Vérifiez les calculs avant la validation finale. Une fois validés, les salaires seront marqués comme traités.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Retour
        </button>
        <div className="flex space-x-3">
          <button className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
          <button
            onClick={validateAndSave}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{loading ? 'Validation...' : 'Valider et sauvegarder'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Traitement mensuel</h1>
        <p className="text-gray-600">Période: {period}</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { num: 1, title: 'Données variables', icon: Upload },
            { num: 2, title: 'Calculs', icon: Calculator },
            { num: 3, title: 'Validation', icon: CheckCircle }
          ].map(({ num, title, icon: Icon }) => (
            <div key={num} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`ml-2 font-medium ${
                step >= num ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {title}
              </span>
              {num < 3 && <div className="w-16 h-0.5 bg-gray-200 mx-4" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
};

export default MonthlyProcessing;