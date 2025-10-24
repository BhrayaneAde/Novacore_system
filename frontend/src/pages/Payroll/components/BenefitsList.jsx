import React from "react";
import { Gift, Check } from "lucide-react";

const BenefitsList = ({ employeeId }) => {
  const benefits = [
    { id: 1, name: "Tickets restaurant", value: "9€/jour", active: true },
    { id: 2, name: "Mutuelle santé", value: "100%", active: true },
    { id: 3, name: "Transport", value: "50%", active: true },
    { id: 4, name: "Télétravail", value: "2.5€/jour", active: false },
  ];

  return (
    <div className="space-y-3">
      {benefits.map((benefit) => (
        <div
          key={benefit.id}
          className={`flex items-center justify-between p-4 rounded-lg border ${
            benefit.active
              ? "border-green-200 bg-green-50"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              benefit.active ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"
            }`}>
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">{benefit.name}</h4>
              <p className="text-sm text-gray-600">{benefit.value}</p>
            </div>
          </div>
          {benefit.active && (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">Actif</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BenefitsList;
