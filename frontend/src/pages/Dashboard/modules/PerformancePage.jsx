import React, { useState, useEffect } from "react";
import { Target, TrendingUp, Award, CheckCircle, Search, Filter, Star } from "lucide-react";
import { employeesService, performanceService } from "../../../services";
import { useAuthStore } from "../../../store/useAuthStore";

const PerformancePage = () => {
  const { currentUser: user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [performanceReviews, setPerformanceReviews] = useState([]);
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

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const loadPerformanceData = async () => {
    setLoading(true);
    try {
      const [employeesRes, performanceRes] = await Promise.all([
        employeesService.getAll().catch(() => ({ data: [] })),
        performanceService.getAll().catch(() => ({ data: [] }))
      ]);
      
      setEmployees(employeesRes.data || []);
      
      // Simuler des données de performance si l'API n'est pas encore implémentée
      const mockPerformanceData = [
        {
          id: 1,
          employeeName: "Marie Dubois",
          period: "Q4 2023",
          rating: 4,
          reviewDate: "2024-01-15",
          feedback: "Excellente performance, dépasse les attentes sur tous les objectifs.",
          goals: [
            { title: "Améliorer les compétences techniques", progress: 90, status: "completed" },
            { title: "Encadrer l'équipe junior", progress: 75, status: "in_progress" },
            { title: "Finaliser le projet client", progress: 100, status: "completed" }
          ]
        },
        {
          id: 2,
          employeeName: "Thomas Martin",
          period: "Q4 2023",
          rating: 5,
          reviewDate: "2024-01-12",
          feedback: "Performance exceptionnelle, leadership remarquable et résultats dépassant les objectifs.",
          goals: [
            { title: "Optimiser les processus", progress: 95, status: "completed" },
            { title: "Former l'équipe", progress: 85, status: "in_progress" },
            { title: "Augmenter la productivité", progress: 100, status: "completed" }
          ]
        },
        {
          id: 3,
          employeeName: "Sophie Laurent",
          period: "Q4 2023",
          rating: 3,
          reviewDate: "2024-01-10",
          feedback: "Bonne performance générale, quelques axes d'amélioration identifiés.",
          goals: [
            { title: "Améliorer la communication", progress: 60, status: "in_progress" },
            { title: "Développer les compétences design", progress: 80, status: "in_progress" },
            { title: "Respecter les délais", progress: 70, status: "in_progress" }
          ]
        }
      ];
      
      setPerformanceReviews(performanceRes.data?.length > 0 ? performanceRes.data : mockPerformanceData);
    } catch (error) {
      console.error('Erreur lors du chargement des données de performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTeamMembers = () => {
    if (user?.role === 'manager') {
      return employees.filter(emp => emp.department_id === user.department_id);
    }
    return employees;
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
      
      await performanceService.create(newEvaluation);
      await loadPerformanceData(); // Recharger les données
      
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

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : 'Inconnu';
  };
  

  
  const filteredReviews = performanceReviews.filter(review => 
    review.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    return "bg-amber-500";
  };
  
  const averageRating = performanceReviews.length > 0 
    ? performanceReviews.reduce((sum, review) => sum + review.rating, 0) / performanceReviews.length 
    : 0;
  const completedGoals = performanceReviews.flatMap(r => r.goals || []).filter(g => g.status === 'completed').length;
  const totalGoals = performanceReviews.flatMap(r => r.goals || []).length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement des données de performance...</span>
      </div>
    );
  }

  return (
    <div className="p-6  mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance</h1>
        <p className="text-gray-600">Évaluations et objectifs des employés</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-purple-600 mr-2">{averageRating.toFixed(1)}</span>
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Note moyenne</h3>
          <p className="text-sm text-gray-600">Sur 5 étoiles</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">{completionRate}%</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Objectifs atteints</h3>
          <p className="text-sm text-gray-600">{completedGoals}/{totalGoals} objectifs</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-blue-600">+12%</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Progression</h3>
          <p className="text-sm text-gray-600">Vs trimestre précédent</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-orange-600">{performanceReviews.length}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Évaluations</h3>
          <p className="text-sm text-gray-600">Ce trimestre</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Évaluations de performance</h2>
            <button 
              onClick={() => setShowEvaluationForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>Nouvelle évaluation</span>
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un employé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Performance Reviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{review.employeeName}</h3>
                <p className="text-sm text-gray-600">{review.period}</p>
              </div>
              <div className="flex items-center space-x-2">
                {renderStars(review.rating)}
                <span className="text-sm font-medium text-gray-700">({review.rating}/5)</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Objectifs</h4>
              <div className="space-y-3">
                {review.goals.map((goal, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">{goal.title}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                        goal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {goal.status === 'completed' ? 'Terminé' :
                         goal.status === 'in_progress' ? 'En cours' : 'À faire'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(goal.progress)}`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-xs text-gray-500">{goal.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 italic mb-2">"{review.feedback}"</p>
              <p className="text-xs text-gray-500">
                Évalué le {new Date(review.reviewDate).toLocaleDateString("fr-FR")}
              </p>
            </div>

            <button className="w-full mt-4 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Voir détails complets
            </button>
          </div>
        ))}
      </div>

      {/* Modal d'évaluation */}
      {showEvaluationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {selectedEmployee ? `Évaluer ${getEmployeeName(selectedEmployee)}` : 'Sélectionner un employé'}
            </h2>
            
            {!selectedEmployee ? (
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">Sélectionnez un employé à évaluer :</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {getTeamMembers().map((employee) => (
                    <button
                      key={employee.id}
                      onClick={() => setSelectedEmployee(employee.id)}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {employee.first_name?.[0]}{employee.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{employee.first_name} {employee.last_name}</h3>
                        <p className="text-sm text-gray-600">{employee.position}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowEvaluationForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitEvaluation} className="space-y-6">
                {/* Critères d'évaluation */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Critères d'Évaluation (sur 10)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'communication', label: 'Communication' },
                      { key: 'teamwork', label: 'Travail d\'\u00e9quipe' },
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Terminer la formation React&#10;Prendre en charge un projet&#10;Améliorer les présentations"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Enregistrer l'Évaluation
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEvaluationForm(false);
                      setSelectedEmployee(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformancePage;
