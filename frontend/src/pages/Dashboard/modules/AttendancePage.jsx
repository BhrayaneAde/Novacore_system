import React from "react";
import { useHRStore } from "../../../store/useHRStore";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import Badge from "../../../components/ui/Badge";
import { CalendarCheck, Clock, TrendingUp } from "lucide-react";

const AttendancePage = () => {
  const { leaveRequests, updateLeaveRequest } = useHRStore();

  const handleApprove = (id) => {
    updateLeaveRequest(id, { status: "approved" });
  };

  const handleReject = (id) => {
    updateLeaveRequest(id, { status: "rejected" });
  };

  const columns = [
    {
      header: "Employé",
      accessor: "employeeName",
      render: (row) => <span className="text-sm font-medium text-gray-900">{row.employeeName}</span>,
    },
    {
      header: "Type",
      accessor: "type",
      render: (row) => (
        <Badge variant={row.type === "vacation" ? "info" : "warning"}>
          {row.type === "vacation" ? "Vacances" : "Maladie"}
        </Badge>
      ),
    },
    {
      header: "Début",
      accessor: "startDate",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.startDate).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      header: "Fin",
      accessor: "endDate",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.endDate).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      header: "Jours",
      accessor: "days",
      render: (row) => <span className="text-sm font-medium text-gray-900">{row.days} jours</span>,
    },
    {
      header: "Statut",
      accessor: "status",
      render: (row) => {
        const variants = {
          pending: "warning",
          approved: "success",
          rejected: "danger",
        };
        const labels = {
          pending: "En attente",
          approved: "Approuvé",
          rejected: "Rejeté",
        };
        return <Badge variant={variants[row.status]}>{labels[row.status]}</Badge>;
      },
    },
    {
      header: "Actions",
      render: (row) =>
        row.status === "pending" ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(row.id)}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Approuver
            </button>
            <button
              onClick={() => handleReject(row.id)}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Rejeter
            </button>
          </div>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        ),
    },
  ];

  const stats = [
    {
      title: "Taux de présence",
      value: "96.8%",
      icon: CalendarCheck,
      color: "bg-green-50 text-green-600",
      trend: "+2.5%",
    },
    {
      title: "Demandes en attente",
      value: leaveRequests.filter((r) => r.status === "pending").length,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Congés ce mois",
      value: leaveRequests.length,
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2 tracking-tight">Présence & Congés</h1>
          <p className="text-gray-600">Gérez les présences et validez les demandes de congés</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  {stat.trend && (
                    <p className="text-xs text-green-600 font-medium mt-1">{stat.trend}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card title="Demandes de congés">
          <Table columns={columns} data={leaveRequests} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;
