import React, { useState, useEffect } from "react";
import { CheckSquare, Clock, Calendar, AlertCircle, CheckCircle, User, MessageSquare } from "lucide-react";
import Loader from '../../../components/ui/Loader';
import { systemService } from "../../../services";

// Service de compatibilité
const tasksService = {
  getMyTasks: () => systemService.tasks?.getAll() || Promise.resolve({ data: [] }),
  update: (id, data) => systemService.tasks?.update(id, data) || Promise.resolve()
};
import { useAuthStore } from "../../../store/useAuthStore";

const EmployeeTasksPage = () => {
  const { currentUser } = useAuthStore();
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskUpdate, setTaskUpdate] = useState({});
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyTasks();
  }, [currentUser]);

  const loadMyTasks = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const response = await tasksService.getMyTasks();
      setTasks(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les tâches de l'employé connecté
  const myTasks = tasks.filter(task => task.assigned_to === currentUser?.employee_id);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in_progress': return 'text-secondary-600 bg-blue-50';
      case 'pending': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in_progress': return 'En cours';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  };

  const handleStatusUpdate = (taskId, newStatus) => {
    setTaskUpdate(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], status: newStatus }
    }));
  };

  const handleHoursUpdate = (taskId, hours) => {
    setTaskUpdate(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], actualHours: hours }
    }));
  };

  const submitTaskUpdate = async (taskId) => {
    try {
      const updates = taskUpdate[taskId];
      if (!updates) return;
      
      await tasksService.update(taskId, {
        status: updates.status,
        actual_hours: updates.actualHours
      });
      
      // Mettre à jour la tâche localement
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: updates.status, actual_hours: updates.actualHours }
          : task
      ));
      
      // Réinitialiser les mises à jour
      setTaskUpdate(prev => {
        const newUpdate = { ...prev };
        delete newUpdate[taskId];
        return newUpdate;
      });
      
      alert('Mise à jour envoyée au manager pour validation');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de la tâche');
    }
  };

  const completedTasks = myTasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = myTasks.filter(task => task.status === 'in_progress').length;
  const pendingTasks = myTasks.filter(task => task.status === 'pending').length;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader size={24} />
        <span className="ml-2 text-gray-600">Chargement de vos tâches...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête avec guide */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes Tâches</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-secondary-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Comment ça fonctionne</h3>
              <p className="text-blue-700 text-sm">
                Ici vous voyez toutes les tâches qui vous sont assignées par votre manager. 
                Vous pouvez suivre votre progression, mettre à jour le statut et les heures travaillées. 
                Quand vous marquez une tâche comme terminée, votre manager doit la valider.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{myTasks.length}</p>
            </div>
            <CheckSquare className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{pendingTasks}</p>
            </div>
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">En cours</p>
              <p className="text-2xl font-bold text-blue-900">{inProgressTasks}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Terminées</p>
              <p className="text-2xl font-bold text-green-900">{completedTasks}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mes tâches assignées</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {myTasks.length === 0 ? (
            <div className="p-8 text-center">
              <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune tâche assignée pour le moment</p>
            </div>
          ) : (
            myTasks.map((task) => (
              <div key={task.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Échéance: {new Date(task.due_date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Estimé: {task.estimated_hours}h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Réalisé: {task.actual_hours || 0}h</span>
                      </div>
                    </div>

                    {task.tags && (
                      <div className="flex gap-2 mt-2">
                        {task.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions de mise à jour */}
                {task.status !== 'completed' && (
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Mettre à jour ma progression</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Statut
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          value={taskUpdate[task.id]?.status || task.status}
                          onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                        >
                          <option value="pending">En attente</option>
                          <option value="in_progress">En cours</option>
                          <option value="completed">Terminé</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Heures travaillées
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          value={taskUpdate[task.id]?.actualHours || task.actual_hours || 0}
                          onChange={(e) => handleHoursUpdate(task.id, parseFloat(e.target.value))}
                          min="0"
                          step="0.5"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          onClick={() => submitTaskUpdate(task.id)}
                          className="w-full px-4 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 text-sm font-medium"
                        >
                          Mettre à jour
                        </button>
                      </div>
                    </div>
                    
                    {taskUpdate[task.id]?.status === 'completed' && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-primary-600" />
                          <p className="text-sm text-yellow-800">
                            Quand vous marquez une tâche comme terminée, votre manager recevra une notification pour la valider.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Validation manager */}
                {task.status === 'completed' && (
                  <div className={`mt-4 p-4 rounded-lg ${task.validated_by_manager ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium text-sm">
                        {task.validated_by_manager ? 'Validé par le manager' : 'En attente de validation'}
                      </span>
                    </div>
                    {task.manager_comments && (
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                        <p className="text-sm text-gray-700">{task.manager_comments}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeTasksPage;