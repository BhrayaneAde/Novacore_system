import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import { Building2, Users, Shield, Plug, Bell, Lock } from "lucide-react";

const SettingsOverview = () => {
  const navigate = useNavigate();

  const settingsCategories = [
    {
      icon: Building2,
      title: "Entreprise",
      description: "Informations générales de l'entreprise",
      path: "/app/settings/company",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Users,
      title: "Utilisateurs",
      description: "Gestion des utilisateurs et équipes",
      path: "/app/settings/users",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Shield,
      title: "Rôles & Permissions",
      description: "Configuration des accès et permissions",
      path: "/app/settings/roles",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Plug,
      title: "Intégrations",
      description: "Connectez vos outils favoris",
      path: "/app/settings/integrations",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Préférences de notifications",
      path: "/app/settings/notifications",
      color: "bg-pink-50 text-pink-600",
    },
    {
      icon: Lock,
      title: "Sécurité",
      description: "Paramètres de sécurité et authentification",
      path: "/app/settings/security",
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2 tracking-tight">Paramètres</h1>
          <p className="text-gray-600">Configurez votre plateforme NovaCore</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCategories.map((category, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(category.path)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsOverview;
