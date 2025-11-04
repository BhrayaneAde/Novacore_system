import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Calculator, Plus, Trash2, Edit } from 'lucide-react';
import VariableManager from '../VariableManager';

const VariablesStep = ({ data = {}, onChange, onValidate, companyType }) => {
  const [variables, setVariables] = useState(data.variables || []);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const stepData = { variables };
    onChange && onChange(stepData);
    
    // Validation: au moins une variable obligatoire doit être présente
    const hasRequiredVariables = variables.some(v => v.is_mandatory);
    setIsValid(hasRequiredVariables && variables.length > 0);
    onValidate && onValidate(hasRequiredVariables && variables.length > 0);
  }, [variables]);

  const handleVariablesChange = (updatedVariables) => {
    setVariables(updatedVariables);
  };

  const getVariableTypeColor = (type) => {
    switch (type) {
      case 'earning': return 'bg-green-100 text-green-800';
      case 'deduction': return 'bg-red-100 text-red-800';
      case 'tax': return 'bg-orange-100 text-orange-800';
      case 'contribution': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVariableTypeLabel = (type) => {
    switch (type) {
      case 'earning': return 'Gain';
      case 'deduction': return 'Retenue';
      case 'tax': return 'Impôt';
      case 'contribution': return 'Cotisation';
      default: return type;
    }
  };

  const mandatoryCount = variables.filter(v => v.is_mandatory).length;
  const optionalCount = variables.filter(v => !v.is_mandatory).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Variables de Paie
          </CardTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">
              {mandatoryCount} obligatoires
            </Badge>
            <Badge variant="secondary">
              {optionalCount} optionnelles
            </Badge>
            <Badge variant="default">
              Total: {variables.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Configuration pour: {companyType}</h4>
            <p className="text-sm text-blue-700">
              Les variables obligatoires sont pré-configurées selon votre type d'entreprise. 
              Vous pouvez ajouter des variables personnalisées selon vos besoins.
            </p>
          </div>

          <VariableManager
            variables={variables}
            onChange={handleVariablesChange}
            companyType={companyType}
          />

          {variables.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Aperçu des Variables</h4>
              <div className="grid gap-2">
                {variables.map((variable, index) => (
                  <div 
                    key={variable.id || index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={getVariableTypeColor(variable.type)}>
                        {getVariableTypeLabel(variable.type)}
                      </Badge>
                      <div>
                        <div className="font-medium">{variable.name}</div>
                        <div className="text-sm text-gray-500">
                          {variable.calculation_method === 'fixed' && `${variable.value} ${variable.currency || 'XOF'}`}
                          {variable.calculation_method === 'percentage' && `${variable.value}%`}
                          {variable.calculation_method === 'formula' && 'Formule personnalisée'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {variable.is_mandatory && (
                        <Badge variant="outline" className="text-xs">
                          Obligatoire
                        </Badge>
                      )}
                      {variable.is_taxable && (
                        <Badge variant="secondary" className="text-xs">
                          Imposable
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isValid && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Vous devez configurer au moins une variable obligatoire pour continuer.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VariablesStep;