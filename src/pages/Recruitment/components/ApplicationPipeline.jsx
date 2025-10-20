import React from "react";
import { CheckCircle, Circle } from "lucide-react";

const ApplicationPipeline = ({ currentStage = "screening" }) => {
  const stages = [
    { id: "screening", label: "Présélection" },
    { id: "interview_hr", label: "Entretien RH" },
    { id: "interview_tech", label: "Entretien technique" },
    { id: "offer", label: "Offre" },
    { id: "hired", label: "Embauché" },
  ];

  const currentIndex = stages.findIndex((s) => s.id === currentStage);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Pipeline de recrutement</h3>
      
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={stage.id} className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    isCurrent ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {stage.label}
                </p>
              </div>
              {isCurrent && (
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  En cours
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationPipeline;
