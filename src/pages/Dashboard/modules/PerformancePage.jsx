import React, { useState } from "react";
import { Target, TrendingUp, Award, CheckCircle, Search, Filter, Star } from "lucide-react";

const PerformancePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const performanceReviews = [
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
  
  const averageRating = performanceReviews.reduce((sum, review) => sum + review.rating, 0) / performanceReviews.length;
  const completedGoals = performanceReviews.flatMap(r => r.goals).filter(g => g.status === 'completed').length;
  const totalGoals = performanceReviews.flatMap(r => r.goals).length;
  const completionRate = Math.round((completedGoals / totalGoals) * 100);

  return (
    <div className="p-6 max-w-7xl mx-auto">
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
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
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
    </div>
  );
};

export default PerformancePage;
