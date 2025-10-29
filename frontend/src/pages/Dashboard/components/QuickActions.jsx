import React from "react";
import { UserPlus, FileText, Calendar, DollarSign } from "lucide-react";

const actions = [
  {
    icon: UserPlus,
    label: "Ajouter un employé",
    color: "bg-secondary-600 hover:bg-secondary-700",
  },
  {
    icon: FileText,
    label: "Générer un contrat",
    color: "bg-purple-600 hover:bg-purple-700",
  },
  {
    icon: Calendar,
    label: "Planifier un entretien",
    color: "bg-green-600 hover:bg-green-700",
  },
  {
    icon: DollarSign,
    label: "Traiter la paie",
    color: "bg-amber-600 hover:bg-amber-700",
  },
];

const QuickActions = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Actions rapides</h2>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`w-full ${action.color} text-white rounded-lg px-4 py-3 flex items-center gap-3 transition-colors text-sm font-medium`}
          >
            <action.icon className="w-5 h-5" />
            {action.label}
          </button>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Raccourcis</h3>
        <div className="space-y-2">
          <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
            → Rapports mensuels
          </a>
          <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
            → Documents RH
          </a>
          <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
            → Politiques d'entreprise
          </a>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
