import React from 'react';
import { ArrowLeft, Users, TrendingUp, CheckSquare, Clock } from 'lucide-react';
import { employees } from '../../data/mockData';
import { evaluations } from '../../data/evaluations';

const ManagerDetails = ({ manager, onBack }) => {
  // Trouver les employés sous ce manager
  const teamMembers = employees.filter(emp => emp.managerId === manager.id);
  
  // Obtenir les évaluations pour chaque membre de l'équipe
  const getEmployeeStats = (employeeId) => {
    const empEvaluations = evaluations.filter(evaluation => evaluation.employeeId === employeeId);
    const latest = empEvaluations[empEvaluations.length - 1];
    
    return {
      performance: latest?.overallScore || 0,
      tasksCompleted: latest?.automaticMetrics?.tasksCompleted || 0,
      onTimeDelivery: latest?.automaticMetrics?.onTimeDelivery || 0,
      qualityScore: latest?.automaticMetrics?.qualityScore || 0
    };
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Équipe de {manager.firstName} {manager.lastName}
          </h1>
          <p className="text-gray-600 mt-1">
            {manager.department?.name} • {teamMembers.length} membres
          </p>
        </div>
      </div>

      {/* Vue d'ensemble de l'équipe */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Membres</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{teamMembers.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Performance Moy.</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {Math.round(teamMembers.reduce((acc, emp) => acc + getEmployeeStats(emp.id).performance, 0) / teamMembers.length || 0)}%
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Tâches Total</h3>
            <CheckSquare className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {teamMembers.reduce((acc, emp) => acc + getEmployeeStats(emp.id).tasksCompleted, 0)}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Ponctualité Moy.</h3>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {Math.round(teamMembers.reduce((acc, emp) => acc + getEmployeeStats(emp.id).onTimeDelivery, 0) / teamMembers.length || 0)}%
          </p>
        </div>
      </div>

      {/* Liste des employés avec leurs stats */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Performance des Employés</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {teamMembers.map((employee) => {
            const stats = getEmployeeStats(employee.id);
            
            return (
              <div key={employee.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                      <p className="text-sm text-gray-600">{employee.role}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-8 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{stats.performance}%</p>
                      <p className="text-xs text-gray-500">Performance</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{stats.tasksCompleted}</p>
                      <p className="text-xs text-gray-500">Tâches</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">{stats.onTimeDelivery}%</p>
                      <p className="text-xs text-gray-500">Ponctualité</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{stats.qualityScore}%</p>
                      <p className="text-xs text-gray-500">Qualité</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun employé</h3>
          <p className="text-gray-600">Ce manager n'a pas encore d'équipe assignée.</p>
        </div>
      )}
    </div>
  );
};

export default ManagerDetails;