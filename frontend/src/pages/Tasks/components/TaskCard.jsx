import React, { useState } from 'react';
import { Calendar, Clock, User, AlertCircle, MessageSquare, MoreHorizontal, Edit, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onUpdate, onDelete, onSelect }) => {
  const [showActions, setShowActions] = useState(false);

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      normal: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.normal;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.pending;
  };

  const handleStatusChange = (newStatus) => {
    onUpdate(task.id, { status: newStatus });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = () => {
    if (!task.due_date) return null;
    const today = new Date();
    const dueDate = new Date(task.due_date);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 
              className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
              onClick={() => onSelect(task)}
            >
              {task.title}
            </h3>
            
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            
            {task.is_overdue && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                En retard
              </span>
            )}
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-2">
            {task.description}
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
              <button
                onClick={() => {
                  onSelect(task);
                  setShowActions(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => {
                  onDelete(task.id);
                  setShowActions(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{task.assigned_user?.name || 'Non assigné'}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className={task.is_overdue ? 'text-red-600' : ''}>
            {formatDate(task.due_date)}
          </span>
          {daysUntilDue !== null && (
            <span className={`text-xs ${
              daysUntilDue < 0 ? 'text-red-600' : 
              daysUntilDue <= 3 ? 'text-orange-600' : 'text-gray-500'
            }`}>
              ({daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} jours de retard` : 
                daysUntilDue === 0 ? 'Aujourd\'hui' : 
                `${daysUntilDue} jours restants`})
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>
            {task.actual_hours || 0}h / {task.estimated_hours || 0}h
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
            {task.status === 'pending' ? 'En attente' :
             task.status === 'in_progress' ? 'En cours' :
             task.status === 'completed' ? 'Terminée' : 'Annulée'}
          </span>
          
          {task.tags && task.tags.length > 0 && (
            <div className="flex gap-1">
              {task.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  #{tag}
                </span>
              ))}
              {task.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{task.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {task.comments_count > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MessageSquare className="w-4 h-4" />
              <span>{task.comments_count}</span>
            </div>
          )}
          
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">En attente</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;