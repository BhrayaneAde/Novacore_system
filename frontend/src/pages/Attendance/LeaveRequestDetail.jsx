import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHRStore } from "../../store/useHRStore";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { ArrowLeft, Check, X, Calendar, User } from "lucide-react";

const LeaveRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leaveRequests, updateLeaveRequest } = useHRStore();
  
  const request = leaveRequests.find((req) => req.id === parseInt(id));

  if (!request) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Demande non trouvée</h2>
          <Button onClick={() => navigate("/app/attendance")} className="mt-4">
            Retour
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleApprove = () => {
    updateLeaveRequest(parseInt(id), { status: "approved" });
    navigate("/app/attendance");
  };

  const handleReject = () => {
    updateLeaveRequest(parseInt(id), { status: "rejected" });
    navigate("/app/attendance");
  };

  const variants = { pending: "warning", approved: "success", rejected: "danger" };
  const labels = { pending: "En attente", approved: "Approuvé", rejected: "Rejeté" };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/app/attendance")}>
              Retour
            </Button>
            <h1 className="text-3xl font-semibold tracking-tight">Détail de la demande</h1>
          </div>
          {request.status === "pending" && (
            <div className="flex gap-3">
              <Button variant="danger" icon={X} onClick={handleReject}>
                Rejeter
              </Button>
              <Button variant="success" icon={Check} onClick={handleApprove}>
                Approuver
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Informations de la demande</h2>
                <Badge variant={variants[request.status]}>{labels[request.status]}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Employé</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{request.employeeName}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Type de congé</p>
                  <Badge variant={request.type === "vacation" ? "info" : "warning"}>
                    {request.type === "vacation" ? "Vacances" : "Maladie"}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Date de début</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">
                      {new Date(request.startDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Date de fin</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">
                      {new Date(request.endDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Nombre de jours</p>
                  <p className="text-sm text-gray-900">{request.days} jours</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Date de demande</p>
                  <p className="text-sm text-gray-900">
                    {new Date(request.requestDate).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Motif</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">{request.reason}</p>
              </div>
            </div>
          </Card>

          <Card title="Informations complémentaires">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Solde de congés restant</p>
                <p className="text-2xl font-semibold text-gray-900">15 jours</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Congés pris cette année</p>
                <p className="text-lg font-medium text-gray-900">10 jours</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Dernière absence</p>
                <p className="text-sm text-gray-900">15-20 Août 2025</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeaveRequestDetail;
