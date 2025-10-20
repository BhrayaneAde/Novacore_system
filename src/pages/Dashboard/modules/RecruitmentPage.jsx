import React, { useState } from "react";
import { useHRStore } from "../../../store/useHRStore";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { UserPlus, Briefcase, Users } from "lucide-react";

const RecruitmentPage = () => {
  const { jobOpenings, candidates, updateCandidate } = useHRStore();
  const [activeTab, setActiveTab] = useState("candidates");

  const candidateColumns = [
    {
      header: "Candidat",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt={row.name} className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-sm font-medium text-gray-900">{row.name}</p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Poste",
      accessor: "position",
      render: (row) => <span className="text-sm text-gray-900">{row.position}</span>,
    },
    {
      header: "Expérience",
      accessor: "experience",
      render: (row) => <Badge variant="info">{row.experience}</Badge>,
    },
    {
      header: "Statut",
      accessor: "status",
      render: (row) => {
        const variants = {
          screening: "warning",
          interview: "info",
          offer: "success",
          rejected: "danger",
        };
        const labels = {
          screening: "Présélection",
          interview: "Entretien",
          offer: "Offre",
          rejected: "Rejeté",
        };
        return <Badge variant={variants[row.status]}>{labels[row.status]}</Badge>;
      },
    },
    {
      header: "Date de candidature",
      accessor: "appliedDate",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.appliedDate).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Voir profil
        </button>
      ),
    },
  ];

  const jobColumns = [
    {
      header: "Poste",
      accessor: "title",
      render: (row) => <span className="text-sm font-medium text-gray-900">{row.title}</span>,
    },
    {
      header: "Département",
      accessor: "department",
      render: (row) => <Badge variant="info">{row.department}</Badge>,
    },
    {
      header: "Localisation",
      accessor: "location",
      render: (row) => <span className="text-sm text-gray-600">{row.location}</span>,
    },
    {
      header: "Type",
      accessor: "type",
      render: (row) => <Badge variant="purple">{row.type}</Badge>,
    },
    {
      header: "Candidatures",
      accessor: "applicants",
      render: (row) => (
        <span className="text-sm font-medium text-gray-900">{row.applicants}</span>
      ),
    },
    {
      header: "Statut",
      accessor: "status",
      render: (row) => (
        <Badge variant={row.status === "open" ? "success" : "default"}>
          {row.status === "open" ? "Ouvert" : "Fermé"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Gérer
        </button>
      ),
    },
  ];

  const openJobs = jobOpenings.filter((job) => job.status === "open").length;
  const totalApplicants = jobOpenings.reduce((sum, job) => sum + job.applicants, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-2 tracking-tight">Recrutement</h1>
            <p className="text-gray-600">Gérez vos offres d'emploi et candidatures</p>
          </div>
          <Button icon={Briefcase}>Nouvelle offre</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{openJobs}</p>
                <p className="text-sm text-gray-600">Postes ouverts</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{totalApplicants}</p>
                <p className="text-sm text-gray-600">Candidatures totales</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{candidates.length}</p>
                <p className="text-sm text-gray-600">Candidats actifs</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("candidates")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "candidates"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Candidats ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "jobs"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Offres d'emploi ({jobOpenings.length})
          </button>
        </div>

        <Card>
          {activeTab === "candidates" ? (
            <Table columns={candidateColumns} data={candidates} />
          ) : (
            <Table columns={jobColumns} data={jobOpenings} />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RecruitmentPage;
