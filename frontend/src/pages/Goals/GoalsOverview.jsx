import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { performanceService, employeesService } from "../../services";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import PermissionGuard from "../../components/auth/PermissionGuard";
import { Target, Plus, TrendingUp, Calendar, CheckCircle, AlertCircle } from "lucide-react";

const GoalsOverview = () => {
  const { currentUser, hasRole } = useAuthStore();
  const [activeTab, setActiveTab] = useState("my-goals");
  const [myGoals, setMyGoals] = useState([]);
  const [teamGoals, setTeamGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const myGoalsData = await performanceService.getMyGoals();
        setMyGoals(myGoalsData || []);
        
        if (hasRole('manager')) {
          const teamGoalsData = await performanceService.getTeamGoals();
          setTeamGoals(teamGoalsData || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des objectifs:', error);
        setMyGoals([]);
        setTeamGoals([]);
      } finally {
        setLoading(false);
      }
    };
    loadGoals();
  }, [hasRole]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Terminé</Badge>;
      case 'in_progress':
        return <Badge variant="warning">En cours</Badge>;
      case 'overdue':
        return <Badge variant="danger">En retard</Badge>;
      case 'pending':
        return <Badge variant="default">En attente</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge variant="danger" size="sm">Haute</Badge>;
      case 'medium':
        return <Badge variant="warning" size="sm">Moyenne</Badge>;
      case 'low':
        return <Badge variant="success" size="sm">Basse</Badge>;
      default:
        return <Badge variant="default" size="sm">{priority}</Badge>;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Objectifs & KPIs</h1>
            <p className="text-gray-600">Suivez vos objectifs et mesurez vos performances</p>
          </div>
          
          <div className="flex gap-2">
            <PermissionGuard permission="goals.manage">
              <Button variant="outline" icon={TrendingUp}>
                Rapports
              </Button>
            </PermissionGuard>
            <Button icon={Plus}>
              Nouvel objectif
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Objectifs actifs</p>
                <p className="text-2xl font-bold text-gray-900">{myGoals.filter(g => g.status === 'in_progress').length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Terminés</p>
                <p className="text-2xl font-bold text-gray-900">{myGoals.filter(g => g.status === 'completed').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En retard</p>
                <p className="text-2xl font-bold text-gray-900">
                  {myGoals.filter(g => {
                    const daysRemaining = calculateDaysRemaining(g.dueDate);
                    return daysRemaining < 0 && g.status !== 'completed';
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progression moy.</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(myGoals.reduce((acc, goal) => acc + goal.progress, 0) / myGoals.length || 0)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Onglets */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('my-goals')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'my-goals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mes objectifs ({myGoals.length})
            </button>
            
            <PermissionGuard role="manager">
              <button
                onClick={() => setActiveTab('team-goals')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'team-goals'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Objectifs d'équipe ({teamGoals.length})
              </button>
            </PermissionGuard>
          </nav>
        </div>

        {/* Liste des objectifs */}
        {loading ? (
          <div className="text-center py-8">
            <p>Chargement des objectifs...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(activeTab === 'my-goals' ? myGoals : teamGoals).map((goal) => {
            const daysRemaining = calculateDaysRemaining(goal.dueDate);
            const isOverdue = daysRemaining < 0 && goal.status !== 'completed';
            
            return (
              <Card key={goal.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                      {getPriorityBadge(goal.priority)}
                      {getStatusBadge(goal.status)}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{goal.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(goal.startDate).toLocaleDateString('fr-FR')} - {new Date(goal.dueDate).toLocaleDateString('fr-FR')}
                      </span>
                      <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                        {isOverdue ? `${Math.abs(daysRemaining)} jours de retard` : 
                         daysRemaining > 0 ? `${daysRemaining} jours restants` : 'Échéance atteinte'}
                      </span>
                    </div>

                    {/* Progression */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progression</span>
                        <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full transition-all ${getProgressColor(goal.progress)}`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* KPIs si disponibles */}
                    {goal.kpis && goal.kpis.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {goal.kpis.map((kpi, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-xs text-gray-600 mb-1">{kpi.name}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-gray-900">{kpi.current}</span>
                              <span className="text-sm text-gray-500">/ {kpi.target} {kpi.unit}</span>
                            </div>
                            <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
                              <div 
                                className="h-1 bg-blue-500 rounded-full"
                                style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-6">
                    <Button variant="outline" size="sm">
                      Voir détails
                    </Button>
                  </div>
                </div>
              </Card>
            );
            })}
          </div>
        )}

        {myGoals.length === 0 && activeTab === 'my-goals' && (
          <Card className="p-12 text-center">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun objectif défini</h3>
            <p className="text-gray-600 mb-6">Commencez par créer votre premier objectif pour suivre vos performances.</p>
            <Button icon={Plus}>
              Créer mon premier objectif
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GoalsOverview;