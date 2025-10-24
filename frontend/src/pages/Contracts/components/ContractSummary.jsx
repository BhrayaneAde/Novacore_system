import React from "react";
import { FileText, User, Calendar, DollarSign, MapPin, Clock } from "lucide-react";

const ContractSummary = ({ contractData }) => {
  const getContractTypeName = (type) => {
    const types = {
      CDI: "Contrat à Durée Indéterminée",
      CDD: "Contrat à Durée Déterminée",
      STAGE: "Convention de Stage",
      ALTERNANCE: "Contrat d'Alternance",
      INTERIM: "Contrat d'Intérim",
      FREELANCE: "Contrat Freelance",
    };
    return types[type] || type;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const summaryItems = [
    {
      icon: FileText,
      label: "Type de contrat",
      value: getContractTypeName(contractData.contractType),
      color: "text-blue-600",
    },
    {
      icon: User,
      label: "Employé",
      value: contractData.employeeName,
      color: "text-purple-600",
    },
    {
      icon: FileText,
      label: "Poste",
      value: `${contractData.position} - ${contractData.department}`,
      color: "text-green-600",
    },
    {
      icon: DollarSign,
      label: "Rémunération",
      value: `${contractData.salary}€/mois - ${contractData.workingHours}h/semaine`,
      color: "text-orange-600",
    },
    {
      icon: Calendar,
      label: "Dates",
      value: contractData.endDate
        ? `Du ${formatDate(contractData.startDate)} au ${formatDate(contractData.endDate)}`
        : `À partir du ${formatDate(contractData.startDate)}`,
      color: "text-cyan-600",
    },
    {
      icon: MapPin,
      label: "Lieu de travail",
      value: contractData.workplace,
      color: "text-indigo-600",
    },
  ];

  if (contractData.trialPeriod) {
    summaryItems.push({
      icon: Clock,
      label: "Période d'essai",
      value: `${contractData.trialPeriod} mois`,
      color: "text-pink-600",
    });
  }

  return (
    <div className="space-y-4">
      {summaryItems.map((item, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className={`${item.color} mt-1`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">{item.label}</h3>
              <p className="text-gray-900">{item.value}</p>
            </div>
          </div>
        </div>
      ))}

      {contractData.specificClauses && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Clauses spécifiques</h3>
              <p className="text-sm text-blue-800">{contractData.specificClauses}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractSummary;
