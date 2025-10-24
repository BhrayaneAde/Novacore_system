import { useState, useEffect } from 'react';
import { Star, TrendingUp, TrendingDown, Target, Calendar, CheckCircle, Clock, Award } from 'lucide-react';
import { performanceService, tasksService, usersService } from '../../services';
import { useAuthStore } from '../../store/useAuthStore';

const MyPerformance = () => {
  const { currentUser } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState('2025-01');
  const [evaluations, setEvaluations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour déterminer le niveau de performance
  const getPerformanceLevel = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'green', icon: '🌟' };
    if (score >= 80) return { label: 'Très bien', color: 'blue', icon: '👍' };
    if (score >= 70) return { label: 'Bien', color: 'yellow', icon: '👌' };
    if (score >= 60) return { label: 'Satisfaisant', color: 'orange', icon: '⚠️' };
    return { label: 'À améliorer', color: 'red', icon: '⚡' };
  };

  useEffect(() => {
    loadMyPerformanceData();
  }, [currentUser]);

  const loadMyPerformanceData = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const [evaluationsRes, tasksRes, usersRes] = await Promise.all([
        performanceService.getMyEvaluations().catch(() => ({ data: [] })),
        tasksService.getMyTasks().catch(() => ({ data: [] })),
        usersService.getAll().catch(() => ({ data: [] }))
      ]);
      
      setEvaluations(evaluationsRes.data || []);
      setTasks(tasksRes.data || []);
      setUsers(usersRes.data || []);
      
      // Définir la période par défaut
      if (evaluationsRes.data?.length > 0) {
        setSelectedPeriod(evaluationsRes.data[0].period);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de performance:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtenir les évaluations de l'employé connecté
  const myEvaluations = evaluations.filter(evaluation => evaluation.employee_id === currentUser?.employee_id);
  const currentEvaluation = myEvaluations.find(evaluation => evaluation.period === selectedPeriod);
  
  // Obtenir les tâches de l'employé
  const myTasks = tasks.filter(task => task.assigned_to === currentUser?.employee_id);
  const completedTasks = myTasks.filter(task => task.status === 'completed');
  const inProgressTasks = myTasks.filter(task => task.status === 'in_progress');

  const getManagerName = (managerId) => {
    const manager = users.find(u => u.id === managerId);
    return manager ? `${manager.first_name} ${manager.last_name}` : 'Inconnu';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement de vos données de performance...</span>
      </div>
    );
  }

  const getProgressColor = (trend) => {
    if (trend === 'improvement') return 'text-green-600';
    if (trend === 'decline') return 'text-red-600';
    return 'text-gray-600';
  };

  const getProgressIcon = (trend) => {
    if (trend === 'improvement') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'decline') return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ma Performance</h1>
          <p className="text-gray-600 mt-2">Suivi de mes évaluations et objectifs</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {myEvaluations.map(evaluation => (
            <option key={evaluation.period} value={evaluation.period}>
              {evaluation.period}
            </option>
          ))}
        </select>
      </div>

      {currentEvaluation ? (
        <>
          {/* Score global et progression */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Score Global</h2>
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold">
                    {Math.round(currentEvaluation.global_score || 0)}%
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20`}>
                      {getPerformanceLevel(currentEvaluation.global_score || 0).icon} {getPerformanceLevel(currentEvaluation.global_score || 0).label}
                    </span>
                  </div>
                </div>
              </div>
              {currentEvaluation.trend && (
                <div className="text-right">
                  <p className="text-blue-100 mb-2">Évolution vs mois précédent</p>
                  <div className="flex items-center gap-2 justify-end">
                    <span className={`flex items-center gap-1 ${getProgressColor(currentEvaluation.trend)}`}>
                      {getProgressIcon(currentEvaluation.trend)}
                      <span className="text-2xl font-bold text-white">
                        {currentEvaluation.progression > 0 ? '+' : ''}{(currentEvaluation.progression || 0).toFixed(1)}%
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Métriques détaillées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Métriques automatiques */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Métriques Automatiques (70%)</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Tâches terminées</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-gray-900">
                      {currentEvaluation.task_completion || 0}%
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${currentEvaluation.task_completion || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Respect des délais</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-gray-900">
                      {currentEvaluation.deadline_respect || 0}%
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${currentEvaluation.deadline_respect || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Qualité</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-gray-900">
                      {currentEvaluation.quality || 0}%
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${currentEvaluation.quality || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700">Charge de travail</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-gray-900">
                      {currentEvaluation.workload || 0}%
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-orange-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(currentEvaluation.workload || 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Évaluation manager */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Évaluation Manager (30%)</h3>
              <div className="space-y-4">
                {[
                  { key: 'communication', label: 'Communication', value: currentEvaluation.communication || 0 },
                  { key: 'teamwork', label: 'Travail d\'équipe', value: currentEvaluation.teamwork || 0 },
                  { key: 'initiative', label: 'Initiative', value: currentEvaluation.initiative || 0 },
                  { key: 'problemSolving', label: 'Résolution problèmes', value: currentEvaluation.problem_solving || 0 }
                ].map((criterion) => (
                  <div key={criterion.key} className="flex justify-between items-center">
                    <span className="text-gray-700">{criterion.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(10)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < criterion.value
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">
                        {criterion.value}/10
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback du manager */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Commentaires de mon Manager</h3>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700 italic">"{currentEvaluation.comments || 'Aucun commentaire'}"</p>
                <p className="text-sm text-gray-500 mt-2">
                  - {getManagerName(currentEvaluation.manager_id)}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-700 mb-2">💪 Points Forts</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {(currentEvaluation.strengths || []).map((strength, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-orange-700 mb-2">🎯 À Améliorer</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {(currentEvaluation.improvements || []).map((improvement, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Mes objectifs */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mes Objectifs</h3>
              <div className="space-y-3">
                {(currentEvaluation.objectives || []).map((objective, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{objective}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.random() * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">En cours</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Historique des évaluations */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique de mes Évaluations</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Période</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Score Global</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Évolution</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Niveau</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Manager</th>
                  </tr>
                </thead>
                <tbody>
                  {myEvaluations.map((evaluation) => {
                    const performanceLevel = getPerformanceLevel(evaluation.global_score || 0);
                    return (
                      <tr key={evaluation.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{evaluation.period}</td>
                        <td className="py-3 px-4">
                          <span className="text-lg font-bold text-gray-900">
                            {Math.round(evaluation.global_score || 0)}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {evaluation.trend && (
                            <div className="flex items-center gap-1">
                              {getProgressIcon(evaluation.trend)}
                              <span className={getProgressColor(evaluation.trend)}>
                                {evaluation.progression > 0 ? '+' : ''}{(evaluation.progression || 0).toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${performanceLevel.color}-100 text-${performanceLevel.color}-800`}>
                            {performanceLevel.icon} {performanceLevel.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {getManagerName(evaluation.manager_id)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune évaluation</h3>
          <p className="text-gray-600">Aucune évaluation disponible pour cette période.</p>
        </div>
      )}
    </div>
  );
};

export default MyPerformance;