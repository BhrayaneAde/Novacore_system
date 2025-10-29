import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, TrendingUp, CheckSquare, Clock } from 'lucide-react';
import { systemService } from '../../services';

const ManagerDetails = ({ manager, onBack }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const response = await systemService.employees.getAll();
        const employees = response.employees || response.data?.employees || [];
        const teamMembers = employees.filter(emp => 
          emp.department_id === manager.department_id && emp.id !== manager.id
        );
        const team = { data: teamMembers };
        setTeamMembers(team.data || []);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'équipe:', error);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };
    loadTeamData();
  }, [manager.id]);

  const getEmployeeStats = async (employeeId) => {
    try {
      // Mock stats since performanceService doesn't exist
      const stats = { overallScore: 85, tasksCompleted: 12, onTimeDelivery: 90, qualityScore: 88 };
      return {
        performance: stats?.overallScore || 0,
        tasksCompleted: stats?.tasksCompleted || 0,
        onTimeDelivery: stats?.onTimeDelivery || 0,
        qualityScore: stats?.qualityScore || 0
      };
    } catch (error) {
      return {
        performance: 0,
        tasksCompleted: 0,
        onTimeDelivery: 0,
        qualityScore: 0
      };
    }
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
            Équipe de {manager.name}
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
            <Users className="w-5 h-5 text-secondary-500" />
          </div>
          <p className="text-3xl font-bold text-secondary-600">{teamMembers.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Performance Moy.</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {loading ? '...' : Math.round(teamMembers.reduce((acc, emp) => acc + (emp.performance || 0), 0) / teamMembers.length || 0)}%
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Tâches Total</h3>
            <CheckSquare className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {loading ? '...' : teamMembers.reduce((acc, emp) => acc + (emp.tasksCompleted || 0), 0)}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Ponctualité Moy.</h3>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {loading ? '...' : Math.round(teamMembers.reduce((acc, emp) => acc + (emp.onTimeDelivery || 0), 0) / teamMembers.length || 0)}%
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
            
            return (
              <div key={employee.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-lg font-medium text-green-600">
                        {employee.name?.charAt(0) || 'E'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{employee.first_name} {employee.last_name}</h3>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-8 text-center">
                    <div>
                      <p className="text-2xl font-bold text-secondary-600">{employee.performance || 0}%</p>
                      <p className="text-xs text-gray-500">Performance</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{employee.tasksCompleted || 0}</p>
                      <p className="text-xs text-gray-500">Tâches</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">{employee.onTimeDelivery || 0}%</p>
                      <p className="text-xs text-gray-500">Ponctualité</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{employee.qualityScore || 0}%</p>
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