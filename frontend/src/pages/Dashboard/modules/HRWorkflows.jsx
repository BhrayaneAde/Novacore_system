import React from 'react';
import { Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const HRWorkflows = () => {
  const integrationTasks = [
    { id: 1, title: 'Préparer le poste de travail', assignee: 'IT', status: 'completed', dueDate: '2025-01-15' },
    { id: 2, title: 'Créer les accès système', assignee: 'IT', status: 'in_progress', dueDate: '2025-01-16' },
    { id: 3, title: 'Présentation équipe', assignee: 'Manager', status: 'pending', dueDate: '2025-01-17' },
    { id: 4, title: 'Formation sécurité', assignee: 'HR', status: 'pending', dueDate: '2025-01-18' }
  ];

  const departTasks = [
    { id: 1, title: 'Récupérer équipements', assignee: 'IT', status: 'completed', dueDate: '2025-01-20' },
    { id: 2, title: 'Désactiver accès', assignee: 'IT', status: 'in_progress', dueDate: '2025-01-20' },
    { id: 3, title: 'Entretien de départ', assignee: 'HR', status: 'pending', dueDate: '2025-01-21' },
    { id: 4, title: 'Documents administratifs', assignee: 'HR', status: 'pending', dueDate: '2025-01-22' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Onboarding */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Intégration</h3>
                <p className="text-sm text-gray-600">Nouveaux employés</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
              Nouveau processus
            </button>
          </div>
          
          <div className="space-y-3">
            {integrationTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : task.status === 'in_progress' ? (
                    <Clock className="w-5 h-5 text-blue-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-600">Assigné à: {task.assignee}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status === 'completed' ? 'Terminé' : 
                     task.status === 'in_progress' ? 'En cours' : 'En attente'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{task.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offboarding */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Départ</h3>
                <p className="text-sm text-gray-600">Fin de contrat</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
              Nouveau départ
            </button>
          </div>
          
          <div className="space-y-3">
            {departTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : task.status === 'in_progress' ? (
                    <Clock className="w-5 h-5 text-blue-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-600">Assigné à: {task.assignee}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status === 'completed' ? 'Terminé' : 
                     task.status === 'in_progress' ? 'En cours' : 'En attente'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{task.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRWorkflows;