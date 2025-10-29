import React from "react";

const ProgressBar = ({ progress = 0, label, showPercentage = true, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-secondary-500",
    green: "bg-green-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
  };

  const getColorByProgress = () => {
    if (progress >= 80) return colorClasses.green;
    if (progress >= 50) return colorClasses.blue;
    if (progress >= 30) return colorClasses.amber;
    return colorClasses.red;
  };

  const barColor = color === "auto" ? getColorByProgress() : colorClasses[color];

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-900">{progress}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
