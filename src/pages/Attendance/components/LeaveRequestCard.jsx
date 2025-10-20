import React from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../../../components/ui/Badge";
import { Calendar, User } from "lucide-react";

const LeaveRequestCard = ({ request }) => {
  const navigate = useNavigate();

  const statusVariants = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
  };

  const statusLabels = {
    pending: "En attente",
    approved: "Approuvé",
    rejected: "Rejeté",
  };

  return (
    <div
      onClick={() => navigate(`/app/attendance/requests/${request.id}`)}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{request.employeeName}</h3>
            <p className="text-sm text-gray-600">
              {request.type === "vacation" ? "Vacances" : "Maladie"}
            </p>
          </div>
        </div>
        <Badge variant={statusVariants[request.status]}>
          {statusLabels[request.status]}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(request.startDate).toLocaleDateString("fr-FR")} - {new Date(request.endDate).toLocaleDateString("fr-FR")}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          <span className="font-medium">{request.days} jours</span> demandés
        </p>
      </div>
    </div>
  );
};

export default LeaveRequestCard;
