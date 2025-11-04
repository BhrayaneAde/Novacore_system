import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChevronRight, ChevronLeft, Check, Settings, Users, Calculator, FileText, Eye } from 'lucide-react';

const PayrollConfigStepper = ({ 
  currentStep = 0, 
  onStepChange, 
  steps = [],
  canProceed = true,
  isCompleted = false 
}) => {
  const defaultSteps = [
    {
      id: 'company-info',
      title: 'Informations Entreprise',
      description: 'Type d\'entreprise et paramètres généraux',
      icon: Settings,
      status: 'completed'
    },
    {
      id: 'variables',
      title: 'Variables de Paie',
      description: 'Configuration des éléments de calcul',
      icon: Calculator,
      status: 'current'
    },
    {
      id: 'employees',
      title: 'Données Employés',
      description: 'Association employés et variables',
      icon: Users,
      status: 'pending'
    },
    {
      id: 'validation',
      title: 'Validation',
      description: 'Vérification et test des calculs',
      icon: FileText,
      status: 'pending'
    },
    {
      id: 'review',
      title: 'Finalisation',
      description: 'Révision finale et activation',
      icon: Eye,
      status: 'pending'
    }
  ];

  const activeSteps = steps.length > 0 ? steps : defaultSteps;

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'current': return 'bg-blue-500 text-white';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  const getStatusIcon = (status, IconComponent, index) => {
    if (status === 'completed') {
      return <Check className="w-5 h-5" />;
    }
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuration de la Paie
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          {activeSteps.map((step, index) => {
            const status = getStepStatus(index);
            const IconComponent = step.icon;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div 
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center 
                      ${getStatusColor(status)} 
                      cursor-pointer transition-all duration-200 hover:scale-105
                      ${status === 'current' ? 'ring-2 ring-blue-300' : ''}
                    `}
                    onClick={() => onStepChange && onStepChange(index)}
                  >
                    {getStatusIcon(status, IconComponent, index)}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-medium ${
                      status === 'current' ? 'text-blue-600' : 
                      status === 'completed' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-400 max-w-24">
                      {step.description}
                    </div>
                  </div>
                </div>
                
                {index < activeSteps.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-4 
                    ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant={isCompleted ? 'default' : 'secondary'}>
              Étape {currentStep + 1} sur {activeSteps.length}
            </Badge>
            {isCompleted && (
              <Badge variant="default" className="bg-green-500">
                <Check className="w-3 h-3 mr-1" />
                Terminé
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStepChange && onStepChange(currentStep - 1)}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Précédent
            </Button>
            
            <Button
              size="sm"
              onClick={() => onStepChange && onStepChange(currentStep + 1)}
              disabled={!canProceed || currentStep >= activeSteps.length - 1}
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollConfigStepper;