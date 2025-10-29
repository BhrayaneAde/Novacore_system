import React from "react";
import { Briefcase, TrendingUp, Award } from "lucide-react";

const EmployeeTimeline = ({ employeeId }) => {
  const events = [
    {
      id: 1,
      type: "promotion",
      title: "Promotion - Développeur Senior",
      date: "2024-01-15",
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      id: 2,
      type: "award",
      title: "Employé du mois",
      date: "2023-11-01",
      icon: Award,
      color: "bg-primary-500",
    },
    {
      id: 3,
      type: "hire",
      title: "Embauche",
      date: "2022-03-15",
      icon: Briefcase,
      color: "bg-secondary-500",
    },
  ];

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 ${event.color} rounded-full flex items-center justify-center`}>
              <event.icon className="w-5 h-5 text-white" />
            </div>
            {index < events.length - 1 && (
              <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(event.date).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeTimeline;
