import React, { useState, useEffect } from 'react';
import { Calculator, Save, RefreshCw } from 'lucide-react';
import { usePayrollConfig } from '../../hooks/usePayrollConfig';
import { usePayrollCalculation } from '../../hooks/usePayrollCalculation';
import { VARIABLE_TYPE_LABELS, VARIABLE_TYPE_COLORS } from '../../data/payrollConstants';

const PayrollCalculator = ({ employeeId, period, onCalculationComplete }) => {
  const { variables, loadVariables } = usePayrollConfig();
  const { calculationResult, loading, error, calculate, saveCalculation } = usePayrollCalculation();
  const [variableValues, setVariableValues] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    loadVariables();
  }, []);

  useEffect(() => {
    // Initialiser les valeurs par défaut
    const defaultValues = {};
    variables.forEach(variable => {
      if (variable.is_active) {
        defaultValues[variable.code] = variable.fixed_amount || 0;
      }
    });
    setVariableValues(defaultValues);
  }, [variables]);

  const handleVariableChange = (code, value) => {
    setVariableValues(prev => ({
      ...prev,
      [code]: parseFloat(value) || 0
    }));
    setValidationErrors([]);
  };

  const validateInputs = () => {
    const errors = [];
    const mandatoryVariables = variables.filter(v => v.is_mandatory && v.is_active);
    
    mandatoryVariables.forEach(variable => {
      if (!variableValues[variable.code] || variableValues[variable.code] <= 0) {
        errors.push(`${variable.name} est obligatoire et doit être supérieur à 0`);
      }
    });

    Object.entries(variableValues).forEach(([code, value]) => {
      if (value < 0) {
        const variable = variables.find(v => v.code === code);
        errors.push(`${variable?.name || code} ne peut pas être négatif`);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleCalculate = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const result = await calculate(employeeId, period, variableValues);
      if (onCalculationComplete) {
        onCalculationComplete(result);
      }
    } catch (error) {
      console.error('Erreur de calcul:', error);
    }
  };

  const handleSave = async () => {
    if (calculationResult) {
      try {
        await saveCalculation(calculationResult);
        alert('Calcul sauvegardé avec succès');
      } catch (error) {
        console.error('Erreur de sauvegarde:', error);
      }
    }
  };

  const activeVariables = variables.filter(v => v.is_active);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Calculator className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Calculateur de paie</h3>
            <p className="text-gray-600">Période: {period}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded">
            <h4 className="font-medium text-red-800 mb-2">Erreurs de validation:</h4>
            <ul className="list-disc list-inside text-red-700 text-sm">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Saisie des variables */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Variables de paie</h4>
            <div className="space-y-4">
              {activeVariables.map((variable) => (
                <div key={variable.code} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      {variable.name}
                      {variable.is_mandatory && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      VARIABLE_TYPE_COLORS[variable.variable_type] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {VARIABLE_TYPE_LABELS[variable.variable_type]}
                    </span>
                  </div>
                  
                  {variable.calculation_method === 'fixed' ? (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={variableValues[variable.code] || ''}
                      onChange={(e) => handleVariableChange(variable.code, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Montant en XOF"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                      {variable.calculation_method === 'percentage' && `${variable.percentage_rate}% du salaire de base`}
                      {variable.calculation_method === 'formula' && 'Calculé automatiquement'}
                      {variable.calculation_method === 'progressive' && 'Barème progressif'}
                    </div>
                  )}
                  
                  {variable.description && (
                    <p className="text-xs text-gray-500">{variable.description}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleCalculate}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Calculator className="w-4 h-4" />
                )}
                <span>{loading ? 'Calcul...' : 'Calculer'}</span>
              </button>
              
              {calculationResult && (
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
              )}
            </div>
          </div>

          {/* Résultats du calcul */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Résultats du calcul</h4>
            
            {calculationResult ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Salaire brut:</span>
                      <p className="font-medium text-gray-900">
                        {calculationResult.gross_salary?.toLocaleString()} XOF
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total primes:</span>
                      <p className="font-medium text-green-600">
                        +{calculationResult.total_allowances?.toLocaleString()} XOF
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total retenues:</span>
                      <p className="font-medium text-red-600">
                        -{calculationResult.total_deductions?.toLocaleString()} XOF
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Cotisations:</span>
                      <p className="font-medium text-orange-600">
                        -{calculationResult.social_contributions?.toLocaleString()} XOF
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Impôts:</span>
                      <p className="font-medium text-red-600">
                        -{calculationResult.tax_amount?.toLocaleString()} XOF
                      </p>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Net à payer:</span>
                      <p className="text-xl font-bold text-blue-600">
                        {calculationResult.net_salary?.toLocaleString()} XOF
                      </p>
                    </div>
                  </div>
                </div>

                {/* Détail par variable */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Détail par variable</h5>
                  <div className="space-y-2 text-sm">
                    {Object.entries(calculationResult.salary_breakdown || {}).map(([code, details]) => (
                      <div key={code} className="flex justify-between items-center">
                        <span className="text-gray-600">{details.name}:</span>
                        <span className={`font-medium ${
                          details.type === 'prime' || details.type === 'indemnite' ? 'text-green-600' :
                          details.type === 'retenue' || details.type === 'cotisation' || details.type === 'impot' ? 'text-red-600' :
                          'text-gray-900'
                        }`}>
                          {details.type === 'prime' || details.type === 'indemnite' ? '+' : 
                           details.type === 'retenue' || details.type === 'cotisation' || details.type === 'impot' ? '-' : ''}
                          {details.value?.toLocaleString()} XOF
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Saisissez les valeurs et cliquez sur "Calculer"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollCalculator;