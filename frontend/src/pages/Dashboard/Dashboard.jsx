import React, { useState, useEffect } from "react";
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
import { systemService } from "../../services";
import Loader from "../../components/ui/Loader";

// Services de compatibilité
const usersService = { getAll: () => systemService.employees.getAll() };
const employeesService = { getAll: () => systemService.employees.getAll() };
const hrService = { departments: { getAll: () => Promise.resolve({ data: [] }) } };
const tasksService = { getAll: () => Promise.resolve({ data: [] }) };

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
import TaskManagement from "../Tasks/AdvancedTaskManagement";
import EmployeeEvaluation from "../Evaluations/EmployeeEvaluation";
import MyPerformance from "../Evaluations/MyPerformance";
import ContractEditor from "../Contracts/ContractEditor";
import HRManagementPage from "./modules/HRManagementPage";
import ManagerPlanningPage from "./modules/ManagerPlanningPage";
import EmployeeSelfServicePage from "./modules/EmployeeSelfServicePage";
import ManagerNominationsPage from "./modules/ManagerNominationPage";
import GoalSettingPage from "./modules/GoalSettingPage";
import OneOnOnePage from "./modules/OneOnOnePage";
import OnboardingWorkflowPage from "./modules/OnboardingWorkflowPage";
import AdvancedReportsPage from "./modules/AdvancedReportsPage";
import AuditLogsPage from "./modules/AuditLogsPage";
import SuccessionPlanningPage from "./modules/SuccessionPlanningPage";
import EmployeeTasksPage from "./modules/EmployeeTasksPage";
import PayrollManagementPage from "./modules/PayrollManagementPage";
import ManagerDocumentsPage from "./modules/ManagerDocumentsPage";

