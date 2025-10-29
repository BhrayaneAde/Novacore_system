import React, { useState, useEffect } from 'react';
import { Target, Plus, Edit, Check, Clock, TrendingUp, Users, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { goalsService, employeesService } from '../../../services';
import GoalForm from '../../../components/forms/GoalForm';
import Loader from '../../../components/ui/Loader';

const GoalSettingPage = () => {
  const { currentUser, isManager, isSeniorManager, isEmployee } = useAuthStore();
  const [activeTab, setActiveTab] = useState(isManager() ? 'team-goals' : 'my-goals');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [employees, setEmployees] = useState([]);

  const [goals, setGoals] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [goalsResponse, empResponse] = await Promise.all([
        goalsService.getAll(),
        employeesService.getAll()
      ]);
      setGoals(goalsResponse.data || []);
      setEmployees(empResponse.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedGoal) {
        await goalsService.update(selectedGoal.id, formData);
      } else {
        await goalsService.create(formData);
      }
      await loadData();
      setShowForm(false);
      setSelectedGoal(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      try {
        await goalsService.delete(id);
        await loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const mockGoals = [
    {
      id: 1,
      title: 'Augmenter les ventes de 15%',
      description: 'Objectif trimestriel pour l\'équipe commerciale',
      assignedTo: 'Équipe Ventes',
      assignedBy: 'Pierre Moreau',
      category: 'Performance',
      priority: 'high',
      deadline: '2025-03-31',
      progress: 65,
      status: 'in_progress',
      type: 'team',
      metrics: [
        { name: 'CA réalisé', current: 130000, target: 200000, unit: '€' },
        { name: 'Nouveaux clients', current: 8, target: 12, unit: 'clients' }
      ]
    },
    {
      id: 2,
      title: 'Certification React Advanced',
      description: 'Obtenir la certification React pour améliorer les compétences',
      assignedTo: 'Lucas Martin',
      assignedBy: 'Thomas Dubois',
      category: 'Formation',
      priority: 'medium',
      deadline: '2025-04-15',
      progress: 30,
      status: 'in_progress',
      type: 'individual',
      metrics: [
        { name: 'Modules complétés', current: 3, target: 10, unit: 'modules' },
        { name: 'Projets pratiques', current: 1, target: 3, unit: 'projets' }
      ]
    },
    {
      id: 3,
      title: 'Réduire le temps de réponse client',
      description: 'Améliorer la satisfaction client en réduisant les délais',
      assignedTo: 'Service Client',
      assignedBy: 'Emma Rousseau',
      category: 'Qualité',
      priority: 'high',
      deadline: '2025-02-28',
      progress: 80,
      status: 'in_progress',
      type: 'team',
      metrics: [
        { name: 'Temps moyen', current: 4, target: 2, unit: 'heures' },
        { name: 'Satisfaction', current: 4.2, target: 4.5, unit: '/5' }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <Loader />
      </div>
    );
  }

  const displayGoals = goals.length > 0 ? goals : mockGoals;

  const updateProgress = (goalId, newProgress) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress: newProgress, status: newProgress === 100 ? 'completed' : 'in_progress' }
        : goal
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-secondary-100 text-blue-800';
      case 'not_started': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const myGoals = displayGoals.filter(goal => 
    isEmployee() ? goal.assignedTo === currentUser?.name : 
    (isManager() || isSeniorManager()) ? goal.assignedBy === currentUser?.name : true
  );

  const teamGoals = displayGoals.filter(goal => goal.type === 'team');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête avec guide */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Objectifs</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-secondary-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Objectifs SMART</h3>
              <p className="text-blue-700 text-sm mb-2">
                Créez et suivez des objectifs Spécifiques, Mesurables, Atteignables, Réalistes et Temporels.
              </p>
              <div className="text-blue-700 text-sm space-y-1">
                <p><strong>Managers:</strong> Créez des objectifs pour votre équipe, suivez les progrès et validez les résultats</p>
                <p><strong>Employés:</strong> Consultez vos objectifs assignés, mettez à jour votre progression et demandez de l'aide si nécessaire</p>
                <p><strong>Suivi:</strong> Les objectifs sont liés aux évaluations de performance et aux augmentations salariales</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="bg-gray-50 rounded-xl p-2 inline-flex">
          {[
            ...((isManager() || isSeniorManager()) ? [{ key: 'team-goals', label: 'Objectifs Équipe', icon: Users }] : []),
            { key: 'my-goals', label: isEmployee() ? 'Mes Objectifs' : 'Mes Objectifs', icon: Target },
            ...((isManager() || isSeniorManager()) ? [{ key: 'create', label: 'Créer', icon: Plus }] : [])
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-secondary-600" />
            <h3 className="font-semibold text-gray-900">Total</h3>
          </div>
          <p className="text-2xl font-bold text-secondary-600">{myGoals.length}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-primary-600" />
            <h3 className="font-semibold text-gray-900">En cours</h3>
          </div>
          <p className="text-2xl font-bold text-primary-600">
            {myGoals.filter(g => g.status === 'in_progress').length}
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Check className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-900">Complétés</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {myGoals.filter(g => g.status === 'completed').length}
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Progression</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {Math.round(myGoals.reduce((acc, g) => acc + g.progress, 0) / myGoals.length || 0)}%
          </p>
        </div>
      </div>

      {/* Goals List */}
      {(activeTab === 'my-goals' || activeTab === 'team-goals') && (
        <div className="space-y-6">
          {(activeTab === 'team-goals' ? teamGoals : myGoals).map(goal => (
            <div key={goal.id} className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{goal.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                      {goal.priority === 'high' ? 'Haute' : goal.priority === 'medium' ? 'Moyenne' : 'Basse'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                      {goal.status === 'completed' ? 'Terminé' : 
                       goal.status === 'in_progress' ? 'En cours' : 'Pas commencé'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{goal.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Assigné à: {goal.assignedTo}</span>
                    <span>Par: {goal.assignedBy}</span>
                    <span>Échéance: {goal.deadline}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-full">{goal.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-secondary-600 mb-1">{goal.progress}%</div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-secondary-600 h-2 rounded-full transition-all" 
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Metrics */}
              {goal.metrics.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {goal.metrics.map((metric, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-900">{metric.name}</h4>
                        <span className="text-sm text-gray-600">
                          {metric.current} / {metric.target} {metric.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                {(isEmployee() && goal.assignedTo === currentUser?.name) || isManager() ? (
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-sm font-medium text-gray-700">Progression:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={goal.progress}
                      onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-900 w-12">{goal.progress}%</span>
                  </div>
                ) : null}
                
                {(isManager() || isSeniorManager()) && (
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedGoal(goal);
                        setShowForm(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Goal Tab */}
      {activeTab === 'create' && (isManager() || isSeniorManager()) && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Créer un nouvel objectif</h2>
            <button
              onClick={() => {
                setSelectedGoal(null);
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvel objectif
            </button>
          </div>
          <p className="text-gray-600">Utilisez le bouton ci-dessus pour créer un nouvel objectif avec le formulaire complet.</p>
        </div>
      )}

      <GoalForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedGoal(null);
        }}
        onSave={handleSave}
        goal={selectedGoal}
        employees={employees}
      />
    </div>
  );
};

export default GoalSettingPage;