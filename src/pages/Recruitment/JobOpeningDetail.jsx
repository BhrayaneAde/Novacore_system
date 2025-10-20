import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHRStore } from "../../store/useHRStore";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { ArrowLeft, Edit, MapPin, Briefcase, Users } from "lucide-react";

const JobOpeningDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobOpenings } = useHRStore();
  
  const job = jobOpenings.find((j) => j.id === parseInt(id));

  if (!job) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Offre non trouvée</h2>
          <Button onClick={() => navigate("/app/recruitment")} className="mt-4">
            Retour
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/app/recruitment")}>
              Retour
            </Button>
            <h1 className="text-3xl font-semibold tracking-tight">Détail de l'offre</h1>
          </div>
          <Button icon={Edit}>Modifier</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">{job.title}</h2>
                  <Badge variant={job.status === "open" ? "success" : "default"}>
                    {job.status === "open" ? "Ouvert" : "Fermé"}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">{job.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{job.applicants} candidatures</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description du poste</h3>
                <p className="text-gray-600">
                  Nous recherchons un professionnel talentueux pour rejoindre notre équipe {job.department}.
                  Le candidat idéal aura une expérience significative dans le domaine et sera passionné par l'innovation.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Compétences requises</h3>
                <div className="flex flex-wrap gap-2">
                  {["React", "Node.js", "TypeScript", "MongoDB", "AWS"].map((skill, index) => (
                    <Badge key={index} variant="info">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Statistiques">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Candidatures reçues</p>
                <p className="text-2xl font-semibold text-gray-900">{job.applicants}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Date de publication</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(job.postedDate).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Type de contrat</p>
                <Badge variant="purple">{job.type}</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobOpeningDetail;
