import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import { CheckCircle, AlertTriangle, Calculator, Play } from 'lucide-react';

const ValidationStep = ({ data = {}, onChange, onValidate }) => {
  const [validationResults, setValidationResults] = useState([]);
  const [testCalculation, setTestCalculation] = useState(null);
  const [isRunningTest, setIsRunningTest] = useState(false);

  useEffect(() => {
    runValidation();
  }, [data]);

  const runValidation = () => {
    const results = [];
    
    // Validation des informations entreprise
    if (!data.companyInfo?.companyName) {
      results.push({
        type: 'error',
        category: 'Entreprise',
        message: 'Nom de l\'entreprise manquant'
      });
    }
    
    if (!data.companyInfo?.companyType) {
      results.push({
        type: 'error',
        category: 'Entreprise',
        message: 'Type d\'entreprise non sélectionné'
      });
    }

    // Validation des variables
    const variables = data.variables?.variables || [];
    if (variables.length === 0) {
      results.push({
        type: 'error',
        category: 'Variables',
        message: 'Aucune variable de paie configurée'
      });
    }

    const mandatoryVariables = variables.filter(v => v.is_mandatory);
    if (mandatoryVariables.length === 0) {
      results.push({
        type: 'warning',
        category: 'Variables',
        message: 'Aucune variable obligatoire définie'
      });
    }

    // Validation des employés
    const employees = data.employees?.selectedEmployees || [];
    if (employees.length === 0) {
      results.push({
        type: 'warning',
        category: 'Employés',
        message: 'Aucun employé sélectionné pour le calcul'
      });
    }

    // Vérifications de cohérence
    const earningVars = variables.filter(v => v.type === 'earning');
    const deductionVars = variables.filter(v => v.type === 'deduction');
    
    if (earningVars.length === 0) {
      results.push({
        type: 'warning',
        category: 'Variables',
        message: 'Aucune variable de gain configurée'
      });
    }

    if (deductionVars.length === 0) {
      results.push({
        type: 'info',
        category: 'Variables',
        message: 'Aucune retenue configurée'
      });
    }

    setValidationResults(results);
    
    const hasErrors = results.some(r => r.type === 'error');
    onValidate && onValidate(!hasErrors);
    
    return results;
  };

  const runTestCalculation = async () => {
    setIsRunningTest(true);
    
    try {
      // Simulation d'un calcul de test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult = {
        employee: 'Employé Test',
        grossSalary: 500000,
        deductions: 75000,
        taxes: 45000,
        netSalary: 380000,
        variables: [
          { name: 'Salaire de base', value: 400000, type: 'earning' },
          { name: 'Prime transport', value: 50000, type: 'earning' },
          { name: 'Prime ancienneté', value: 50000, type: 'earning' },
          { name: 'CNSS (4%)', value: -20000, type: 'contribution' },
          { name: 'Impôt sur salaire', value: -45000, type: 'tax' },
          { name: 'Avance', value: -10000, type: 'deduction' }
        ]
      };
      
      setTestCalculation(mockResult);
    } catch (error) {
      console.error('Erreur lors du test:', error);
    } finally {
      setIsRunningTest(false);
    }
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getResultColor = (type) => {
    switch (type) {
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-green-200 bg-green-50';
    }
  };

  const errorCount = validationResults.filter(r => r.type === 'error').length;
  const warningCount = validationResults.filter(r => r.type === 'warning').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Validation de la Configuration
          </CardTitle>
          <div className="flex gap-2 mt-2">
            {errorCount > 0 && (
              <Badge variant="destructive">
                {errorCount} erreur{errorCount > 1 ? 's' : ''}
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                {warningCount} avertissement{warningCount > 1 ? 's' : ''}
              </Badge>
            )}
            {errorCount === 0 && warningCount === 0 && (
              <Badge variant="default" className="bg-green-500">
                Configuration valide
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {validationResults.length > 0 ? (
            <div className="space-y-2">
              {validationResults.map((result, index) => (
                <div 
                  key={index}
                  className={`p-3 border rounded-lg ${getResultColor(result.type)}`}
                >
                  <div className="flex items-center gap-2">
                    {getResultIcon(result.type)}
                    <Badge variant="outline" className="text-xs">
                      {result.category}
                    </Badge>
                    <span className="text-sm">{result.message}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Toutes les vérifications sont passées avec succès !
              </AlertDescription>
            </Alert>
          )}

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Test de Calcul</h4>
              <Button 
                onClick={runTestCalculation}
                disabled={isRunningTest || errorCount > 0}
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunningTest ? 'Test en cours...' : 'Lancer un test'}
              </Button>
            </div>

            {testCalculation && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <h5 className="font-medium mb-3">Résultat du Test</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Salaire brut:</span>
                      <span className="font-medium ml-2">
                        {testCalculation.grossSalary.toLocaleString()} XOF
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Salaire net:</span>
                      <span className="font-medium ml-2 text-green-600">
                        {testCalculation.netSalary.toLocaleString()} XOF
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <h6 className="text-xs font-medium text-gray-600 mb-2">Détail des variables:</h6>
                    <div className="space-y-1">
                      {testCalculation.variables.map((variable, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span>{variable.name}</span>
                          <span className={variable.value < 0 ? 'text-red-600' : 'text-green-600'}>
                            {variable.value.toLocaleString()} XOF
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidationStep;