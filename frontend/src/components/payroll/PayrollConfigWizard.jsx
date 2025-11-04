import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import PayrollConfigStepper from './PayrollConfigStepper';
import CompanyInfoStep from './steps/CompanyInfoStep';
import VariablesStep from './steps/VariablesStep';
import EmployeesStep from './steps/EmployeesStep';
import ValidationStep from './steps/ValidationStep';
import ReviewStep from './steps/ReviewStep';
import { usePayrollConfig } from '../../hooks/usePayrollConfig';

const PayrollConfigWizard = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepValidation, setStepValidation] = useState({});
  const [configData, setConfigData] = useState({
    companyInfo: {},
    variables: {},
    employees: {},
    validation: {}
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { saveConfiguration } = usePayrollConfig();

  const steps = [
    {
      id: 'company-info',
      title: 'Informations Entreprise',
      description: 'Type d\'entreprise et paramètres généraux',
      component: CompanyInfoStep
    },
    {
      id: 'variables',
      title: 'Variables de Paie',
      description: 'Configuration des éléments de calcul',
      component: VariablesStep
    },
    {
      id: 'employees',
      title: 'Données Employés',
      description: 'Association employés et variables',
      component: EmployeesStep
    },
    {
      id: 'validation',
      title: 'Validation',
      description: 'Vérification et test des calculs',
      component: ValidationStep
    },
    {
      id: 'review',
      title: 'Finalisation',
      description: 'Révision finale et activation',
      component: ReviewStep
    }
  ];

  const handleStepChange = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const handleStepDataChange = (stepId, data) => {
    setConfigData(prev => ({
      ...prev,
      [stepId]: data
    }));
  };

  const handleStepValidation = (stepId, isValid) => {
    setStepValidation(prev => ({
      ...prev,
      [stepId]: isValid
    }));
  };

  const handleFinalize = async (finalData) => {
    setIsLoading(true);
    try {
      await saveConfiguration(finalData);
      setIsCompleted(true);
      
      // Attendre 2 secondes puis appeler onComplete
      setTimeout(() => {
        onComplete && onComplete(finalData);
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la finalisation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = stepValidation[steps[currentStep]?.id] !== false;
  const CurrentStepComponent = steps[currentStep]?.component;

  if (isCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-green-700">
              Configuration Terminée !
            </h2>
            <p className="text-gray-600">
              Votre système de paie a été configuré avec succès. 
              Vous pouvez maintenant commencer à traiter les paies.
            </p>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                La configuration a été sauvegardée et est maintenant active pour votre entreprise.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton retour */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        <div className="text-sm text-gray-500">
          Configuration de la Paie
        </div>
      </div>

      {/* Stepper */}
      <PayrollConfigStepper
        currentStep={currentStep}
        onStepChange={handleStepChange}
        canProceed={canProceed}
        isCompleted={isCompleted}
      />

      {/* Contenu de l'étape courante */}
      <Card>
        <CardContent className="pt-6">
          {CurrentStepComponent && (
            <CurrentStepComponent
              data={configData[steps[currentStep].id]}
              onChange={(data) => handleStepDataChange(steps[currentStep].id, data)}
              onValidate={(isValid) => handleStepValidation(steps[currentStep].id, isValid)}
              companyType={configData.companyInfo?.companyType}
              onFinalize={currentStep === steps.length - 1 ? handleFinalize : undefined}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollConfigWizard;