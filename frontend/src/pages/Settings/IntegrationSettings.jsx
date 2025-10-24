import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { ArrowLeft, Plug } from "lucide-react";

const IntegrationSettings = () => {
  const navigate = useNavigate();

  const integrations = [
    {
      name: "Slack",
      description: "Notifications et communication d'équipe",
      icon: "💬",
      status: "connected",
      color: "bg-purple-50",
    },
    {
      name: "Google Workspace",
      description: "Synchronisation calendrier et emails",
      icon: "📧",
      status: "connected",
      color: "bg-blue-50",
    },
    {
      name: "Microsoft Teams",
      description: "Collaboration et réunions",
      icon: "👥",
      status: "disconnected",
      color: "bg-indigo-50",
    },
    {
      name: "Dropbox",
      description: "Stockage et partage de fichiers",
      icon: "📁",
      status: "disconnected",
      color: "bg-cyan-50",
    },
    {
      name: "Zapier",
      description: "Automatisation de workflows",
      icon: "⚡",
      status: "disconnected",
      color: "bg-orange-50",
    },
    {
      name: "GitHub",
      description: "Gestion de code et projets",
      icon: "🐙",
      status: "disconnected",
      color: "bg-gray-50",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/app/settings")}>
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
              <Plug className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Intégrations</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <Card key={index} className={integration.color}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{integration.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <Badge variant={integration.status === "connected" ? "success" : "default"}>
                    {integration.status === "connected" ? "Connecté" : "Non connecté"}
                  </Badge>
                  <Button
                    variant={integration.status === "connected" ? "outline" : "primary"}
                    size="sm"
                  >
                    {integration.status === "connected" ? "Déconnecter" : "Connecter"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IntegrationSettings;
