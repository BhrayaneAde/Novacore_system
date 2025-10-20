import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Calendar, User, Flag, MoreHorizontal, CheckCircle2, Clock, AlertTriangle, Circle } from 'lucide-react';

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Finaliser le rapport mensuel', description: 'Compiler les données financières et préparer le rapport pour la direction', priority: 'high', status: 'in-progress', dueDate: '2024-01-15', project: 'Comptabilité', assignee: 'Marie Dubois', progress: 75 },
    { id: 2, title: 'Préparer présentation client', description: 'Créer les slides pour la présentation du nouveau produit', priority: 'high', status: 'todo', dueDate: '2024-01-18', project: 'Commercial', assignee: 'Jean Martin', progress: 0 },
    { id: 3, title: 'Réviser contrat fournisseur', description: 'Analyser les termes du nouveau contrat avec le fournisseur principal', priority: 'medium', status: 'todo', dueDate: '2024-01-20', project: 'Achats', assignee: 'Sophie Laurent', progress: 25 },
    { id: 4, title: 'Formation sécurité terminée', description: 'Compléter le module de formation obligatoire sur la sécurité au travail', priority: 'low', status: 'completed', dueDate: '2024-01-10', project: 'Formation', assignee: 'Pierre Durand', progress: 100 },
    { id: 5, title: 'Audit qualité département', description: 'Effectuer l\'audit trimestriel des processus qualité', priority: 'medium', status: 'in-progress', dueDate: '2024-01-22', project: 'Qualité', assignee: 'Alice Bernard', progress: 60 },
    { id: 6, title: 'Mise à jour procédures RH', description: 'Réviser et mettre à jour les procédures de recrutement', priority: 'low', status: 'todo', dueDate: '2024-01-25', project: 'Ressources Humaines', assignee: 'Marc Petit', progress: 10 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // list, kanban

  const projects = [...new Set(tasks.map(task => task.project))];

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesProject = projectFilter === 'all' || task.project === projectFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesProject;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter, projectFilter]);

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high': return { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle, label: 'Urgent' };
      case 'medium': return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Flag, label: 'Normal' };
      case 'low': return { color: 'bg-green-100 text-green-800 border-green-200', icon: Circle, label: 'Faible' };
      default: return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Circle, label: 'Non défini' };
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed': return { color: 'text-green-600', icon: CheckCircle2, label: 'Terminée' };
      case 'in-progress': return { color: 'text-blue-600', icon: Clock, label: 'En cours' };
      case 'todo': return { color: 'text-gray-500', icon: Circle, label: 'À faire' };
      default: return { color: 'text-gray-400', icon: Circle, label: 'Non défini' };
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            status: task.status === 'completed' ? 'todo' : 'completed',
            progress: task.status === 'completed' ? 0 : 100
          }
        : task
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Tâches</h1>
              <p className="text-gray-600 mt-1">Gérez efficacement votre charge de travail</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-all">
              <Plus className="w-5 h-5" />
              Nouvelle tâche
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{tasks.length}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Flag className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">À faire</p>
                  <p className="text-3xl font-bold text-orange-600 mt-1">{tasks.filter(t => t.status === 'todo').length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Circle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En cours</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{tasks.filter(t => t.status === 'in-progress').length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terminées</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{tasks.filter(t => t.status === 'completed').length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une tâche..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="todo">À faire</option>
                  <option value="in-progress">En cours</option>
                  <option value="completed">Terminées</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
                >
                  <option value="all">Toutes priorités</option>
                  <option value="high">Urgent</option>
                  <option value="medium">Normal</option>
                  <option value="low">Faible</option>
                </select>
                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]"
                >
                  <option value="all">Tous les projets</option>
                  {projects.map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const priorityConfig = getPriorityConfig(task.priority);
            const statusConfig = getStatusConfig(task.status);
            const daysUntilDue = getDaysUntilDue(task.dueDate);
            const PriorityIcon = priorityConfig.icon;
            const StatusIcon = statusConfig.icon;

            return (
              <div key={task.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    <StatusIcon className={`w-6 h-6 ${statusConfig.color} hover:scale-110 transition-transform`} />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-1 ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{task.description}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <PriorityIcon className="w-4 h-4" />
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityConfig.color}`}>
                          {priorityConfig.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{task.assignee}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>
                        {daysUntilDue < 0 && (
                          <span className="text-red-600 font-medium">({Math.abs(daysUntilDue)} jours de retard)</span>
                        )}
                        {daysUntilDue >= 0 && daysUntilDue <= 3 && (
                          <span className="text-orange-600 font-medium">({daysUntilDue} jours restants)</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {task.project}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 min-w-[45px]">{task.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune tâche trouvée</h3>
            <p className="text-gray-600">Essayez de modifier vos filtres ou créez une nouvelle tâche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTasks;