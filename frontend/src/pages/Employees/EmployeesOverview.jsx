import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHRStore } from "../../store/useHRStore";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import EmployeeStatsCards from "./components/EmployeeStatsCards";
import { Users, Calendar, Clock, FileText, UserPlus, CalendarPlus, TrendingUp } from "lucide-react";

const EmployeesOverview = () => {
  const navigate = useNavigate();
  const { employees, getEmployeeStats } = useHRStore();
  const [activeTab, setActiveTab] = useState("overview");
  const stats = getEmployeeStats();

  const employeeModules = [
    {
      title: "Liste des Employés",
      description: "Gérer tous vos employés",
      icon: Users,
      color: "bg-secondary-500",
      path: "/app/employees/list",
      count: `${stats.total} employés`
    },
    {
      title: "Ajouter un Employé",
      description: "Créer un nouveau profil",
      icon: UserPlus,
      color: "bg-green-500",
      path: "/app/employees/new",
    },
    {
      title: "Documents",
      description: "Contrats et documents",
      icon: FileText,
      color: "bg-purple-500",
      path: "/app/employees/documents",
    },
  ];

  const attendanceModules = [
    {
      title: "Présence & Pointage",
      description: "Suivi du temps de travail",
      icon: Clock,
      color: "bg-indigo-500",
      path: "/app/employees/attendance/tracking",
      count: `${stats.active} présents aujourd'hui`
    },
    {
      title: "Calendrier",
      description: "Vue d'ensemble des présences",
      icon: Calendar,
      color: "bg-cyan-500",
      path: "/app/employees/attendance/calendar",
    },
    {
      title: "Demandes de Congés",
      description: "Gérer les congés",
      icon: CalendarPlus,
      color: "bg-orange-500",
      path: "/app/employees/attendance/leaves",
      count: "8 en attente"
    },
  ];

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: Users },
    { id: "employees", label: "Employés", icon: Users },
    { id: "attendance", label: "Présence & Congés", icon: Calendar },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold mb-2 tracking-tight">Gestion du Personnel</h1>
          <p className="text-gray-600">Gérez vos employés, présences et congés</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-secondary-500 text-secondary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Statistiques */}
            <EmployeeStatsCards />
            
            {/* Répartition par département */}
            <Card title="Répartition par département">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(stats.byDepartment).map(([dept, count]) => (
                  <div key={dept} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600">{dept}</p>
                  </div>
                ))}
              </div>
            </Card>
            {/* Actions rapides */}
            <Card title="Actions rapides">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate('/app/employees/new')}
                  className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <UserPlus className="w-8 h-8 text-secondary-600 mb-2" />
                  <p className="font-medium text-gray-900">Nouvel employé</p>
                  <p className="text-sm text-gray-500">Ajouter un employé</p>
                </button>
                <button
                  onClick={() => navigate('/app/employees/list')}
                  className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="w-8 h-8 text-green-600 mb-2" />
                  <p className="font-medium text-gray-900">Liste complète</p>
                  <p className="text-sm text-gray-500">Voir tous les employés</p>
                </button>
                <button
                  onClick={() => navigate('/app/employees/attendance/leaves')}
                  className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CalendarPlus className="w-8 h-8 text-orange-600 mb-2" />
                  <p className="font-medium text-gray-900">Congés</p>
                  <p className="text-sm text-gray-500">Gérer les congés</p>
                </button>
                <button
                  onClick={() => navigate('/app/performance/reports')}
                  className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
                  <p className="font-medium text-gray-900">Rapports</p>
                  <p className="text-sm text-gray-500">Statistiques RH</p>
                </button>
              </div>
            </Card>
            
            {/* Section Employés */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-secondary-600" />
                Gestion des Employés
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {employeeModules.map((module, index) => (
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
                        <h3 className="font-semibold text-gray-900 mb-1">{module.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                        {module.count && (
                          <p className="text-xs font-medium text-secondary-600">{module.count}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Section Présence & Congés */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-indigo-600" />
                Présence & Congés
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {attendanceModules.map((module, index) => (
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
                        <h3 className="font-semibold text-gray-900 mb-1">{module.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                        {module.count && (
                          <p className="text-xs font-medium text-indigo-600">{module.count}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "employees" && (
          <div className="grid md:grid-cols-3 gap-6">
            {employeeModules.map((module, index) => (
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
                    <h3 className="font-semibold text-gray-900 mb-1">{module.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                    {module.count && (
                      <p className="text-xs font-medium text-secondary-600">{module.count}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="grid md:grid-cols-3 gap-6">
            {attendanceModules.map((module, index) => (
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
                    <h3 className="font-semibold text-gray-900 mb-1">{module.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                    {module.count && (
                      <p className="text-xs font-medium text-indigo-600">{module.count}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployeesOverview;
