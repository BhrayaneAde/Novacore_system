import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Calendar, Clock, User, AlertCircle, CheckCircle, BarChart3, MessageSquare } from 'lucide-react';
import { tasksService } from '../../services';
import { useAuthStore } from '../../store/useAuthStore';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import TaskAnalytics from './components/TaskAnalytics';
import TaskDetail from './components/TaskDetail';

const TaskManagement = () => {
  const { currentUser } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [view, setView] = useState('list'); // list, board, analytics
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    assigned_to: '',
    overdue: false,
    search: ''
  });



  useEffect(() => {
    loadTasks();
    loadAnalytics();
  }, [filters]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksService.getAll(filters);
      setTasks(response.data || []);
    } catch (error) {
      console.error('Erreur chargement tâches:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await tasksService.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Erreur analytics:', error);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await tasksService.create(taskData);
      setTasks([response.data, ...tasks]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Erreur création tâche:', error);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await tasksService.update(taskId, updates);
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data : task
      ));
    } catch (error) {
      console.error('Erreur mise à jour tâche:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;
    
    try {
      await tasksService.delete(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Erreur suppression tâche:', error);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const canCreateTasks = ['hr_admin', 'employer', 'manager'].includes(currentUser?.role);

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Tâches</h1>
          <p className="text-gray-600 mt-1">
            Organisez et suivez les tâches de votre équipe
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                view === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setView('board')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                view === 'board' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tableau
            </button>
            <button
              onClick={() => setView('analytics')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                view === 'analytics' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
          </div>

          {canCreateTasks && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvelle tâche
            </button>
          )}
        </div>
      </div>

      {/* Analytics View */}
      {view === 'analytics' && analytics && (
        <TaskAnalytics analytics={analytics} />
      )}

      {/* Task Management Views */}
      {view !== 'analytics' && (
        <>
          {/* Filters */}
          <TaskFilters 
            filters={filters} 
            onFiltersChange={setFilters}
            tasksCount={tasks.length}
          />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En cours</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {getTasksByStatus('in_progress').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Terminées</p>
                  <p className="text-2xl font-bold text-green-600">
                    {getTasksByStatus('completed').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En retard</p>
                  <p className="text-2xl font-bold text-red-600">
                    {tasks.filter(t => t.is_overdue).length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>



          {/* Tasks Display */}
          {view === 'list' ? (
            <div className="space-y-4">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                  onSelect={setSelectedTask}
                />
              ))}
              
              {tasks.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune tâche trouvée
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {Object.values(filters).some(f => f) 
                      ? 'Essayez de modifier vos filtres'
                      : 'Commencez par créer votre première tâche'
                    }
                  </p>
                  {canCreateTasks && (
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Créer une tâche
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Board View
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {['pending', 'in_progress', 'completed', 'cancelled'].map(status => {
                const statusTasks = getTasksByStatus(status);
                const statusLabels = {
                  pending: 'À faire',
                  in_progress: 'En cours',
                  completed: 'Terminé',
                  cancelled: 'Annulé'
                };
                const statusColors = {
                  pending: 'bg-yellow-100 text-yellow-800',
                  in_progress: 'bg-blue-100 text-blue-800',
                  completed: 'bg-green-100 text-green-800',
                  cancelled: 'bg-gray-100 text-gray-800'
                };

                return (
                  <div key={status} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">
                        {statusLabels[status]}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                        {statusTasks.length}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {statusTasks.map(task => (
                        <div
                          key={task.id}
                          className="bg-white rounded-lg p-3 border border-gray-200 cursor-pointer hover:shadow-sm transition-shadow"
                          onClick={() => setSelectedTask(task)}
                        >
                          <h4 className="font-medium text-gray-900 mb-1">
                            {task.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {task.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{task.assigned_user?.name || 'Non assigné'}</span>
                            {task.due_date && (
                              <span className={task.is_overdue ? 'text-red-600' : ''}>
                                {new Date(task.due_date).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Create Task Modal */}
      {showCreateForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onUpdate={handleUpdateTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default TaskManagement;