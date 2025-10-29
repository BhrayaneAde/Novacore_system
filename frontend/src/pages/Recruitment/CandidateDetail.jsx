import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHRStore } from "../../store/useHRStore";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { ArrowLeft, Mail, Phone, Calendar, Briefcase, Download } from "lucide-react";

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { candidates, updateCandidate } = useHRStore();
  
  const candidate = candidates.find((cand) => cand.id === parseInt(id));

  if (!candidate) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Candidat non trouvé</h2>
          <Button onClick={() => navigate("/app/recruitment")} className="mt-4">
            Retour
          </Button>
        </div>
      </DashboardLayout>
    );
  }

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
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/app/recruitment")}>
              Retour
            </Button>
            <h1 className="text-3xl font-semibold tracking-tight">Profil du candidat</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" icon={Download}>
              Télécharger CV
            </Button>
            <Button>Planifier entretien</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="flex items-start gap-6">
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-24 h-24 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-semibold text-gray-900">{candidate.name}</h2>
                  <Badge variant={statusVariants[candidate.status]}>
                    {statusLabels[candidate.status]}
                  </Badge>
                </div>
                <p className="text-lg text-gray-600 mb-4">{candidate.position}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{candidate.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">{candidate.experience} d'expérience</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Candidature le {new Date(candidate.appliedDate).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Actions">
            <div className="space-y-3">
              <Button 
                variant={candidate.status === "screening" ? "primary" : "outline"} 
                className="w-full"
                onClick={() => updateCandidate(parseInt(id), { status: "interview" })}
              >
                Passer en entretien
              </Button>
              <Button 
                variant={candidate.status === "interview" ? "success" : "outline"} 
                className="w-full"
                onClick={() => updateCandidate(parseInt(id), { status: "offer" })}
              >
                Faire une offre
              </Button>
              <Button 
                variant="danger" 
                className="w-full"
                onClick={() => updateCandidate(parseInt(id), { status: "rejected" })}
              >
                Rejeter
              </Button>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Compétences">
            <div className="flex flex-wrap gap-2">
              {["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker"].map((skill, index) => (
                <Badge key={index} variant="info">{skill}</Badge>
              ))}
            </div>
          </Card>

          <Card title="Parcours">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Développeur Senior</p>
                <p className="text-sm text-gray-600">TechCorp • 2020-2025</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Développeur Full Stack</p>
                <p className="text-sm text-gray-600">StartupXYZ • 2018-2020</p>
              </div>
            </div>
          </Card>

          <Card title="Formation">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">Master Informatique</p>
                <p className="text-sm text-gray-600">Université Paris • 2016-2018</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Licence Informatique</p>
                <p className="text-sm text-gray-600">Université Lyon • 2013-2016</p>
              </div>
            </div>
          </Card>

          <Card title="Notes">
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
              rows={4}
              placeholder="Ajouter des notes sur ce candidat..."
            />
            <Button size="sm" className="mt-3">Enregistrer</Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CandidateDetail;
