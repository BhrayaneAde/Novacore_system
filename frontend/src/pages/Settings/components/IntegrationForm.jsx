import React, { useState } from 'react';
import Button from '../ui/Button';
import { X } from 'lucide-react';

const IntegrationForm = ({ configs, onSubmit, onCancel }) => {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const providers = {
    sage: {
      name: 'Sage',
      description: 'Synchronisation comptable et paie',
      icon: '💼',
      color: 'bg-green-50 border-green-200'
    },
    google_calendar: {
      name: 'Google Calendar',
      description: 'Gestion des événements RH',
      icon: '📅',
      color: 'bg-blue-50 border-blue-200'
    },
    outlook: {
      name: 'Microsoft Outlook',
      description: 'Email et calendrier',
      icon: '📧',
      color: 'bg-blue-50 border-blue-200'
    },
    linkedin: {
      name: 'LinkedIn',
      description: 'Recrutement et profils',
      icon: '💼',
      color: 'bg-blue-50 border-blue-200'
    }
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setFormData({});
  };

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const integrationData = {
        name: providers[selectedProvider].name,
        provider: selectedProvider,
        type: configs[selectedProvider]?.type || 'other',
        config: formData,
        is_active: true
      };

      await onSubmit(integrationData);
    } catch (error) {
      console.error('Error creating integration:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (fieldKey, fieldConfig) => {
    const { type, required, label } = fieldConfig;
    const value = formData[fieldKey] || '';

    const baseClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
      required ? 'border-gray-300' : 'border-gray-200'
    }`;

    switch (type) {
      case 'password':
        return (
          <input
            type="password"
            value={value}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            className={baseClasses}
            placeholder={label}
            required={required}
          />
        );
      case 'url':
        return (
          <input
            type="url"
            value={value}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            className={baseClasses}
            placeholder={label}
            required={required}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            className={baseClasses}
            placeholder={label}
            required={required}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Nouvelle Intégration</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!selectedProvider ? (
            <div>
              <h3 className="text-lg font-medium mb-4">Choisissez un service</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(providers).map(([key, provider]) => (
                  <div
                    key={key}
                    onClick={() => handleProviderSelect(key)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${provider.color}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{provider.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                        <p className="text-sm text-gray-600">{provider.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{providers[selectedProvider].icon}</span>
                <div>
                  <h3 className="text-lg font-semibold">{providers[selectedProvider].name}</h3>
                  <p className="text-sm text-gray-600">{providers[selectedProvider].description}</p>
                </div>
              </div>

              {configs[selectedProvider] && (
                <div className="space-y-4">
                  {Object.entries(configs[selectedProvider].fields).map(([fieldKey, fieldConfig]) => (
                    <div key={fieldKey}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {fieldConfig.label}
                        {fieldConfig.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderField(fieldKey, fieldConfig)}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedProvider('')}
                >
                  Retour
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                  >
                    Créer l'intégration
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationForm;