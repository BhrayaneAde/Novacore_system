import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import ActivityFeed from "./components/ActivityFeed";
import QuickActions from "./components/QuickActions";
import DepartmentTable from "./components/DepartmentTable";
import BarChart from "../../components/charts/BarChart";
import PieChart from "../../components/charts/PieChart";
import LineChart from "../../components/charts/LineChart";
import { CheckSquare, Target, Calendar, Clock, FileText } from "lucide-react";

// Import modules and pages
import EmployeePayslips from "../Employees/EmployeePayslips";
import EmployeeLeaves from "../Employees/EmployeeLeaves";
import EmployeeTimesheet from "../Employees/EmployeeTimesheet";
import EmployeeTasks from "../Employees/EmployeeTasks";
import EmployeeProfile from "../Employees/EmployeeProfile";
import EmployeeDocuments from "../Employees/EmployeeDocuments";
import EmployeesPage from "./modules/EmployeesPage";
import PayrollPage from "./modules/PayrollPage";
import PerformancePage from "./modules/PerformancePage";
import RecruitmentPage from "./modules/RecruitmentPage";
import SettingsPage from "./modules/SettingsPage";

const Dashboard = () => {
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderDashboard = () => {
    switch (currentUser?.role) {
      case 'employer':
        return (
          <div className="p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Vue d'ensemble
              </h1>
              <p className="text-gray-500">Tableau de bord direction</p>
            </div>
            
            <StatsCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LineChart 
                  title="Revenus mensuels" 
                  color="blue"
                  data={[
                    {label: 'Jul', value: 45000},
                    {label: 'Aoû', value: 52000},
                    {label: 'Sep', value: 48000},
                    {label: 'Oct', value: 61000},
                    {label: 'Nov', value: 55000},
                    {label: 'Déc', value: 67000}
                  ]}
                />
              </div>
              <QuickActions />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChart 
                title="Performance départements" 
                color="purple"
                data={[
                  {label: 'Commercial', value: 92},
                  {label: 'Production', value: 88},
                  {label: 'Marketing', value: 85},
                  {label: 'Administration', value: 95}
                ]}
              />
              <ActivityFeed />
            </div>
          </div>
        );
      case 'hr_admin':
        return (
          <div className="p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Ressources Humaines
              </h1>
              <p className="text-gray-500">Gestion des employés</p>
            </div>
            
            <StatsCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChart 
                title="Effectifs par service" 
                color="blue"
                data={[
                  {label: 'Commercial', value: 12},
                  {label: 'Production', value: 6},
                  {label: 'Marketing', value: 8},
                  {label: 'Administration', value: 10}
                ]}
              />
              <PieChart 
                title="Répartition contrats"
                data={[
                  {label: 'CDI', value: 35},
                  {label: 'CDD', value: 8},
                  {label: 'Stage', value: 4},
                  {label: 'Freelance', value: 3}
                ]}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LineChart 
                  title="Recrutements 2023" 
                  color="green"
                  data={[
                    {label: 'Jan', value: 2},
                    {label: 'Fév', value: 1},
                    {label: 'Mar', value: 4},
                    {label: 'Avr', value: 3},
                    {label: 'Mai', value: 5},
                    {label: 'Jun', value: 2}
                  ]}
                />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                    <p className="font-medium text-blue-900">Congés en attente</p>
                    <p className="text-sm text-blue-600">7 demandes</p>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                    <p className="font-medium text-green-900">Nouveaux CV</p>
                    <p className="text-sm text-green-600">3 candidatures</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'hr_user':
        return (
          <div className="p-8 space-y-8">
            <div>
              <h1 className="text-3xl font-semibold mb-2 tracking-tight">
                Tableau de bord RH
              </h1>
              <p className="text-gray-600">Suivi des employés</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold mb-2">Employés actifs</h3>
                <p className="text-3xl font-bold text-blue-600">42</p>
                <p className="text-sm text-gray-500">+2 ce mois</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold mb-2">Congés en attente</h3>
                <p className="text-3xl font-bold text-orange-600">7</p>
                <p className="text-sm text-gray-500">À approuver</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold mb-2">Présence aujourd'hui</h3>
                <p className="text-3xl font-bold text-green-600">38</p>
                <p className="text-sm text-gray-500">90% présents</p>
              </div>
            </div>
            <BarChart 
              title="Congés par mois" 
              color="blue"
              data={[
                {label: 'Jan', value: 15},
                {label: 'Fév', value: 12},
                {label: 'Mar', value: 18},
                {label: 'Avr', value: 22},
                {label: 'Mai', value: 25},
                {label: 'Jun', value: 20}
              ]}
            />
          </div>
        );
      case 'manager':
        return (
          <div className="p-8 space-y-8">
            <div>
              <h1 className="text-3xl font-semibold mb-2 tracking-tight">
                Tableau de bord Manager
              </h1>
              <p className="text-gray-600">Gestion de votre équipe</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold mb-2">Mon Équipe</h3>
                <p className="text-3xl font-bold text-blue-600">8</p>
                <p className="text-sm text-gray-500">Membres actifs</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold mb-2">Projets</h3>
                <p className="text-3xl font-bold text-green-600">5</p>
                <p className="text-sm text-gray-500">En cours</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold mb-2">Performance</h3>
                <p className="text-3xl font-bold text-purple-600">92%</p>
                <p className="text-sm text-gray-500">Objectifs atteints</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold mb-2">Congés</h3>
                <p className="text-3xl font-bold text-orange-600">3</p>
                <p className="text-sm text-gray-500">À approuver</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChart 
                title="Performance individuelle" 
                color="green"
                data={[
                  {label: 'Alice', value: 95},
                  {label: 'Bob', value: 88},
                  {label: 'Claire', value: 92},
                  {label: 'David', value: 85},
                  {label: 'Emma', value: 90}
                ]}
              />
              <LineChart 
                title="Productivité équipe" 
                color="purple"
                data={[
                  {label: 'Sem 1', value: 85},
                  {label: 'Sem 2', value: 88},
                  {label: 'Sem 3', value: 92},
                  {label: 'Sem 4', value: 89},
                  {label: 'Sem 5', value: 94}
                ]}
              />
            </div>
          </div>
        );
      case 'employee':
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="p-8">
              {/* Welcome Header */}
              {/* <div className="mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
                  <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Bonjour {currentUser?.name || 'Marie'} 😊</h1>
                    <p className="text-blue-100 text-lg">Nous sommes le {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <div className="mt-6 flex items-center gap-4">
                      <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2">
                        <p className="text-sm opacity-90">Température</p>
                        <p className="font-semibold">22°C</p>
                      </div>
                      <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2">
                        <p className="text-sm opacity-90">Statut</p>
                        <p className="font-semibold">En ligne</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setActiveTab('tasks')}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                      <CheckSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Mes Tâches</h3>
                    <p className="text-sm text-gray-600">3 en cours</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('leaves')}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Congés</h3>
                    <p className="text-sm text-gray-600">15j restants</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('timesheet')}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Pointage</h3>
                    <p className="text-sm text-gray-600">152h ce mois</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('documents')}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                      <FileText className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Documents</h3>
                    <p className="text-sm text-gray-600">8 fichiers</p>
                  </button>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Vue d'ensemble</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-2xl font-bold text-blue-600">15</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Congés restants</h3>
                    <p className="text-sm text-gray-600">Sur 25 jours annuels</p>
                    <div className="mt-3 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-green-600" />
                      </div>
                      <span className="text-2xl font-bold text-green-600">152h</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Heures ce mois</h3>
                    <p className="text-sm text-gray-600">Objectif: 160h</p>
                    <div className="mt-3 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '95%'}}></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <CheckSquare className="w-6 h-6 text-purple-600" />
                      </div>
                      <span className="text-2xl font-bold text-purple-600">3</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Tâches actives</h3>
                    <p className="text-sm text-gray-600">2 urgentes</p>
                    <div className="mt-3 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-orange-600" />
                      </div>
                      <span className="text-2xl font-bold text-orange-600">88%</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Performance</h3>
                    <p className="text-sm text-gray-600">Objectifs atteints</p>
                    <div className="mt-3 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{width: '88%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tasks & Schedule */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Urgent Tasks */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Tâches urgentes</h3>
                      <button 
                        onClick={() => setActiveTab('tasks')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Voir tout
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                        <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Finaliser rapport mensuel</h4>
                          <p className="text-sm text-gray-600">Échéance: 15 janvier 2024</p>
                        </div>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">Urgent</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Préparer présentation client</h4>
                          <p className="text-sm text-gray-600">Échéance: 18 janvier 2024</p>
                        </div>
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">Important</span>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Schedule */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Planning de la semaine</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-blue-600">LUN</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Réunion équipe</h4>
                          <p className="text-sm text-gray-600">9:00 - 10:30 • Salle de conférence</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-green-600">MER</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Entretien manager</h4>
                          <p className="text-sm text-gray-600">14:00 - 14:30 • Bureau manager</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-purple-600">VEN</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Présentation client</h4>
                          <p className="text-sm text-gray-600">15:00 - 16:00 • Visioconférence</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Activité récente</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckSquare className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Tâche terminée</p>
                          <p className="text-xs text-gray-600">Formation sécurité</p>
                          <p className="text-xs text-gray-400">Il y a 2h</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Document ajouté</p>
                          <p className="text-xs text-gray-600">Fiche de paie Décembre</p>
                          <p className="text-xs text-gray-400">Hier</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Congés approuvés</p>
                          <p className="text-xs text-gray-600">15-20 janvier</p>
                          <p className="text-xs text-gray-400">Il y a 3j</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Statistiques</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Présence ce mois</span>
                        <span className="font-semibold text-green-600">95%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tâches complétées</span>
                        <span className="font-semibold text-blue-600">24</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Formations suivies</span>
                        <span className="font-semibold text-purple-600">3</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Score performance</span>
                        <span className="font-semibold text-orange-600">88%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-8 space-y-8">
            <div>
              <h1 className="text-3xl font-semibold mb-2 tracking-tight">
                Tableau de bord
              </h1>
              <p className="text-gray-600">Vue d'ensemble</p>
            </div>
            <StatsCards />
          </div>
        );
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'tasks':
        return <EmployeeTasks />;
      case 'payslips':
        return <EmployeePayslips />;
      case 'leaves':
        return <EmployeeLeaves />;
      case 'timesheet':
        return <EmployeeTimesheet />;
      case 'profile':
        return <EmployeeProfile />;
      case 'documents':
        return <EmployeeDocuments />;
      case 'employees':
        return <EmployeesPage />;
      case 'payroll':
        return <PayrollPage />;
      case 'performance':
        return <PerformancePage />;
      case 'recruitment':
        return <RecruitmentPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <div className="p-8">
            <h1 className="text-2xl font-semibold">Page non trouvée</h1>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 ml-64">
        <Header />
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
