import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import ThemeProvider from "../../components/ThemeProvider";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import ActivityFeed from "./components/ActivityFeed";
import QuickActions from "./components/QuickActions";
import DepartmentTable from "./components/DepartmentTable";
import BarChart from "../../components/charts/BarChart";
import PieChart from "../../components/charts/PieChart";
import LineChart from "../../components/charts/LineChart";
import { CheckSquare, Target, Calendar, Clock, FileText, Users, TrendingUp } from "lucide-react";
import { users, departments, managerActivities, hierarchicalMetrics } from "../../data/mockData";
import { tasks } from "../../data/tasks";

// Import modules and pages
import EmployeePayslips from "../Employees/EmployeePayslips";
import EmployeeLeaves from "../Employees/EmployeeLeaves";
import EmployeeTimesheet from "../Employees/EmployeeTimesheet";

import EmployeeProfile from "../Employees/EmployeeProfile";
import EmployeeDocuments from "../Employees/EmployeeDocuments";
import EmployeesPage from "./modules/EmployeesPage";
import PayrollPage from "./modules/PayrollPage";
import PerformancePage from "./modules/PerformancePage";
import RecruitmentPage from "./modules/RecruitmentPage";
import SettingsPage from "./modules/SettingsPage";
import ManagerNomination from "../Managers/ManagerNomination";
import ManagersList from "../Managers/ManagersList";
import TaskManagement from "../Tasks/TaskManagement";
import EmployeeEvaluation from "../Evaluations/EmployeeEvaluation";
import MyPerformance from "../Evaluations/MyPerformance";

