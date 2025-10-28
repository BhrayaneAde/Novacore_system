import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useToast } from '../../components/ui/Toast';
import { systemService } from '../../services';
import { Plus, Users, CheckCircle, Clock, AlertTriangle, Settings, Eye, Play } from 'lucide-react';

const OnboardingDashboard = () => {
  const { success, error, ToastContainer } = useToast();
  const [workflows, setWorkflows] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('active');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Simuler les appels API (à remplacer par les vrais endpoints)
      const [workflowsData, templatesData, analyticsData] = await Promise.all([
        fetchWorkflows(selectedTab),
        fetchTemplates(),
        fetchAnalytics()
      ]);
      
      setWorkflows(workflowsData);
      setTemplates(templatesData);
      setAnalytics(analyticsData);
    } catch (err) {
      error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Fonctions API connectées au backend
  const fetchWorkflows = async (status) => {
    try {
      const response = await systemService.workflows.getProgress();
      return response.data || [];
    } catch (err) {
      console.error('Erreur API workflows:', err);
      // Fallback vers données mockées
      return [
        {
          workflow_id: 1,
          employee_name: 'Marie Dubois',
          template_name: 'Onboarding Développeur',
          status: 'active',
          completion_percentage: 65,
          tasks_completed: 13,
          tasks_total: 20,
          days_remaining: 12,
          overdue_tasks: 1
        },
        {
          workflow_id: 2,
          employee_name: 'Pierre Martin',
          template_name: 'Onboarding Commercial',
          status: 'active',
          completion_percentage: 30,
          tasks_completed: 6,
          tasks_total: 20,
          days_remaining: 18,
          overdue_tasks: 0
        }
      ];
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await systemService.workflows.getTemplates();
      return response.data || [];
    } catch (err) {
      console.error('Erreur API templates:', err);
      // Fallback vers données mockées
      return [
        { id: 1, name: 'Onboarding Développeur', department: 'IT', duration_days: 30 },
        { id: 2, name: 'Onboarding Commercial', department: 'Ventes', duration_days: 21 },
        { id: 3, name: 'Onboarding RH', department: 'RH', duration_days: 14 }
      ];
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await systemService.workflows.getAnalytics();
      return response.data || {};
    } catch (err) {
      console.error('Erreur API analytics:', err);
      // Fallback vers données mockées
      return {
        total_workflows: 25,
        active_workflows: 12,
        completed_workflows: 8,
        overdue_workflows: 2,
        completion_rate: 85,
        avg_completion_days: 28.5
      };
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'info',
      completed: 'success',
      cancelled: 'danger',
      draft: 'warning'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleCreateWorkflow = () => {
    setShowCreateModal(true);
  };
  
  const handleViewWorkflow = (workflowId) => {
    // Navigation vers la page de détails du workflow
    console.log('Voir workflow:', workflowId);
    success('Fonctionnalité en développement');
  };
  
  const handleManageWorkflow = (workflowId) => {
    // Navigation vers la page de gestion du workflow
    console.log('Gérer workflow:', workflowId);
    success('Fonctionnalité en développement');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Workflows d'Onboarding</h1>
            <p className="text-gray-600">Gérez les processus d'intégration de vos nouveaux employés</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" icon={Settings}>
              Templates
            </Button>
            <Button icon={Plus} onClick={handleCreateWorkflow}>
              Nouveau workflow
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Workflows actifs</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics?.active_workflows || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Terminés</p>
                <p className="text-2xl font-bold text-green-600">
                  {analytics?.completed_workflows || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de réussite</p>
                <p className="text-2xl font-bold text-purple-600">
                  {analytics?.completion_rate || 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En retard</p>
                <p className="text-2xl font-bold text-red-600">
                  {analytics?.overdue_workflows || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Onglets */}
        <Card>
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'active', label: 'Actifs', count: analytics?.active_workflows },
                { id: 'completed', label: 'Terminés', count: analytics?.completed_workflows },
                { id: 'all', label: 'Tous', count: analytics?.total_workflows }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Liste des workflows */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <LoadingSpinner size="lg" text="Chargement des workflows..." />
              </div>
            ) : workflows.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun workflow trouvé</p>
                <Button onClick={handleCreateWorkflow} className="mt-4">
                  Créer le premier workflow
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <div key={workflow.workflow_id || workflow.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {workflow.employee_name}
                          </h3>
                          {getStatusBadge(workflow.status)}
                          {workflow.overdue_tasks > 0 && (
                            <Badge variant="danger">
                              {workflow.overdue_tasks} en retard
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{workflow.template_name}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span>{workflow.tasks_completed}/{workflow.tasks_total} tâches</span>
                          <span>{workflow.days_remaining} jours restants</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {Math.round(workflow.completion_percentage)}%
                          </div>
                          <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                getProgressColor(workflow.completion_percentage)
                              }`}
                              style={{ width: `${workflow.completion_percentage}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            icon={Eye}
                            onClick={() => handleViewWorkflow(workflow.workflow_id || workflow.id)}
                          >
                            Détails
                          </Button>
                          {workflow.status === 'active' && (
                            <Button 
                              size="sm" 
                              icon={Play}
                              onClick={() => handleManageWorkflow(workflow.workflow_id || workflow.id)}
                            >
                              Gérer
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Modal de création (placeholder) */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Nouveau Workflow</h3>
              <p className="text-gray-600 mb-4">Fonctionnalité en cours de développement...</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setShowCreateModal(false)}>
                  Créer
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <ToastContainer />
      </div>
    </DashboardLayout>
  );
};

export default OnboardingDashboard;