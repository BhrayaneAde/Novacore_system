import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { hrService } from "../../services";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import PermissionGuard from "../../components/auth/PermissionGuard";
import { UserPlus, CheckCircle, Clock, AlertTriangle, Users, Calendar, Settings } from "lucide-react";

const OnboardingDashboard = () => {
  const { currentUser, currentCompany } = useAuthStore();
  const [activeTab, setActiveTab] = useState("active");
  const [activeWorkflows, setActiveWorkflows] = useState([]);
  const [workflowTemplates, setWorkflowTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [workflows, templates] = await Promise.all([
          hrService.workflows.getActive(),
          hrService.workflows.getTemplates()
        ]);
        setActiveWorkflows(workflows || []);
        setWorkflowTemplates(templates || []);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        setActiveWorkflows([]);
        setWorkflowTemplates([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Terminé</Badge>;
      case 'in_progress':
        return <Badge variant="warning">En cours</Badge>;
      case 'overdue':
        return <Badge variant="danger">En retard</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Workflows d'Onboarding</h1>
            <p className="text-gray-600">Gérez l'intégration de vos nouveaux employés</p>
          </div>
          
          <div className="flex gap-2">
            <PermissionGuard permission="workflows.manage">
              <Button variant="outline" icon={Settings}>
                Templates
              </Button>
            </PermissionGuard>
            <Button icon={UserPlus}>
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
                <p className="text-2xl font-bold text-gray-900">{activeWorkflows.filter(w => w.status === 'in_progress').length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Terminés ce mois</p>
                <p className="text-2xl font-bold text-gray-900">{activeWorkflows.filter(w => w.status === 'completed').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tâches en retard</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de réussite</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Onglets */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'active', label: 'Workflows actifs', count: activeWorkflows.filter(w => w.status === 'in_progress').length },
              { id: 'completed', label: 'Terminés', count: activeWorkflows.filter(w => w.status === 'completed').length },
              { id: 'templates', label: 'Templates', count: workflowTemplates.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'active' && (
          loading ? (
            <div className="text-center py-8">
              <p>Chargement des workflows...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeWorkflows.filter(w => w.status === 'in_progress').map((workflow) => (
              <Card key={workflow.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{workflow.employeeName}</h3>
                      <p className="text-gray-600">{workflow.position}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Début: {new Date(workflow.startDate).toLocaleDateString('fr-FR')}
                        </span>
                        <span>{workflow.tasksCompleted}/{workflow.totalTasks} tâches</span>
                        {workflow.daysRemaining > 0 && (
                          <span className="text-orange-600">{workflow.daysRemaining} jours restants</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">Progression</div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(workflow.progress)}`}
                            style={{ width: `${workflow.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{workflow.progress}%</span>
                      </div>
                    </div>
                    {getStatusBadge(workflow.status)}
                    <Button variant="outline" size="sm">
                      Voir détails
                    </Button>
                  </div>
                </div>
              </Card>
              ))}
            </div>
          )
        )}

        {activeTab === 'templates' && (
          loading ? (
            <div className="text-center py-8">
              <p>Chargement des templates...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflowTemplates.map((template) => (
              <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge variant="info">{template.type}</Badge>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-gray-600 mb-4">Département: {template.department}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tâches:</span>
                    <span className="font-medium">{template.tasks.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Durée estimée:</span>
                    <span className="font-medium">7-10 jours</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button variant="outline" size="sm" className="w-full">
                    Utiliser ce template
                  </Button>
                </div>
              </Card>
              ))}
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
};

export default OnboardingDashboard;