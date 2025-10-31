import React, { useState } from 'react';
import { X, Mail, Settings, RefreshCw, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const EmailConfigModal = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [emailConfig, setEmailConfig] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(false);

  const steps = [
    { id: 1, title: 'Configuration Email', icon: Settings },
    { id: 2, title: 'Test & Validation', icon: Check },
    { id: 3, title: 'Synchronisation', icon: RefreshCw }
  ];

  const saveEmailConfig = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        email_address: emailConfig.email,
        password: emailConfig.password
      });
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/auto-recruitment/configure-email?${params}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.ok) {
        setConfigured(true);
        setCurrentStep(2);
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.detail}`);
      }
    } catch (error) {
      alert('Erreur lors de la configuration');
    } finally {
      setLoading(false);
    }
  };



  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Configuration Email Automatique
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Stepper */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-teal-50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-400 to-blue-500 border-blue-500 text-white' 
                      : isCompleted 
                      ? 'bg-gradient-to-r from-teal-600 to-teal-700 border-teal-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-teal-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-teal-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Configuration */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Mail className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Configuration de votre email</h3>
                <p className="text-gray-600">Configurez votre compte Gmail pour recevoir les candidatures automatiquement</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Gmail
                  </label>
                  <input
                    type="email"
                    value={emailConfig.email}
                    onChange={(e) => setEmailConfig(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="votre-email@gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe d'application
                  </label>
                  <input
                    type="password"
                    value={emailConfig.password}
                    onChange={(e) => setEmailConfig(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Mot de passe d'application Gmail"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Comment obtenir un mot de passe d'application ?</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Activez l'authentification à 2 facteurs sur votre compte Gmail</li>
                  <li>2. Allez dans les paramètres de sécurité Google</li>
                  <li>3. Générez un mot de passe d'application pour "Mail"</li>
                  <li>4. Utilisez ce mot de passe ici (pas votre mot de passe habituel)</li>
                </ol>
              </div>
            </div>
          )}

          {/* Step 2: Test & Validation */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Configuration validée</h3>
                <p className="text-gray-600">Votre email a été configuré avec succès</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">
                  ✅ Connexion Gmail établie avec succès<br/>
                  ✅ Configuration sauvegardée<br/>
                  ✅ Prêt pour la synchronisation
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Synchronisation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <RefreshCw className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Configuration terminée !</h3>
                <p className="text-gray-600">Votre email est maintenant connecté à NovaCore</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">✅ Configuration réussie</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Connexion Gmail établie</li>
                  <li>• Email de confirmation envoyé</li>
                  <li>• Prêt pour la recherche intelligente</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">🔍 Prochaine étape</h4>
                <p className="text-sm text-blue-800">
                  Utilisez le bouton "Recherche Intelligente" dans l'interface principale pour analyser vos emails et trouver automatiquement les candidatures.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Fermer
              </button>
              
              {currentStep === 1 && (
                <button
                  onClick={saveEmailConfig}
                  disabled={loading || !emailConfig.email || !emailConfig.password}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Configuration...' : 'Configurer'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              
              {currentStep === 2 && (
                <button
                  onClick={() => {
                    setCurrentStep(3);
                    onSuccess('Configuration email réussie ! Email de test envoyé.');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  Terminer
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfigModal;