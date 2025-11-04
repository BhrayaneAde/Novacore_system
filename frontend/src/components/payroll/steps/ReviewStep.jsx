import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import { CheckCircle, Building, Calculator, Users, Settings, Save } from 'lucide-react';

const ReviewStep = ({ data = {}, onFinalize, isLoading = false }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleFinalize = () => {
    if (onFinalize) {
      onFinalize(data);
    }
  };

  const companyInfo = data.companyInfo || {};
  const variables = data.variables?.variables || [];
  const selectedEmployees = data.employees?.selectedEmployees || [];

  const mandatoryVariables = variables.filter(v => v.is_mandatory);
  const optionalVariables = variables.filter(v => !v.is_mandatory);
  const totalBaseSalary = selectedEmployees.reduce((sum, emp) => sum + emp.baseSalary, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Révision Finale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informations Entreprise */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Building className="w-4 h-4" />
              Informations Entreprise
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Nom:</span>
                  <span className="font-medium ml-2">{companyInfo.companyName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium ml-2">{companyInfo.companyType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium ml-2">{companyInfo.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">Période:</span>
                  <span className="font-medium ml-2">
                    {companyInfo.payrollPeriod === 'monthly' ? 'Mensuelle' : companyInfo.payrollPeriod}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Variables de Paie */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Calculator className="w-4 h-4" />
              Variables de Paie
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex gap-4 mb-3">
                <Badge variant="default">
                  {variables.length} variables total
                </Badge>
                <Badge variant="outline">
                  {mandatoryVariables.length} obligatoires
                </Badge>
                <Badge variant="secondary">
                  {optionalVariables.length} optionnelles
                </Badge>
              </div>
              
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {variables.map((variable, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          variable.type === 'earning' ? 'border-green-500 text-green-700' :
                          variable.type === 'deduction' ? 'border-red-500 text-red-700' :
                          'border-blue-500 text-blue-700'
                        }`}
                      >
                        {variable.type === 'earning' ? 'Gain' : 
                         variable.type === 'deduction' ? 'Retenue' : 'Autre'}
                      </Badge>
                      <span>{variable.name}</span>
                      {variable.is_mandatory && (
                        <Badge variant="outline" className="text-xs">Obligatoire</Badge>
                      )}
                    </div>
                    <span className="text-gray-600">
                      {variable.calculation_method === 'fixed' && `${variable.value} XOF`}
                      {variable.calculation_method === 'percentage' && `${variable.value}%`}
                      {variable.calculation_method === 'formula' && 'Formule'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Employés */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Users className="w-4 h-4" />
              Employés Sélectionnés
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex gap-4 mb-3">
                <Badge variant="default">
                  {selectedEmployees.length} employés
                </Badge>
                <Badge variant="outline">
                  Total: {totalBaseSalary.toLocaleString()} XOF
                </Badge>
              </div>
              
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {selectedEmployees.map((employee) => (
                  <div key={employee.id} className="flex justify-between text-sm">
                    <span>{employee.name} - {employee.position}</span>
                    <span className="text-gray-600">
                      {employee.baseSalary.toLocaleString()} XOF
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Confirmation */}
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-3">
                <p>
                  Vous êtes sur le point de finaliser la configuration de paie pour votre entreprise. 
                  Cette configuration sera sauvegardée et utilisée pour les calculs de paie.
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="confirm"
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="confirm" className="text-sm">
                    Je confirme que toutes les informations sont correctes et je souhaite 
                    activer cette configuration de paie.
                  </label>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleFinalize}
              disabled={!isConfirmed || isLoading}
              size="lg"
              className="px-8"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Finalisation...' : 'Finaliser la Configuration'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;