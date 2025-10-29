import { useState, useEffect } from 'react';
import { Star, TrendingUp, TrendingDown, Target, MessageSquare, Calendar, User, Building2 } from 'lucide-react';
import { evaluationsService } from '../../services/evaluations';
import { usersService, hrService, systemService } from '../../services';
import { useAuthStore } from '../../store/useAuthStore';
import Loader from '../../components/ui/Loader';

const EmployeeEvaluation = () => {
  const { currentUser: user } = useAuthStore();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [evaluations, setEvaluations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluationData, setEvaluationData] = useState({
    communication: 5,
    teamwork: 5,
    initiative: 5,
    problemSolving: 5,
    comments: '',
    strengths: '',
    improvements: '',
    objectives: ''
  });

  // Niveaux de performance
  const getPerformanceLevel = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'green', icon: '🌟' };
    if (score >= 80) return { label: 'Très bien', color: 'blue', icon: '👍' };
    if (score >= 70) return { label: 'Bien', color: 'yellow', icon: '👌' };
    if (score >= 60) return { label: 'Satisfaisant', color: 'orange', icon: '⚠️' };
    return { label: 'À améliorer', color: 'red', icon: '⚡' };
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [evaluationsRes, employeesRes, usersRes, departmentsRes] = await Promise.all([
        evaluationsService.getAll().catch(() => []),
        systemService.employees.getAll().catch(() => ({ data: [] })),
        usersService.getAll().catch(() => ({ data: [] })),
        hrService.departments.getAll().catch(() => ({ data: [] }))
      ]);
      
      setEvaluations(evaluationsRes || []);
      setEmployees(employeesRes.data || []);
      setUsers(usersRes.data || []);
      setDepartments(departmentsRes.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEvaluations = () => {
    if (user?.role === 'manager') {
      return evaluations.filter(evaluation => evaluation.manager_id === user.id);
    } else if (user?.role === 'employee') {
      return evaluations.filter(evaluation => evaluation.employee_id === user.employee_id);
    }
    return evaluations;
  };

  const filteredEvaluations = getFilteredEvaluations();

  const getEmployeeName = (employeeId) => {
    const employeesArray = Array.isArray(employees) ? employees : [];
    const employee = employeesArray.find(emp => emp.id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : 'Inconnu';
  };

  const getManagerName = (managerId) => {
    const manager = users.find(u => u.id === managerId);
    return manager ? `${manager.first_name} ${manager.last_name}` : 'Inconnu';
  };

  const handleEvaluate = (employeeId) => {
    setSelectedEmployee(employeeId);
    setShowEvaluationForm(true);
  };

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    try {
      const newEvaluation = {
        employee_id: selectedEmployee,
        manager_id: user.id,
        period: new Date().getFullYear() + '-Q' + Math.ceil((new Date().getMonth() + 1) / 3),
        communication: evaluationData.communication,
        teamwork: evaluationData.teamwork,
        initiative: evaluationData.initiative,
        problem_solving: evaluationData.problemSolving,
        comments: evaluationData.comments,
        strengths: evaluationData.strengths.split('\n').filter(Boolean),
        improvements: evaluationData.improvements.split('\n').filter(Boolean),
        objectives: evaluationData.objectives.split('\n').filter(Boolean)
      };
      
      const result = await evaluationsService.create(newEvaluation);
      setEvaluations([...evaluations, result]);
      setShowEvaluationForm(false);
      setSelectedEmployee(null);
      setEvaluationData({
        communication: 5,
        teamwork: 5,
        initiative: 5,
        problemSolving: 5,
        comments: '',
        strengths: '',
        improvements: '',
        objectives: ''
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'évaluation:', error);
    }
  };

  const canEvaluate = user?.role === 'manager' || user?.role === 'employer' || user?.role === 'hr_admin';

  const getTeamMembers = () => {
    const employeesArray = Array.isArray(employees) ? employees : [];
    if (user?.role === 'manager') {
      return employeesArray.filter(emp => emp.department_id === user.department_id);
    }
    return employeesArray;
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center py-12">
        <Loader size={48} />
        <span className="mt-4 text-gray-600">Chargement des évaluations...</span>
      </div>
    );
  }

  const getDepartmentStats = () => {
    const stats = {};
    const employeesArray = Array.isArray(employees) ? employees : [];
    departments.forEach(dept => {
      const deptEvaluations = filteredEvaluations.filter(evaluation => {
        const employee = employeesArray.find(emp => emp.id === evaluation.employee_id);
        return employee?.department_id === dept.id;
      });
      
      if (deptEvaluations.length > 0) {
        stats[dept.name] = {
          avgScore: Math.round(deptEvaluations.reduce((acc, evaluation) => acc + (evaluation.global_score || 0), 0) / deptEvaluations.length),
          improvements: deptEvaluations.filter(evaluation => evaluation.trend === 'improvement').length,
          declines: deptEvaluations.filter(evaluation => evaluation.trend === 'decline').length,
          taskCompletion: Math.round(deptEvaluations.reduce((acc, evaluation) => acc + (evaluation.task_completion || 0), 0) / deptEvaluations.length),
          totalEmployees: deptEvaluations.length
        };
      }
    });
    return stats;
  };

  const departmentStats = getDepartmentStats();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Évaluations des Employés</h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'employee' ? 'Mes évaluations' : 
             user?.role === 'manager' ? 'Évaluations de mon équipe' : 
             'Toutes les évaluations'}
          </p>
        </div>
      </div>

      {/* Statistiques de performance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Score Moyen</p>
              <p className="text-2xl font-bold text-secondary-600">
                {filteredEvaluations.length > 0 
                  ? Math.round(filteredEvaluations.reduce((acc, evaluation) => acc + (evaluation.global_score || 0), 0) / filteredEvaluations.length)
                  : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Progression</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredEvaluations.filter(evaluation => evaluation.trend === 'improvement').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Baisse</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredEvaluations.filter(evaluation => evaluation.trend === 'decline').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Objectifs Atteints</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(filteredEvaluations.reduce((acc, evaluation) => acc + (evaluation.task_completion || 0), 0) / filteredEvaluations.length || 0)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques par département */}
      {(user?.role === 'employer' || user?.role === 'hr_admin') && Object.keys(departmentStats).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Performance par Département
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(departmentStats).map(([deptName, stats]) => (
              <div key={deptName} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">{deptName}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Score moyen:</span>
                    <span className="font-medium text-secondary-600">{stats.avgScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">En progression:</span>
                    <span className="font-medium text-green-600">{stats.improvements}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">En baisse:</span>
                    <span className="font-medium text-red-600">{stats.declines}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tâches complétées:</span>
                    <span className="font-medium text-purple-600">{stats.taskCompletion}%</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-gray-600">Employés évalués:</span>
                    <span className="font-medium">{stats.totalEmployees}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions rapides pour manager */}
      {canEvaluate && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getTeamMembers().map((employee) => (
              <div key={employee.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-secondary-600">
                      {employee.first_name?.[0]}{employee.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {employee.first_name} {employee.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{employee.position}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEvaluate(employee.id)}
                  className="w-full bg-secondary-600 text-white py-2 rounded-lg hover:bg-secondary-700 transition-colors text-sm"
                >
                  Évaluer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liste des évaluations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Historique des Évaluations</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredEvaluations.map((evaluation) => {
            const performanceLevel = getPerformanceLevel(evaluation.global_score || 0);
            const employeesArray = Array.isArray(employees) ? employees : [];
            const employee = employeesArray.find(emp => emp.id === evaluation.employee_id);
            
            return (
              <div key={evaluation.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center">
                      <span className="text-lg font-medium text-secondary-600">
                        {employee?.first_name?.[0]}{employee?.last_name?.[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {getEmployeeName(evaluation.employee_id)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Période: {evaluation.period} • Évalué par: {getManagerName(evaluation.manager_id)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-bold text-gray-900">
                        {Math.round(evaluation.global_score || 0)}%
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${performanceLevel.color}-100 text-${performanceLevel.color}-800`}>
                        {performanceLevel.icon} {performanceLevel.label}
                      </span>
                    </div>
                    {evaluation.previousPeriod && (
                      <div className="flex items-center gap-1 text-sm">
                        {evaluation.previousPeriod.trend === 'improvement' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : evaluation.previousPeriod.trend === 'decline' ? (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        ) : null}
                        <span className={`${
                          evaluation.previousPeriod.trend === 'improvement' ? 'text-green-600' :
                          evaluation.previousPeriod.trend === 'decline' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {evaluation.previousPeriod.progression > 0 ? '+' : ''}{evaluation.previousPeriod.progression.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Métriques automatiques */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Métriques Automatiques (70%)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tâches terminées</span>
                        <span className="font-medium">{evaluation.automaticMetrics?.taskCompletion || 0}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Respect des délais</span>
                        <span className="font-medium">{evaluation.automaticMetrics?.deadlineRespect || 0}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Qualité</span>
                        <span className="font-medium">{evaluation.automaticMetrics?.quality || 0}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Charge de travail</span>
                        <span className="font-medium">{evaluation.automaticMetrics?.workload || 0}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Évaluation manuelle */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Évaluation Manager (30%)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Communication</span>
                        <div className="flex items-center gap-1">
                          {[...Array(10)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < (evaluation.manualEvaluation?.communication || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-sm font-medium">
                            {evaluation.manualEvaluation?.communication || 0}/10
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Travail d'équipe</span>
                        <div className="flex items-center gap-1">
                          {[...Array(10)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < (evaluation.manualEvaluation?.teamwork || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-sm font-medium">
                            {evaluation.manualEvaluation?.teamwork || 0}/10
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Initiative</span>
                        <div className="flex items-center gap-1">
                          {[...Array(10)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < (evaluation.manualEvaluation?.initiative || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-sm font-medium">
                            {evaluation.manualEvaluation?.initiative || 0}/10
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Résolution problèmes</span>
                        <div className="flex items-center gap-1">
                          {[...Array(10)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < (evaluation.manualEvaluation?.problemSolving || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-sm font-medium">
                            {evaluation.manualEvaluation?.problemSolving || 0}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commentaires et objectifs */}
                <div className="mt-6 space-y-4">
                  {evaluation.managerComments && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Commentaires du Manager</h4>
                      <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                        {evaluation.managerComments}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Points Forts</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {(evaluation.strengths || []).map((strength, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Axes d'Amélioration</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {(evaluation.improvements || []).map((improvement, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Objectifs Prochaine Période</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {(evaluation.nextObjectives || []).map((objective, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-secondary-500" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal d'évaluation */}
      {showEvaluationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              Évaluer {getEmployeeName(selectedEmployee)}
            </h2>
            <form onSubmit={handleSubmitEvaluation} className="space-y-6">
              {/* Critères d'évaluation */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Critères d'Évaluation (sur 10)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'communication', label: 'Communication' },
                    { key: 'teamwork', label: 'Travail d\'équipe' },
                    { key: 'initiative', label: 'Initiative' },
                    { key: 'problemSolving', label: 'Résolution de problèmes' }
                  ].map((criterion) => (
                    <div key={criterion.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {criterion.label}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={evaluationData[criterion.key]}
                        onChange={(e) => setEvaluationData({
                          ...evaluationData,
                          [criterion.key]: parseInt(e.target.value)
                        })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1</span>
                        <span className="font-medium">{evaluationData[criterion.key]}/10</span>
                        <span>10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commentaires */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaires généraux
                </label>
                <textarea
                  value={evaluationData.comments}
                  onChange={(e) => setEvaluationData({...evaluationData, comments: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  rows="3"
                  placeholder="Commentaires sur la performance globale..."
                />
              </div>

              {/* Points forts */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points forts (un par ligne)
                </label>
                <textarea
                  value={evaluationData.strengths}
                  onChange={(e) => setEvaluationData({...evaluationData, strengths: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  rows="3"
                  placeholder="Excellente communication&#10;Respect des délais&#10;Esprit d'équipe"
                />
              </div>

              {/* Axes d'amélioration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Axes d'amélioration (un par ligne)
                </label>
                <textarea
                  value={evaluationData.improvements}
                  onChange={(e) => setEvaluationData({...evaluationData, improvements: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  rows="3"
                  placeholder="Prise d'initiative&#10;Gestion du temps&#10;Compétences techniques"
                />
              </div>

              {/* Objectifs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objectifs prochaine période (un par ligne)
                </label>
                <textarea
                  value={evaluationData.objectives}
                  onChange={(e) => setEvaluationData({...evaluationData, objectives: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  rows="3"
                  placeholder="Terminer la formation React&#10;Prendre en charge un projet&#10;Améliorer les présentations"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-secondary-600 text-white py-2 rounded-lg hover:bg-secondary-700 transition-colors"
                >
                  Enregistrer l'Évaluation
                </button>
                <button
                  type="button"
                  onClick={() => setShowEvaluationForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeEvaluation;