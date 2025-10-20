import React from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../../../components/ui/Badge";
import { Mail, Phone, Briefcase } from "lucide-react";

const CandidateCard = ({ candidate }) => {
  const navigate = useNavigate();

  const statusVariants = {
    screening: "warning",
    interview: "info",
    offer: "success",
    rejected: "danger",
  };

  const statusLabels = {
    screening: "Présélection",
    interview: "Entretien",
    offer: "Offre",
    rejected: "Rejeté",
  };

  return (
    <div
      onClick={() => navigate(`/app/recruitment/candidates/${candidate.id}`)}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start gap-4 mb-4">
        <img
          src={candidate.avatar}
          alt={candidate.name}
          className="w-16 h-16 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
            <Badge variant={statusVariants[candidate.status]}>
              {statusLabels[candidate.status]}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-3">{candidate.position}</p>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              <span>{candidate.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Phone className="w-4 h-4" />
              <span>{candidate.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Briefcase className="w-4 h-4" />
              <span>{candidate.experience} d'expérience</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          Candidature le {new Date(candidate.appliedDate).toLocaleDateString("fr-FR")}
        </span>
      </div>
    </div>
  );
};

export default CandidateCard;
