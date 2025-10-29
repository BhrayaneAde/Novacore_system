import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";
import { FilePlus, Download, Eye } from "lucide-react";

const ContractsList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-96">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  const contracts = [
    {
      id: 1,
      employeeName: "Jean Dupont",
      position: "Développeur Senior",
      type: "CDI",
      startDate: "2023-01-15",
      endDate: null,
      salary: "3500€",
      status: "active",
    },
    {
      id: 2,
      employeeName: "Marie Martin",
      position: "Chargée RH",
      type: "CDI",
      startDate: "2022-06-01",
      endDate: null,
      salary: "2800€",
      status: "active",
    },
    {
      id: 3,
      employeeName: "Pierre Bernard",
      position: "Stagiaire Marketing",
      type: "STAGE",
      startDate: "2024-09-01",
      endDate: "2025-02-28",
      salary: "600€",
      status: "active",
    },
    {
      id: 4,
      employeeName: "Sophie Dubois",
      position: "Chef de Projet",
      type: "CDD",
      startDate: "2023-03-01",
      endDate: "2024-02-29",
      salary: "3200€",
      status: "expired",
    },
  ];

  const getStatusBadge = (status) => {
    const variants = {
      active: "success",
      expired: "warning",
      terminated: "danger",
    };
    const labels = {
      active: "Actif",
      expired: "Expiré",
      terminated: "Résilié",
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getTypeBadge = (type) => {
    const colors = {
      CDI: "bg-green-100 text-green-700",
      CDD: "bg-secondary-100 text-blue-700",
      STAGE: "bg-purple-100 text-purple-700",
      ALTERNANCE: "bg-orange-100 text-orange-700",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[type]}`}>
        {type}
      </span>
    );
  };

  const columns = [
    {
      header: "Employé",
      accessor: "employeeName",
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{row.employeeName}</p>
          <p className="text-sm text-gray-500">{row.position}</p>
        </div>
      ),
    },
    {
      header: "Type",
      accessor: "type",
      render: (row) => getTypeBadge(row.type),
    },
    {
      header: "Date de début",
      accessor: "startDate",
      render: (row) => (
        <span className="text-sm text-gray-900">
          {new Date(row.startDate).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      header: "Date de fin",
      accessor: "endDate",
      render: (row) => (
        <span className="text-sm text-gray-900">
          {row.endDate ? new Date(row.endDate).toLocaleDateString("fr-FR") : "—"}
        </span>
      ),
    },
    {
      header: "Salaire",
      accessor: "salary",
      render: (row) => <span className="text-sm text-gray-900">{row.salary}</span>,
    },
    {
      header: "Statut",
      accessor: "status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/app/contracts/${row.id}`)}
            className="text-secondary-600 hover:text-secondary-700"
            title="Voir"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="text-green-600 hover:text-green-700"
            title="Télécharger"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-2 tracking-tight">Tous les Contrats</h1>
            <p className="text-gray-600">{contracts.length} contrats au total</p>
          </div>
          <Button icon={FilePlus} onClick={() => navigate("/app/contracts/new")}>
            Nouveau Contrat
          </Button>
        </div>

        <Card>
          <Table
            columns={columns}
            data={contracts}
            onRowClick={(row) => navigate(`/app/contracts/${row.id}`)}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ContractsList;