const Dashboard = () => {
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderDashboard = () => {
    switch (currentUser?.role) {
      case 'employer':
        const employerMetrics = hierarchicalMetrics.employer;
        
        return (
          <div className="p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Vue d'ensemble Direction
              </h1>
              <p className="text-gray-500">Supervision complète • {employerMetrics.totalManagers} managers • {employerMetrics.totalEmployees} employés</p>
            </div>
            
            {/* Métriques consolidées */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Performance Globale</h3>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-green-600">{employerMetrics.avgPerformance}%</p>
                <p className="text-sm text-gray-500">Moyenne entreprise</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Tâches Complétées</h3>
                  <CheckSquare className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-blue-600">{employerMetrics.totalTasksCompleted}</p>
                <p className="text-sm text-gray-500">Ce mois</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Managers Actifs</h3>
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-purple-600">{employerMetrics.totalManagers}</p>
                <p className="text-sm text-gray-500">Départements gérés</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">En Attente</h3>
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-3xl font-bold text-orange-600">{employerMetrics.pendingApprovals}</p>
                <p className="text-sm text-gray-500">Approbations</p>
              </div>
            </div>
            
            {/* Activités des managers */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4">Activité des Managers</h3>
              <div className="space-y-4">
                {managerActivities.map(activity => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-medium">{activity.managerName}</h4>
                          <p className="text-sm text-gray-600">{activity.department} • {activity.teamSize} membres</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold">{activity.tasksCompleted}</p>
                        <p className="text-gray-600">Tâches</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{activity.teamPerformance}%</p>
                        <p className="text-gray-600">Performance</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-orange-600">{activity.pendingApprovals}</p>
                        <p className="text-gray-600">En attente</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChart 
                title="Performance par département" 
                color="purple"
                data={employerMetrics.departmentPerformance.map(d => ({label: d.name, value: d.performance}))}
              />
              <LineChart 
                title="Évolution revenus" 
                color="blue"
                data={[
                  {label: 'Jul', value: 45000},
                  {label: 'Aoû', value: 52000},
                  {label: 'Sep', value: 48000},
                  {label: 'Oct', value: 61000},
                  {label: 'Nov', value: 55000}
                ]}
              />
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
              <div className="bg-white p-6 rounded-lg shadow-sm">
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
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">Employés actifs</h3>
                <p className="text-3xl font-bold text-blue-600">42</p>
                <p className="text-sm text-gray-500">+2 ce mois</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">Congés en attente</h3>
                <p className="text-3xl font-bold text-orange-600">7</p>
                <p className="text-sm text-gray-500">À approuver</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
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
      case 'senior_manager':
        const managerData = users.find(u => u.id === currentUser?.id);
        const managerActivity = managerActivities.find(a => a.managerId === currentUser?.id);
        const myDepartments = departments.filter(d => managerData?.departmentIds?.includes(d.id));
        const myTasks = tasks.filter(t => t.assignedBy === currentUser?.id);
        const isSeniorManager = currentUser?.role === 'senior_manager';
        
        return (
          <div className="p-8 space-y-8">
            <div>
              <h1 className="text-3xl font-semibold mb-2 tracking-tight">
                {isSeniorManager ? 'Tableau de bord Senior Manager' : 'Tableau de bord Manager'}
              </h1>
              <p className="text-gray-600">
                {managerData?.departments?.join(' + ') || 'Gestion de votre équipe'}
                {isSeniorManager && ` • Supervision: ${managerData?.subordinates?.length || 0} manager(s)`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Mon Équipe</h3>
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-blue-600">{managerActivity?.teamSize || 0}</p>
                <p className="text-sm text-gray-500">Membres {isSeniorManager ? '(direct + indirect)' : 'actifs'}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Tâches</h3>
                  <CheckSquare className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-green-600">{managerActivity?.tasksCompleted || 0}</p>
                <p className="text-sm text-gray-500">Complétées ce mois</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Performance</h3>
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-purple-600">{managerActivity?.teamPerformance || 0}%</p>
                <p className="text-sm text-gray-500">Moyenne équipe</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">En attente</h3>
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-3xl font-bold text-orange-600">{managerActivity?.pendingApprovals || 0}</p>
                <p className="text-sm text-gray-500">Approbations</p>
              </div>
            </div>
            
            {/* Activités récentes */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4">Activités récentes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {managerActivity?.activities?.map((activity, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{activity.count}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance par département */}
              <BarChart 
                title={isSeniorManager ? "Performance départements" : "Performance équipe"} 
                color="green"
                data={isSeniorManager ? 
                  hierarchicalMetrics.employer.departmentPerformance.map(d => ({label: d.name, value: d.performance})) :
                  myDepartments.map(d => ({label: d.name, value: parseInt(d.performance.replace('%', '').replace('+', ''))}))
                }
              />
              
              {/* Évolution mensuelle */}
              <LineChart 
                title="Évolution performance" 
                color="purple"
                data={[
                  {label: 'Jan', value: 82},
                  {label: 'Fév', value: 85},
                  {label: 'Mar', value: 88},
                  {label: 'Avr', value: 86},
                  {label: 'Mai', value: managerActivity?.teamPerformance || 90}
                ]}
              />
            </div>
            
            {/* Section spéciale pour Senior Manager */}
            {isSeniorManager && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Supervision Managers</h3>
                <div className="space-y-4">
                  {managerActivities.filter(a => managerData?.subordinates?.includes(a.managerId)).map(activity => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{activity.managerName}</h4>
                        <p className="text-sm text-gray-600">{activity.department} • {activity.teamSize} membres</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{activity.teamPerformance}%</p>
                        <p className="text-sm text-gray-600">{activity.tasksCompleted} tâches</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'employee':
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="p-8">
              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setActiveTab('task-management')}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                      <CheckSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Mes Tâches</h3>
                    <p className="text-sm text-gray-600">3 en cours</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('leaves')}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Congés</h3>
                    <p className="text-sm text-gray-600">15j restants</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('timesheet')}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Pointage</h3>
                    <p className="text-sm text-gray-600">152h ce mois</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('documents')}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
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
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
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
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
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
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
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
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
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
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Tâches urgentes</h3>
                      <button 
                        onClick={() => setActiveTab('task-management')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Voir tout
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl">
                        <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Finaliser rapport mensuel</h4>
                          <p className="text-sm text-gray-600">Échéance: 15 janvier 2024</p>
                        </div>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">Urgent</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
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
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
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
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
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
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
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
      case 'manager-nomination':
        return <ManagerNomination />;
      case 'managers-list':
        return <ManagersList />;
      case 'task-management':
        return <TaskManagement />;
      case 'employee-evaluation':
        return <EmployeeEvaluation />;
      case 'my-performance':
        return <MyPerformance />;
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
    <ThemeProvider>
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 ml-64">
          <Header />
          {renderContent()}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;