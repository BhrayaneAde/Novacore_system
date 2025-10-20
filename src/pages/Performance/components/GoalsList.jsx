import React from "react";
import Badge from "../../../components/ui/Badge";
import { Target } from "lucide-react";

const GoalsList = ({ goals }) => {
  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    return "bg-amber-500";
  };

  return (
    <div className="space-y-4">
      {goals.map((goal, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{goal.title}</h4>
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
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Progression</span>
              <span className="text-xs font-medium text-gray-900">{goal.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoalsList;