const Dashboard = () => {
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({
    users: [],
    employees: [],
    departments: [],
    tasks: [],
    managerActivities: [],
    hierarchicalMetrics: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, employeesRes, departmentsRes, tasksRes] = await Promise.all([
        usersService.getAll().catch(() => ({ data: [] })),
        employeesService.getAll().catch(() => ({ data: [] })),
        hrService.departments.getAll().catch(() => ({ data: [] })),
        tasksService.getAll().catch(() => ({ data: [] }))
      ]);

      // Calculer les métriques hiérarchiques
      const employees = employeesRes.data || [];
      const departments = departmentsRes.data || [];
      const tasks = tasksRes.data || [];
      
      const hierarchicalMetrics = {
        employer: {
          totalManagers: departments.filter(d => d.manager_id).length,
          totalEmployees: employees.length,
          avgPerformance: 88.3, // À calculer selon la logique métier
          totalTasksCompleted: tasks.filter(t => t.status === 'completed').length,
          pendingApprovals: tasks.filter(t => t.status === 'pending_approval').length,
          departmentPerformance: departments.map(d => ({
            name: d.name,
            performance: Math.floor(Math.random() * 20) + 80, // Simulation
            manager: d.manager?.first_name + ' ' + d.manager?.last_name
          }))
        }
      };

      setDashboardData({
        users: usersRes.data || [],
        employees: employees,
        departments: departments,
        tasks: tasks,
        managerActivities: [], // À implémenter selon les besoins
        hierarchicalMetrics
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => {
    switch (currentUser?.role) {
      case 'employer':
        if (loading) {
          return (
            <div className="p-8 flex flex-col items-center justify-center py-12">
              <Loader size={48} />
              <span className="mt-4 text-gray-600">Chargement du tableau de bord...</span>
            </div>
          );
        }
        
        const employerMetrics = dashboardData.hierarchicalMetrics?.employer || {
          totalManagers: 0,
          totalEmployees: 0,
          avgPerformance: 0,
          totalTasksCompleted: 0,
          pendingApprovals: 0,
          departmentPerformance: []
        };
        
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
                  <CheckSquare className="w-5 h-5 text-secondary-500" />
                </div>
                <p className="text-3xl font-bold text-secondary-600">{employerMetrics.totalTasksCompleted}</p>
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
                {dashboardData.departments.filter(d => d.manager_id).map(dept => (
                  <div key={dept.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-medium">{dept.manager?.first_name} {dept.manager?.last_name}</h4>
                          <p className="text-sm text-gray-600">{dept.name} • {dept.employee_count || 0} membres</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold">{Math.floor(Math.random() * 20) + 10}</p>
                        <p className="text-gray-600">Tâches</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{Math.floor(Math.random() * 20) + 80}%</p>
                        <p className="text-gray-600">Performance</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-orange-600">{Math.floor(Math.random() * 5)}</p>
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
                  <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-secondary-100 transition-colors">
                    <p className="font-medium text-blue-900">Congés en attente</p>
                    <p className="text-sm text-secondary-600">7 demandes</p>
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
                <p className="text-3xl font-bold text-secondary-600">42</p>
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
        if (loading) {
          return (
            <div className="p-8 flex flex-col items-center justify-center py-12">
              <Loader size={48} />
              <span className="mt-4 text-gray-600">Chargement des données manager...</span>
            </div>
          );
        }
        
        const managerData = dashboardData.users.find(u => u.id === currentUser?.id);
        const myDepartments = dashboardData.departments.filter(d => d.manager_id === currentUser?.id);
        const myTasks = dashboardData.tasks.filter(t => t.assigned_by === currentUser?.id);
        const isSeniorManager = currentUser?.role === 'senior_manager';
        
        // Simulation des métriques manager
        const managerActivity = {
          teamSize: myDepartments.reduce((acc, d) => acc + (d.employee_count || 0), 0),
          tasksCompleted: myTasks.filter(t => t.status === 'completed').length,
          teamPerformance: Math.floor(Math.random() * 20) + 80,
          pendingApprovals: myTasks.filter(t => t.status === 'pending_approval').length,
          activities: [
            { type: 'task_assigned', count: myTasks.length, description: 'Tâches assignées' },
            { type: 'evaluation_completed', count: Math.floor(Math.random() * 5), description: 'Évaluations complétées' },
            { type: 'leave_approved', count: Math.floor(Math.random() * 3), description: 'Congés approuvés' },
            { type: 'meeting_held', count: Math.floor(Math.random() * 5) + 2, description: 'Réunions d\'équipe' }
          ]
        };
        
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
                  <Users className="w-5 h-5 text-secondary-500" />
                </div>
                <p className="text-3xl font-bold text-secondary-600">{managerActivity?.teamSize || 0}</p>
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
                  (dashboardData.hierarchicalMetrics?.employer.departmentPerformance || []).map(d => ({label: d.name, value: d.performance})) :
                  myDepartments.map(d => ({label: d.name, value: Math.floor(Math.random() * 20) + 80}))
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
                  {dashboardData.departments.filter(d => d.manager_id && d.manager_id !== currentUser?.id).map(dept => (
                    <div key={dept.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{dept.manager?.first_name} {dept.manager?.last_name}</h4>
                        <p className="text-sm text-gray-600">{dept.name} • {dept.employee_count || 0} membres</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{Math.floor(Math.random() * 20) + 80}%</p>
                        <p className="text-sm text-gray-600">{Math.floor(Math.random() * 20) + 10} tâches</p>
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
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-secondary-100 transition-all group border border-gray-100 hover:border-secondary-200"
                  >
                    <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                      <CheckSquare className="w-6 h-6 text-secondary-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Mes Tâches</h3>
                    <p className="text-sm text-gray-600">3 en cours</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('leaves')}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-primary-100 transition-all group border border-gray-100 hover:border-primary-200"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Congés</h3>
                    <p className="text-sm text-gray-600">15j restants</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('timesheet')}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-teal-100 transition-all group border border-gray-100 hover:border-teal-200"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Pointage</h3>
                    <p className="text-sm text-gray-600">152h ce mois</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('documents')}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-primary-100 transition-all group border border-gray-100 hover:border-primary-200"
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
                      <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-secondary-600" />
                      </div>
                      <span className="text-2xl font-bold text-secondary-600">15</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Congés restants</h3>
                    <p className="text-sm text-gray-600">Sur 25 jours annuels</p>
                    <div className="mt-3 bg-gray-200 rounded-full h-2">
                      <div className="bg-secondary-600 h-2 rounded-full" style={{width: '60%'}}></div>
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
                        className="text-secondary-600 hover:text-secondary-700 text-sm font-medium"
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
                        <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-secondary-600">LUN</span>
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
                        <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-secondary-600" />
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
                        <span className="font-semibold text-secondary-600">24</span>
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
        return <PayrollManagementPage />;
      case 'performance':
        return <PerformancePage />;
      case 'recruitment':
        return <RecruitmentPage />;
      case 'manager-nomination':
        return <ManagerNomination />;
      case 'managers-list':
        return <ManagersList />;
      case 'employee-tasks':
        return <EmployeeTasksPage />;
      case 'task-management':
        return <TaskManagement />;
      case 'employee-evaluation':
        return <EmployeeEvaluation />;
      case 'my-performance':
        return <MyPerformance />;
      case 'contract-editor':
        return <ContractEditor />;
      case 'manager-planning':
        return <ManagerPlanningPage />;
      case 'employee-self-service':
        return <EmployeeSelfServicePage />;
      case 'manager-nominations':
        return <ManagerNominationsPage />;
      case 'goal-setting':
        return <GoalSettingPage />;
      case 'one-on-one':
        return <OneOnOnePage />;
      case 'manager-documents':
        return <ManagerDocumentsPage />;
      case 'onboarding-workflow':
        return <OnboardingWorkflowPage />;
      case 'advanced-reports':
        return <AdvancedReportsPage />;
      case 'audit-logs':
        return <AuditLogsPage />;
      case 'succession-planning':
        return <SuccessionPlanningPage />;
      case 'hr-management':
        return <HRManagementPage />;
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
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-secondary-50/30 text-gray-900">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 ml-64">
          <Header />
          <div className="relative">
            {renderContent()}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;