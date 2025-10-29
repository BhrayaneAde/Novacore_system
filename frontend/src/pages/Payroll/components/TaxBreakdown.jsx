import React from "react";
import { PieChart } from "lucide-react";

const TaxBreakdown = ({ salary }) => {
  const calculateBreakdown = (gross) => {
    return {
      socialSecurity: { amount: gross * 0.22, percentage: 22 },
      retirement: { amount: gross * 0.10, percentage: 10 },
      unemployment: { amount: gross * 0.05, percentage: 5 },
      other: { amount: gross * 0.03, percentage: 3 },
    };
  };

  const breakdown = calculateBreakdown(salary || 50000);
  const total = Object.values(breakdown).reduce((sum, item) => sum + item.amount, 0);

  const items = [
    { label: "Sécurité sociale", data: breakdown.socialSecurity, color: "bg-secondary-500" },
    { label: "Retraite", data: breakdown.retirement, color: "bg-purple-500" },
    { label: "Chômage", data: breakdown.unemployment, color: "bg-amber-500" },
    { label: "Autres", data: breakdown.other, color: "bg-gray-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-50 text-secondary-600 rounded-lg flex items-center justify-center">
          <PieChart className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Répartition des cotisations</h3>
          <p className="text-sm text-gray-600">Total: {total.toLocaleString("fr-FR")} €</p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 ${item.color} rounded-full`} />
                <span className="text-sm font-medium text-gray-900">{item.label}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">
                  {item.data.amount.toLocaleString("fr-FR")} €
                </span>
                <span className="text-xs text-gray-500 ml-2">({item.data.percentage}%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${item.color}`}
                style={{ width: `${item.data.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900">Salaire net</span>
          <span className="text-xl font-bold text-green-600">
            {(salary - total).toLocaleString("fr-FR")} €
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaxBreakdown;
