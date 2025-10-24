import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, User, AlertCircle, CheckCircle, Play, Pause, CheckSquare } from 'lucide-react';
import { tasksService, employeesService, usersService } from '../../services';
import { useAuthStore } from '../../store/useAuthStore';

const TaskManagement = () => {
  const { currentUser: user } = useAuthStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: [],
    priority: 'normal',
    estimatedHours: '',
    dueDate: '',
    tags: ''
  });

  // Statuts et priorités des tâches
  const taskStatuses = {
    pending: { label: 'En attente', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    in_progress: { label: 'En cours', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    completed: { label: 'Terminée', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    cancelled: { label: 'Annulée', bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
  };

  const taskPriorities = {
    low: { label: 'Basse', icon: '🟢', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    normal: { label: 'Normale', icon: '🟡', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    high: { label: 'Haute', icon: '🟠', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
    urgent: { label: 'Urgente', icon: '🔴', bgColor: 'bg-red-100', textColor: 'text-red-800' }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksRes, employeesRes, usersRes] = await Promise.all([
        tasksService.getAll().catch(() => ({ data: [] })),
        employeesService.getAll().catch(() => ({ data: [] })),
        usersService.getAll().catch(() => ({ data: [] }))
      ]);
      
      setTasks(tasksRes.data || []);
      setEmployees(employeesRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les tâches selon le rôle
  const getFilteredTasks = () => {
    if (user?.role === 'manager') {
      // Manager voit les tâches de son département
      return tasks.filter(task => task.department_id === user.department_id);
    } else if (user?.role === 'employee') {
      // Employé voit ses propres tâches
      return tasks.filter(task => task.assigned_to === user.employee_id);
    }
    // Admin/Employer voient toutes les tâches
    return tasks;
  };

  const filteredTasks = getFilteredTasks();

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : 'Inconnu';
  };

  const getAssignerName = (userId) => {
    const assigner = users.find(u => u.id === userId);
    return assigner ? `${assigner.first_name} ${assigner.last_name}` : 'Inconnu';
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        assigned_to: formData.assignedTo[0], // Prendre le premier assigné
        priority: formData.priority,
        estimated_hours: parseFloat(formData.estimatedHours),
        due_date: formData.dueDate,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        status: 'pending'
      };
      
      const newTask = await tasksService.create(taskData);
      setTasks([...tasks, newTask]);
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        assignedTo: [],
        priority: 'normal',
        estimatedHours: '',
        dueDate: '',
        tags: ''
      });
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksService.update(taskId, { status: newStatus });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const canCreateTasks = user?.role === 'manager' || user?.role === 'employer' || user?.role === 'hr_admin';
  

  const canEditAllTasks = user?.role === 'manager' || user?.role === 'employer' || user?.role === 'hr_admin';

  const getTeamMembers = () => {
    if (user?.role === 'manager') {
      return employees.filter(emp => emp.department_id === user.department_id);
    }
    return employees;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Tâches</h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'employee' ? 'Mes tâches assignées' : 
             user?.role === 'manager' ? 'Tâches de mon équipe' : 
             'Toutes les tâches'}
          </p>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{filteredTasks.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredTasks.filter(t => t.status === 'in_progress').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Terminées</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredTasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En retard</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredTasks.filter(t => 
                  new Date(t.dueDate) < new Date() && t.status !== 'completed'
                ).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides pour managers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowCreateForm(true)}
            className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
          >
            <div className="text-center">
              <Plus className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:text-blue-600" />
              <h3 className="font-medium text-gray-900 mb-1">Nouvelle Tâche</h3>
              <p className="text-sm text-gray-600">Attribuer une tâche à un membre de l'équipe</p>
            </div>
          </button>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <CheckSquare className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Tâches Actives</h3>
              <p className="text-2xl font-bold text-green-600">{filteredTasks.filter(t => t.status === 'in_progress').length}</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <User className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Mon Équipe</h3>
              <p className="text-2xl font-bold text-blue-600">{getTeamMembers().length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Tâches</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredTasks.map((task) => {
            const status = taskStatuses[task.status];
            const priority = taskPriorities[task.priority];
            const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'completed';
            
            return (
              <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.bgColor} ${priority.textColor}`}>
                        {priority.icon} {priority.label}
                      </span>
                      {isOverdue && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          En retard
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {user?.role === 'employee' ? 'Assigné par' : 'Assigné à'}: {' '}
                          {user?.role === 'employee' 
                            ? getAssignerName(task.assigned_by)
                            : getEmployeeName(task.assigned_to)
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          Échéance: {new Date(task.due_date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {task.actual_hours || 0}h / {task.estimated_hours}h
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {task.tags.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {task.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col gap-2">
                    {(canEditAllTasks || (user?.role === 'employee' && task.assigned_to === user.employee_id)) && (
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Object.entries(taskStatuses).map(([key, status]) => (
                          <option key={key} value={key}>{status.label}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de création de tâche */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Attribution des Tâches</h1>
                <p className="text-gray-600 text-sm">Assignez une ou plusieurs tâches à vos agents</p>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-8">
                {/* Task Selection */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckSquare className="w-5 h-5 text-gray-900" />
                    <label className="text-sm font-semibold text-gray-900">Sélection de la Tâche</label>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Titre de la tâche</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                        placeholder="Nom de la tâche"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Priorité</label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({...formData, priority: e.target.value})}
                          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg appearance-none bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors cursor-pointer"
                        >
                          <option value="urgent">🔴 Urgente</option>
                          <option value="high">🟠 Haute</option>
                          <option value="normal">🟡 Moyenne</option>
                          <option value="low">🟢 Basse</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Date d'échéance</label>
                        <input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agent Selection */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-gray-900" />
                    <label className="text-sm font-semibold text-gray-900">Agents Assignés</label>
                  </div>

                  <div className="space-y-2 mb-4">
                    {getTeamMembers().map((employee) => (
                      <div
                        key={employee.id}
                        onClick={() => {
                          const isSelected = formData.assignedTo.includes(employee.id);
                          if (isSelected) {
                            setFormData({
                              ...formData,
                              assignedTo: formData.assignedTo.filter(id => id !== employee.id)
                            });
                          } else {
                            setFormData({
                              ...formData,
                              assignedTo: [...formData.assignedTo, employee.id]
                            });
                          }
                        }}
                        className={`flex items-center gap-3 p-3 border rounded-lg transition-colors cursor-pointer group ${
                          formData.assignedTo.includes(employee.id)
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="relative">
                          <div className={`w-3 h-3 rounded border-2 flex items-center justify-center ${
                            formData.assignedTo.includes(employee.id)
                              ? 'border-gray-900 bg-gray-900'
                              : 'border-gray-300 group-hover:border-gray-900'
                          }`}>
                            {formData.assignedTo.includes(employee.id) && (
                              <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <polyline points="20 6 9 17 4 12" strokeWidth="3" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {employee.first_name?.[0]}{employee.last_name?.[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{employee.first_name} {employee.last_name}</div>
                          <div className="text-xs text-gray-500">{employee.position}</div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span>3 tâches</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-600">
                      {formData.assignedTo.length} agent{formData.assignedTo.length > 1 ? 's' : ''} sélectionné{formData.assignedTo.length > 1 ? 's' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, assignedTo: []})}
                      className="text-xs font-medium text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      Tout désélectionner
                    </button>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-gray-900" />
                    <label className="text-sm font-semibold text-gray-900">Détails Supplémentaires</label>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Instructions spécifiques</label>
                      <textarea
                        rows="4"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors resize-none"
                        placeholder="Ajoutez des instructions ou des notes pour les agents assignés..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Estimation (heures)</label>
                        <input
                          type="number"
                          value={formData.estimatedHours}
                          onChange={(e) => setFormData({...formData, estimatedHours: e.target.value})}
                          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                          placeholder="8"
                          min="0.5"
                          step="0.5"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Tags</label>
                        <input
                          type="text"
                          value={formData.tags}
                          onChange={(e) => setFormData({...formData, tags: e.target.value})}
                          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                          placeholder="design, urgent, client"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 md:flex-none px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                  >
                    Assigner la tâche
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 md:flex-none px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                  >
                    Annuler
                  </button>
                </div>
              </form>

              {/* Summary Card */}
              <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white border border-gray-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-gray-900" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Résumé de l'attribution</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Les agents sélectionnés recevront une notification immédiate. Ils pourront consulter les détails de la tâche dans leur tableau de bord et commencer à travailler selon les instructions fournies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;