import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Zap } from 'lucide-react';

const QuickSetupWizard = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [companyTypes, setCompanyTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedVariables, setSelectedVariables] = useState([]);

  useEffect(() => {
    loadQuickSetupOptions();
  }, []);

  const loadQuickSetupOptions = async () => {
    try {
      const response = await fetch('/api/v1/payroll-config/quick-setup');
      const data = await response.json();
      setCompanyTypes(data.company_types || []);
    } catch (error) {
      console.error('Erreur chargement options:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/v1/payroll-config/variables/templates');
      const data = await response.json();
      setTemplates(data.templates || []);
      
      // Sélectionner les variables obligatoires par défaut
      const mandatory = data.templates.filter(t => t.is_mandatory).map(t => t.code);
      setSelectedVariables(mandatory);
    } catch (error) {
      console.error('Erreur chargement templates:', error);
    }
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setStep(2);
    loadTemplates();
  };

  const handleVariableToggle = (code, isMandatory) => {
    if (isMandatory) return;
    
    setSelectedVariables(prev => 
      prev.includes(code) 
        ? prev.filter(v => v !== code)
        : [...prev, code]
    );
  };

  const handleQuickSetup = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/payroll-config/quick-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          company_type: selectedType
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Créer les variables sélectionnées
        if (selectedVariables.length > 0) {
          await fetch('/api/v1/payroll-config/variables/from-template', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              selected_variables: selectedVariables
            })
          });
        }

        onComplete(result);
      }
    } catch (error) {
      console.error('Erreur configuration rapide:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Zap className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Configuration Rapide</h2>
          </div>
          
          {/* Progress bar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm">Type d'entreprise</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm">Variables</span>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Choisissez votre type d'entreprise</h3>
            <div className="space-y-3">
              {companyTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => handleTypeSelect(type.value)}
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{type.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Sélectionnez vos variables de paie</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {templates.map(template => (
                <div key={template.code} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {template.code}
                      </span>
                      {template.is_mandatory && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Obligatoire
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    {template.fixed_amount && (
                      <p className="text-xs text-green-600 mt-1">Montant: {template.fixed_amount} XOF</p>
                    )}
                    {template.percentage_rate && (
                      <p className="text-xs text-green-600 mt-1">Taux: {template.percentage_rate}%</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleVariableToggle(template.code, template.is_mandatory)}
                    disabled={template.is_mandatory}
                    className="ml-4"
                  >
                    {selectedVariables.includes(template.code) ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6 pt-4 border-t">
          <div>
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Annuler
            </button>
            
            {step === 2 && (
              <button
                onClick={handleQuickSetup}
                disabled={loading || selectedVariables.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                Configurer ({selectedVariables.length} variables)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSetupWizard;