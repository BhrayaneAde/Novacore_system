import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHRStore } from "../../store/useHRStore";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";
import Tabs from "../../components/ui/Tabs";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { UserPlus, Briefcase, Users, Plus } from "lucide-react";

const RecruitmentOverview = () => {
  const navigate = useNavigate();
  const { jobOpenings, candidates } = useHRStore();
  const [activeTab, setActiveTab] = useState("candidates");
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

  const candidateColumns = [
    {
      header: "Candidat",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} name={row.name} size="md" />
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
      render: (row) => <StatusBadge variant="info">{row.experience}</StatusBadge>,
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
        return <StatusBadge status={row.status}>{labels[row.status]}</StatusBadge>;
      },
    },
    {
      header: "Actions",
      render: (row) => (
        <button
          onClick={() => navigate(`/app/recruitment/candidates/${row.id}`)}
          className="text-sm text-secondary-600 hover:text-secondary-700 font-medium"
        >
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
      render: (row) => <StatusBadge variant="info">{row.department}</StatusBadge>,
    },
    {
      header: "Type",
      accessor: "type",
      render: (row) => <StatusBadge variant="purple">{row.type}</StatusBadge>,
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
        <StatusBadge status={row.status === "open" ? "success" : "error"}>
          {row.status === "open" ? "Ouvert" : "Fermé"}
        </StatusBadge>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <button
          onClick={() => navigate(`/app/recruitment/jobs/${row.id}`)}
          className="text-sm text-secondary-600 hover:text-secondary-700 font-medium"
        >
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
          <Button icon={Plus} onClick={() => navigate("/app/recruitment/jobs/new")}>
            Nouvelle offre
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-secondary-600 rounded-lg flex items-center justify-center">
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

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          tabs={[
            { value: 'candidates', label: `Candidats (${candidates.length})` },
            { value: 'jobs', label: `Offres d'emploi (${jobOpenings.length})` }
          ]}
        />

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

export default RecruitmentOverview;
