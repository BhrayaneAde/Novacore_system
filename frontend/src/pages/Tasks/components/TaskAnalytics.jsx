import React from 'react';
import { BarChart3, TrendingUp, Clock, Users, CheckCircle, AlertTriangle } from 'lucide-react';

const TaskAnalytics = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const completionRate = analytics.total_tasks > 0 
    ? Math.round((analytics.completed_tasks / analytics.total_tasks) * 100)
    : 0;

  const overdueRate = analytics.total_tasks > 0
    ? Math.round((analytics.overdue_tasks / analytics.total_tasks) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total des tâches</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.total_tasks}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux de completion</p>
              <p className="text-3xl font-bold text-green-600">{completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En retard</p>
              <p className="text-3xl font-bold text-red-600">{analytics.overdue_tasks}</p>
              <p className="text-sm text-red-500">{overdueRate}% du total</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Temps moyen</p>
              <p className="text-3xl font-bold text-orange-600">
                {analytics.avg_completion_time || 0}h
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Répartition par statut
          </h3>
          <div className="space-y-4">
            {[
              { status: 'pending', label: 'En attente', count: analytics.pending_tasks, color: 'bg-yellow-500' },
              { status: 'in_progress', label: 'En cours', count: analytics.in_progress_tasks, color: 'bg-blue-500' },
              { status: 'completed', label: 'Terminées', count: analytics.completed_tasks, color: 'bg-green-500' },
              { status: 'cancelled', label: 'Annulées', count: analytics.cancelled_tasks || 0, color: 'bg-gray-500' }
            ].map(item => {
              const percentage = analytics.total_tasks > 0 
                ? Math.round((item.count / analytics.total_tasks) * 100)
                : 0;
              
              return (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                    <span className="text-xs text-gray-500">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Répartition par priorité
          </h3>
          <div className="space-y-4">
            {[
              { priority: 'urgent', label: 'Urgente', count: analytics.urgent_tasks || 0, color: 'bg-red-500' },
              { priority: 'high', label: 'Haute', count: analytics.high_priority_tasks || 0, color: 'bg-orange-500' },
              { priority: 'normal', label: 'Normale', count: analytics.normal_priority_tasks || 0, color: 'bg-yellow-500' },
              { priority: 'low', label: 'Basse', count: analytics.low_priority_tasks || 0, color: 'bg-green-500' }
            ].map(item => {
              const percentage = analytics.total_tasks > 0 
                ? Math.round((item.count / analytics.total_tasks) * 100)
                : 0;
              
              return (
                <div key={item.priority} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                    <span className="text-xs text-gray-500">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Métriques de performance
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Productivité</h4>
            <p className="text-2xl font-bold text-blue-600">{completionRate}%</p>
            <p className="text-sm text-gray-600">Taux de completion</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Efficacité</h4>
            <p className="text-2xl font-bold text-green-600">
              {analytics.avg_completion_time || 0}h
            </p>
            <p className="text-sm text-gray-600">Temps moyen</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Charge</h4>
            <p className="text-2xl font-bold text-orange-600">
              {analytics.active_assignees || 0}
            </p>
            <p className="text-sm text-gray-600">Personnes actives</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {analytics.recent_completions && analytics.recent_completions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tâches récemment terminées
          </h3>
          <div className="space-y-3">
            {analytics.recent_completions.slice(0, 5).map((task, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-600">
                    Par {task.assigned_user?.name || 'Inconnu'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">
                    {new Date(task.completed_at).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {task.actual_hours}h / {task.estimated_hours}h
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskAnalytics;