import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Plus, Target } from "lucide-react";

const GoalsManagement = () => {
  const goals = [
    { id: 1, title: "Livrer le projet X", employee: "Sophie Martin", progress: 100, status: "completed" },
    { id: 2, title: "Mentorer 2 juniors", employee: "Sophie Martin", progress: 75, status: "in_progress" },
    { id: 3, title: "Refonte UI Dashboard", employee: "Thomas Dubois", progress: 100, status: "completed" },
    { id: 4, title: "Design System v2", employee: "Thomas Dubois", progress: 60, status: "in_progress" },
  ];

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    return "bg-amber-500";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Gestion des objectifs</h1>
          <Button icon={Plus}>Nouvel objectif</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                      <p className="text-sm text-gray-600">{goal.employee}</p>
                    </div>
                  </div>
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

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progression</span>
                    <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GoalsManagement;
