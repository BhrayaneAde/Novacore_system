import React from "react";
import { DollarSign, Calendar, TrendingUp, Award } from "lucide-react";

const EmployeeStats = ({ employee }) => {
  const calculateYears = (hireDate) => {
    return Math.floor((new Date() - new Date(hireDate)) / (365 * 24 * 60 * 60 * 1000));
  };

  const stats = [
    {
      icon: DollarSign,
      label: "Salaire annuel",
      value: `${employee.salary?.toLocaleString("fr-FR")} €`,
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Calendar,
      label: "Ancienneté",
      value: `${calculateYears(employee.hireDate)} ans`,
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: TrendingUp,
      label: "Congés restants",
      value: "15 jours",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Award,
      label: "Performance",
      value: "4.5/5",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
            <stat.icon className="w-5 h-5" />
          </div>
          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
          <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default EmployeeStats;
