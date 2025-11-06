import React from 'react';
import { CheckCircle, Clock, ArrowRight, Settings, Calculator, FileText, BookOpen } from 'lucide-react';

const PayrollWorkflowGuide = ({ setActiveTab, stats }) => {
  const workflowSteps = [
    {
      id: 'variables',
      title: 'Variables de Paie',
      description: 'Configurer les variables',
      icon: Settings,
      status: stats.variablesCount > 0 ? 'completed' : 'pending',
      action: () => setActiveTab('variables')
    },
    {
      id: 'calculation',
      title: 'Calcul de Paie',
      description: 'Lancer les calculs',
      icon: Calculator,
      status: stats.lastCalculation ? 'completed' : 'pending',
      action: () => setActiveTab('calculation')
    },
    {
      id: 'payslips',
      title: 'Bulletins de Paie',
      description: 'Générer les bulletins',
      icon: FileText,
      status: 'pending', // À déterminer selon les données
      action: () => setActiveTab('payslips')
    },
    {
      id: 'accounting',
      title: 'Comptabilité',
      description: 'Écritures comptables',
      icon: BookOpen,
      status: 'pending',
      action: () => setActiveTab('accounting')
    }
  ];

  const getStepStatus = (step, index) => {
    if (step.status === 'completed') return 'completed';
    if (index === 0 || workflowSteps[index - 1].status === 'completed') return 'available';
    return 'locked';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow de Paie</h3>
      <div className="flex items-center justify-between">
        {workflowSteps.map((step, index) => {
          const status = getStepStatus(step, index);
          const IconComponent = step.icon;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <button
                  onClick={status !== 'locked' ? step.action : undefined}
                  disabled={status === 'locked'}
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-200 ${
                    status === 'completed' 
                      ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                      : status === 'available'
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {status === 'completed' ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : status === 'available' ? (
                    <IconComponent className="w-8 h-8" />
                  ) : (
                    <Clock className="w-8 h-8" />
                  )}
                </button>
                <div className="text-center">
                  <p className={`text-sm font-medium ${
                    status === 'locked' ? 'text-gray-400' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </p>
                  <p className={`text-xs ${
                    status === 'locked' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
              
              {index < workflowSteps.length - 1 && (
                <ArrowRight className="w-6 h-6 text-gray-300 mx-4" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default PayrollWorkflowGuide;