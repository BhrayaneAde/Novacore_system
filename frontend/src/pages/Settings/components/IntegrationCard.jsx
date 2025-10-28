import React from "react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { Activity, AlertCircle, FileText } from "lucide-react";

const IntegrationCard = ({ integration, onTest, onSync, onDelete, onShowLogs }) => {
  const getProviderInfo = (provider) => {
    const providers = {
      sage: { name: 'Sage', icon: '💼', description: 'Synchronisation comptable et paie' },
      google_calendar: { name: 'Google Calendar', icon: '📅', description: 'Gestion des événements RH' },
      outlook: { name: 'Microsoft Outlook', icon: '📧', description: 'Email et calendrier' },
      linkedin: { name: 'LinkedIn', icon: '💼', description: 'Recrutement et profils' }
    };
    return providers[provider] || { name: provider, icon: '🔗', description: 'Intégration tierce' };
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      inactive: 'default',
      error: 'danger',
      syncing: 'warning'
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Actif',
      inactive: 'Inactif',
      error: 'Erreur',
      syncing: 'Synchronisation'
    };
    return labels[status] || status;
  };

  const providerInfo = getProviderInfo(integration.provider);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{providerInfo.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
              <p className="text-sm text-gray-600">{providerInfo.description}</p>
              {integration.last_sync && (
                <p className="text-xs text-gray-500 mt-1">
                  Dernière sync: {new Date(integration.last_sync).toLocaleString('fr-FR')}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {integration.status === 'error' && (
              <AlertCircle className="w-4 h-4 text-red-500" title={integration.last_error} />
            )}
            {integration.status === 'syncing' && (
              <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Badge variant={getStatusColor(integration.status)}>
            {getStatusLabel(integration.status)}
          </Badge>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTest?.(integration.id)}
              disabled={integration.status === 'syncing'}
            >
              Tester
            </Button>
            {integration.is_active && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSync?.(integration.id)}
                disabled={integration.status === 'syncing'}
              >
                Sync
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowLogs?.(integration.id)}
            >
              <FileText className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(integration.id)}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationCard;
