import React from "react";
import { useHRStore } from "../../../store/useHRStore";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { Target, TrendingUp, Award, CheckCircle } from "lucide-react";

const PerformancePage = () => {
  const { performanceReviews } = useHRStore();

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
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
          <div>
            <h1 className="text-3xl font-semibold mb-2 tracking-tight">Performance</h1>
            <p className="text-gray-600">Évaluations et objectifs des employés</p>
          </div>
          <Button icon={Award}>Nouvelle évaluation</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">4.3/5</p>
                <p className="text-sm text-gray-600">Note moyenne</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">87%</p>
                <p className="text-sm text-gray-600">Objectifs atteints</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">+12%</p>
                <p className="text-sm text-gray-600">Progression</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {performanceReviews.map((review) => (
            <Card key={review.id} title={review.employeeName} subtitle={review.period}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Évaluation globale</span>
                  {renderStars(review.rating)}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Objectifs</h4>
                  <div className="space-y-3">
                    {review.goals.map((goal, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{goal.title}</span>
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
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 italic">"{review.feedback}"</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Évalué le {new Date(review.reviewDate).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  Voir détails complets
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PerformancePage;
