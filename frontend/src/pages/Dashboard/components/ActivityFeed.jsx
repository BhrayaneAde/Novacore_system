import React from "react";
import { UserPlus, FileText, Calendar, TrendingUp } from "lucide-react";

const activities = [
  {
    icon: UserPlus,
    color: "bg-blue-50 text-blue-600",
    title: "Nouvel employé ajouté",
    description: "Thomas Martin a rejoint l'équipe Développement",
    time: "Il y a 2 heures",
  },
  {
    icon: FileText,
    color: "bg-purple-50 text-purple-600",
    title: "Contrat signé",
    description: "Sophie Lefebvre - CDI Temps plein",
    time: "Il y a 4 heures",
  },
  {
    icon: Calendar,
    color: "bg-green-50 text-green-600",
    title: "Congé approuvé",
    description: "Lucas Bernard - 5 jours en août",
    time: "Hier",
  },
  {
    icon: TrendingUp,
    color: "bg-amber-50 text-amber-600",
    title: "Évaluation complétée",
    description: "Emma Rousseau - Performance Q2",
    time: "Il y a 2 jours",
  },
  {
    icon: UserPlus,
    color: "bg-blue-50 text-blue-600",
    title: "Candidature reçue",
    description: "Poste: Développeur Full Stack Senior",
    time: "Il y a 3 jours",
  },
];

const ActivityFeed = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Voir tout
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
            <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <activity.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 mb-1">
                {activity.title}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
