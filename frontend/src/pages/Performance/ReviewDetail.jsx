import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHRStore } from "../../store/useHRStore";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { ArrowLeft, Edit, Award } from "lucide-react";

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { performanceReviews } = useHRStore();
  
  const review = performanceReviews.find((rev) => rev.id === parseInt(id));

  if (!review) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Évaluation non trouvée</h2>
          <Button onClick={() => navigate("/app/performance")} className="mt-4">
            Retour
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-2xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    return "bg-amber-500";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/app/performance")}>
              Retour
            </Button>
            <h1 className="text-3xl font-semibold tracking-tight">Évaluation de performance</h1>
          </div>
          <Button icon={Edit}>Modifier</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{review.employeeName}</h2>
                  <p className="text-sm text-gray-600">{review.period}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-semibold text-gray-900">{review.rating}/5</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Évaluation globale</h3>
                <div className="flex items-center gap-4">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-600">
                    {review.rating === 5 ? "Exceptionnel" : 
                     review.rating >= 4 ? "Très bon" :
                     review.rating >= 3 ? "Satisfaisant" :
                     review.rating >= 2 ? "À améliorer" : "Insuffisant"}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Objectifs et progression</h3>
                <div className="space-y-4">
                  {review.goals.map((goal, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{goal.title}</h4>
                        <Badge
                          variant={
                            goal.status === "completed"
                              ? "success"
                              : goal.status === "in_progress"
                              ? "info"
                              : "default"
                          }
                        >
                          {goal.status === "completed"
                            ? "Terminé"
                            : goal.status === "in_progress"
                            ? "En cours"
                            : "À faire"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${getProgressColor(goal.progress)}`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{goal.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Feedback du manager</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 italic">"{review.feedback}"</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Évaluation réalisée le {new Date(review.reviewDate).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </Card>

          <Card title="Statistiques">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Objectifs complétés</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {review.goals.filter(g => g.status === "completed").length}/{review.goals.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Progression moyenne</p>
                <p className="text-lg font-medium text-gray-900">
                  {Math.round(review.goals.reduce((sum, g) => sum + g.progress, 0) / review.goals.length)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Période d'évaluation</p>
                <p className="text-sm font-medium text-gray-900">{review.period}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Prochaine évaluation</p>
                <p className="text-sm font-medium text-gray-900">Q4 2025</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReviewDetail;
