import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import { FileText, FilePlus, Users, TrendingUp, FileCheck, FileSearch } from "lucide-react";

const ContractsOverview = () => {
  const navigate = useNavigate();

  const contractModules = [
    {
      title: "Nouveau Contrat",
      description: "Créer un contrat pour un employé",
      icon: FilePlus,
      color: "bg-green-500",
      path: "/app/contracts/new",
      badge: "Création rapide"
    },
    {
      title: "Promotion / Avenant",
      description: "Modifier un contrat existant",
      icon: TrendingUp,
      color: "bg-purple-500",
      path: "/app/contracts/promotion",
      badge: "Avenant"
    },
    {
      title: "Tous les Contrats",
      description: "Liste complète des contrats",
      icon: FileText,
      color: "bg-secondary-500",
      path: "/app/contracts/list",
      count: "234 contrats"
    },
    {
      title: "Contrats Actifs",
      description: "Contrats en cours",
      icon: FileCheck,
      color: "bg-cyan-500",
      path: "/app/contracts/active",
      count: "189 actifs"
    },
    {
      title: "Contrats Expirés",
      description: "Contrats terminés",
      icon: FileSearch,
      color: "bg-orange-500",
      path: "/app/contracts/expired",
      count: "45 expirés"
    },
    {
      title: "Par Employé",
      description: "Rechercher par employé",
      icon: Users,
      color: "bg-indigo-500",
      path: "/app/contracts/by-employee",
    },
  ];

  const stats = [
    { label: "Total Contrats", value: "234", color: "text-secondary-600" },
    { label: "CDI", value: "156", color: "text-green-600" },
    { label: "CDD", value: "52", color: "text-orange-600" },
    { label: "Stage", value: "26", color: "text-purple-600" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2 tracking-tight">Gestion des Contrats</h1>
          <p className="text-gray-600">Créez, gérez et suivez tous vos contrats de travail</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {contractModules.map((module, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(module.path)}
            >
              <div className="flex items-start gap-4">
                <div className={`${module.color} p-3 rounded-lg`}>
                  <module.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                    {module.badge && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {module.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                  {module.count && (
                    <p className="text-xs font-medium text-secondary-600">{module.count}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-secondary-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Génération automatique de contrats</h4>
              <p className="text-sm text-blue-700">
                Choisissez un template (CDI, CDD, Stage, Alternance, etc.) et générez automatiquement 
                un contrat personnalisé en quelques clics.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ContractsOverview;
