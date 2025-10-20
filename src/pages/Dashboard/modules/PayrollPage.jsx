import React from "react";
import { useHRStore } from "../../../store/useHRStore";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { DollarSign, Download, Send } from "lucide-react";

const PayrollPage = () => {
  const { payrollRecords } = useHRStore();

  const columns = [
    {
      header: "Employé",
      accessor: "employeeName",
      render: (row) => <span className="text-sm font-medium text-gray-900">{row.employeeName}</span>,
    },
    {
      header: "Période",
      accessor: "month",
      render: (row) => <span className="text-sm text-gray-600">{row.month}</span>,
    },
    {
      header: "Salaire de base",
      accessor: "baseSalary",
      render: (row) => (
        <span className="text-sm text-gray-900">
          {row.baseSalary.toLocaleString("fr-FR")} €
        </span>
      ),
    },
    {
      header: "Bonus",
      accessor: "bonus",
      render: (row) => (
        <span className="text-sm text-green-600 font-medium">
          +{row.bonus.toLocaleString("fr-FR")} €
        </span>
      ),
    },
    {
      header: "Déductions",
      accessor: "deductions",
      render: (row) => (
        <span className="text-sm text-red-600 font-medium">
          -{row.deductions.toLocaleString("fr-FR")} €
        </span>
      ),
    },
    {
      header: "Net à payer",
      accessor: "netSalary",
      render: (row) => (
        <span className="text-sm font-semibold text-gray-900">
          {row.netSalary.toLocaleString("fr-FR")} €
        </span>
      ),
    },
    {
      header: "Statut",
      accessor: "status",
      render: (row) => (
        <Badge variant={row.status === "processed" ? "success" : "warning"}>
          {row.status === "processed" ? "Traité" : "En attente"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            <Download className="w-4 h-4" />
          </button>
          {row.status === "pending" && (
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const totalPayroll = payrollRecords.reduce((sum, record) => sum + record.netSalary, 0);
  const processedCount = payrollRecords.filter((r) => r.status === "processed").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-2 tracking-tight">Paie & Avantages</h1>
            <p className="text-gray-600">Gérez les salaires et les avantages sociaux</p>
          </div>
          <Button icon={DollarSign}>Traiter la paie</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalPayroll.toLocaleString("fr-FR")} €
                </p>
                <p className="text-sm text-gray-600">Total ce mois</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {processedCount}/{payrollRecords.length}
                </p>
                <p className="text-sm text-gray-600">Salaires traités</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {payrollRecords.length - processedCount}
                </p>
                <p className="text-sm text-gray-600">En attente</p>
              </div>
            </div>
          </Card>
        </div>

        <Card title="Registre de paie - Octobre 2025">
          <Table columns={columns} data={payrollRecords} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PayrollPage;
