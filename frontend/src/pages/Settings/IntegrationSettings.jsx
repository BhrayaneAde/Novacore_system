import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import IntegrationCard from "./components/IntegrationCard";
import IntegrationForm from "./components/IntegrationForm";
import SyncLogs from "./components/SyncLogs";
import { ArrowLeft, Plug, Plus } from "lucide-react";
import { systemService } from "../../services/system";

const IntegrationSettings = () => {
  const navigate = useNavigate();
  const [integrations, setIntegrations] = useState([]);
  const [availableConfigs, setAvailableConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [integrationsRes, configsRes] = await Promise.all([
        systemService.integrations.getAll(),
        systemService.integrations.getConfigs()
      ]);
      setIntegrations(integrationsRes.data || []);
      setAvailableConfigs(configsRes.data || {});
    } catch (error) {
      console.error('Error loading integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async (integrationId) => {
    try {
      await systemService.integrations.test(integrationId);
      // Reload to get updated status
      setTimeout(loadData, 2000);
    } catch (error) {
      console.error('Error testing integration:', error);
    }
  };

  const handleSync = async (integrationId) => {
    try {
      await systemService.integrations.sync(integrationId);
      // Reload to get updated status
      setTimeout(loadData, 2000);
    } catch (error) {
      console.error('Error syncing integration:', error);
    }
  };

  const handleDelete = async (integrationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette intégration ?')) return;
    
    try {
      await systemService.integrations.delete(integrationId);
      loadData();
    } catch (error) {
      console.error('Error deleting integration:', error);
    }
  };

  const handleCreateIntegration = async (integrationData) => {
    try {
      await systemService.integrations.create(integrationData);
      setShowCreateForm(false);
      loadData();
    } catch (error) {
      console.error('Error creating integration:', error);
      throw error;
    }
  };

  const handleShowLogs = (integrationId) => {
    setSelectedIntegrationId(integrationId);
    setShowLogs(true);
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/app/settings")}>
            Retour
          </Button>
          <div className="flex items-center justify-between flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                <Plug className="w-5 h-5" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">Intégrations</h1>
            </div>
            <Button onClick={() => setShowCreateForm(true)} icon={Plus}>
              Nouvelle Intégration
            </Button>
          </div>
        </div>

        {/* Available Providers */}
        {integrations.length === 0 && (
          <Card>
            <div className="text-center py-8">
              <Plug className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune intégration configurée</h3>
              <p className="text-gray-600 mb-4">Connectez vos outils favoris pour automatiser vos workflows</p>
              <Button onClick={() => setShowCreateForm(true)} icon={Plus}>
                Ajouter une intégration
              </Button>
            </div>
          </Card>
        )}

        {/* Active Integrations */}
        {integrations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onTest={handleTest}
                onSync={handleSync}
                onDelete={handleDelete}
                onShowLogs={handleShowLogs}
              />
            ))}
          </div>
        )}

        {/* Create Integration Form */}
        {showCreateForm && (
          <IntegrationForm
            configs={availableConfigs}
            onSubmit={handleCreateIntegration}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {/* Sync Logs Modal */}
        <SyncLogs
          integrationId={selectedIntegrationId}
          isOpen={showLogs}
          onClose={() => setShowLogs(false)}
        />
      </div>
    </DashboardLayout>
  );
};

export default IntegrationSettings;
