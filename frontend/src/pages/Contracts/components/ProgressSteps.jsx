import React from "react";

const ProgressSteps = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.num} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            {/* Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentStep >= step.num
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            {/* Label */}
            <span
              className={`text-xs mt-2 font-medium ${
                currentStep >= step.num ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          {/* Line */}
          {index < steps.length - 1 && (
            <div
              className={`h-1 flex-1 mx-2 transition-all ${
                currentStep > step.num ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;
