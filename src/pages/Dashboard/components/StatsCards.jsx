import React from "react";
import { Users, CalendarCheck, UserPlus, Clock } from "lucide-react";

const stats = [
  {
    title: "Employés actifs",
    value: "247",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
    tag: "+12%",
    tagColor: "bg-green-50 text-green-600",
  },
  {
    title: "Taux de présence",
    value: "96.8%",
    icon: CalendarCheck,
    color: "bg-purple-50 text-purple-600",
    tag: "Aujourd'hui",
    tagColor: "bg-gray-50 text-gray-600",
  },
  {
    title: "Candidatures en cours",
    value: "34",
    icon: UserPlus,
    color: "bg-amber-50 text-amber-600",
    tag: "12 actifs",
    tagColor: "bg-blue-50 text-blue-600",
  },
  {
    title: "Demandes de congés",
    value: "23",
    icon: Clock,
    color: "bg-green-50 text-green-600",
    tag: "8 en attente",
    tagColor: "bg-orange-50 text-orange-600",
  },
];

const StatsCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {stats.map((s) => (
      <div
        key={s.title}
        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
            <s.icon className="w-5 h-5" />
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.tagColor}`}>
            {s.tag}
          </span>
        </div>
        <p className="text-2xl font-semibold text-gray-900 mb-1">{s.value}</p>
        <p className="text-sm text-gray-600">{s.title}</p>
      </div>
    ))}
  </div>
);

export default StatsCards;
