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
import { employees, departments, hierarchicalMetrics } from "../../data/mockData";

// Services de compatibilité avec données réelles
const usersService = { getAll: () => Promise.resolve({ data: employees }) };
const employeesService = { getAll: () => Promise.resolve({ data: employees }) };
const hrService = { departments: { getAll: () => Promise.resolve({ data: departments }) } };
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
import HRWorkflows from "./modules/HRWorkflows";
import HRLeaves from "./modules/HRLeaves";
import HRAssets from "./modules/HRAssets";
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
import PayrollConfigPage from "../Settings/PayrollConfigPage";
import PayrollMainPage from "../Payroll/PayrollMainPage";
import DepartmentsPage from "./modules/DepartmentsPage";
import HRAlertsPage from "./modules/HRAlertsPage";
import TrainingPage from "./modules/TrainingPage";
import EmailTemplatesPage from "./modules/EmailTemplatesPage";

const Dashboard = () => {
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

      setDashboardData({
        users: usersRes.data || [],
        employees: employeesRes.data || [],
        departments: departmentsRes.data || [],
        tasks: tasksRes.data || [],
        managerActivities: [],
        hierarchicalMetrics: hierarchicalMetrics
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
          totalManagers: 3,
          totalEmployees: 9,
          avgPerformance: 88.3,
          totalTasksCompleted: 75,
          pendingApprovals: 6,
          departmentPerformance: [
            { name: "Design", performance: 92, manager: "Thomas Dubois" },
            { name: "Marketing", performance: 88, manager: "Emma Rousseau" },
            { name: "Ventes", performance: 85, manager: "Pierre Moreau" }
          ]
        };
        
        return (
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-gray-900">Vue d'ensemble Direction</h1>
                  <p className="text-sm text-gray-600 mt-1">Supervision complète • {employerMetrics.totalManagers} managers • {employerMetrics.totalEmployees} employés</p>
                </div>
                <div className="inline-flex items-center gap-3">
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">  
                    <Calendar className="size-4" /> <span>Calendrier</span> 
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Clock className="size-4" /> <span>Heures de travail</span>
                  </button>
                </div>
              </div>
            </div>
            
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <div className="group relative rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Performance Globale</div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="size-4 text-green-600" />
                  </div>
                </div>
                <div className="mt-3 text-2xl font-bold text-gray-900">{employerMetrics.avgPerformance}%</div>
                <div className="mt-1 text-xs text-green-600 inline-flex items-center gap-1 font-medium">
                  <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                  +12.4% ce mois
                </div>
                <div className="mt-4">
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{width: `${employerMetrics.avgPerformance}%`}}></div>
                  </div>
                </div>
              </div>
              
              <div className="group relative rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Employés Actifs</div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="size-4 text-blue-600" />
                  </div>
                </div>
                <div className="mt-3 text-2xl font-bold text-gray-900">{employerMetrics.totalEmployees}</div>
                <div className="mt-1 text-xs text-blue-600 inline-flex items-center gap-1 font-medium">
                  <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                  +2 ce mois
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`h-6 flex-1 rounded ${i < 4 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="group relative rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tâches Complétées</div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CheckSquare className="size-4 text-purple-600" />
                  </div>
                </div>
                <div className="mt-3 text-2xl font-bold text-gray-900">{employerMetrics.totalTasksCompleted}</div>
                <div className="mt-1 text-xs text-purple-600 inline-flex items-center gap-1 font-medium">
                  <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                  +8.3% vs. 30j
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Complétées</span>
                    <span>{employerMetrics.totalTasksCompleted}/100</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" style={{width: `${employerMetrics.totalTasksCompleted}%`}}></div>
                  </div>
                </div>
              </div>
              
              <div className="group relative rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Demandes en Attente</div>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="size-4 text-orange-600" />
                  </div>
                </div>
                <div className="mt-3 text-2xl font-bold text-gray-900">{employerMetrics.pendingApprovals}</div>
                <div className="mt-1 text-xs text-orange-600 inline-flex items-center gap-1 font-medium">
                  <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                  </svg>
                  -2 vs. hier
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 text-xs text-gray-500">Congés • Évaluations • Tâches</div>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" style={{width: `${(employerMetrics.pendingApprovals / 20) * 100}%`}}></div>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Activité des Managers</h2>
                      <p className="text-sm text-gray-600 mt-1">Performance et supervision d'équipe</p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Exporter
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {dashboardData.departments.filter(d => d.managerId).map((dept, index) => (
                      <div key={dept.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                            {dept.manager?.charAt(0) || 'M'}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{dept.manager}</h4>
                            <p className="text-sm text-gray-600">{dept.name} • {dept.employees} membres</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="font-semibold text-gray-900">{Math.floor(Math.random() * 20) + 10}</p>
                            <p className="text-gray-600">Tâches</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-green-600">{dept.performance}</p>
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
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Objectifs RH</h2>
                  <p className="text-sm text-gray-600 mt-1">Suivi des KPIs clés</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-gray-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-green-500" strokeWidth="3" strokeDasharray={`${employerMetrics.avgPerformance}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-900">{employerMetrics.avgPerformance}%</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Performance globale</div>
                      <div className="text-xs text-gray-600">Objectif: 90% • +12% ce mois</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Répartition par département</div>
                    {employerMetrics.departmentPerformance.slice(0,3).map((dept, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{background: i === 0 ? '#10b981' : i === 1 ? '#f59e0b' : '#6366f1'}}></div>
                        <div className="flex-1 text-sm text-gray-700">{dept.name}</div>
                        <div className="text-sm font-medium text-gray-900">{dept.performance}%</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium text-gray-900">Alertes</div>
                      <span className="text-xs text-gray-500">Aujourd'hui</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <svg className="size-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div className="text-xs text-gray-700">{employerMetrics.pendingApprovals} approbations en attente</div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <TrendingUp className="size-4 text-green-600" />
                        <div className="text-xs text-gray-700">Performance en hausse de 12%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
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
                  {label: 'Design', value: 3},
                  {label: 'Marketing', value: 2},
                  {label: 'Ventes', value: 2},
                  {label: 'Direction', value: 1}
                ]}
              />
              <PieChart 
                title="Répartition contrats"
                data={[
                  {label: 'CDI', value: 8},
                  {label: 'CDD', value: 1}
                ]}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LineChart 
                  title="Recrutements 2024" 
                  color="green"
                  data={[
                    {label: 'Jan', value: 1},
                    {label: 'Fév', value: 2},
                    {label: 'Mar', value: 1},
                    {label: 'Avr', value: 0},
                    {label: 'Mai', value: 2},
                    {label: 'Jun', value: 1}
                  ]}
                />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-secondary-100 transition-colors">
                    <p className="font-medium text-blue-900">Congés en attente</p>
                    <p className="text-sm text-secondary-600">3 demandes</p>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                    <p className="font-medium text-green-900">Nouveaux CV</p>
                    <p className="text-sm text-green-600">5 candidatures</p>
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
                <p className="text-3xl font-bold text-secondary-600">9</p>
                <p className="text-sm text-gray-500">+2 ce mois</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">Congés en attente</h3>
                <p className="text-3xl font-bold text-orange-600">3</p>
                <p className="text-sm text-gray-500">À approuver</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">Présence aujourd'hui</h3>
                <p className="text-3xl font-bold text-green-600">8</p>
                <p className="text-sm text-gray-500">89% présents</p>
              </div>
            </div>
            <BarChart 
              title="Congés par mois" 
              color="blue"
              data={[
                {label: 'Jan', value: 2},
                {label: 'Fév', value: 1},
                {label: 'Mar', value: 3},
                {label: 'Avr', value: 2},
                {label: 'Mai', value: 4},
                {label: 'Jun', value: 1}
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
        const myDepartments = dashboardData.departments.filter(d => d.managerId === currentUser?.id);
        const myTasks = dashboardData.tasks.filter(t => t.assigned_by === currentUser?.id);
        const isSeniorManager = currentUser?.role === 'senior_manager';
        
        // Simulation des métriques manager
        const managerActivity = {
          teamSize: myDepartments.reduce((acc, d) => acc + (d.employees || 0), 0),
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
                  {dashboardData.departments.filter(d => d.managerId && d.managerId !== currentUser?.id).map(dept => (
                    <div key={dept.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{dept.manager}</h4>
                        <p className="text-sm text-gray-600">{dept.name} • {dept.employees || 0} membres</p>
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
        return <EmployeesPage setActiveTab={setActiveTab} />;
      case 'payroll':
        return <PayrollMainPage />;
      case 'performance':
        return <PerformancePage setActiveTab={setActiveTab} />;
      case 'recruitment':
        return <RecruitmentPage setActiveTab={setActiveTab} />;
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
      case 'hr-workflows':
        return <HRWorkflows />;
      case 'hr-leaves':
        return <HRLeaves />;
      case 'hr-payroll':
        return <div>Paie RH</div>;
      case 'hr-recruitment':
        return <div>Recrutement RH</div>;
      case 'hr-documents':
        return <div>Documents RH</div>;
      case 'hr-planning':
        return <div>Planning RH</div>;
      case 'hr-reports':
        return <div>Rapports RH</div>;
      case 'hr-training':
        return <TrainingPage />;
      case 'hr-emails':
        return <EmailTemplatesPage />;
      case 'hr-departments':
        return <DepartmentsPage />;
      case 'hr-assets':
        return <HRAssets />;
      case 'hr-alerts':
        return <HRAlertsPage />;
      case 'settings':
        return <SettingsPage setActiveTab={setActiveTab} />;
      case 'payroll-config':
        return <PayrollConfigPage setActiveTab={setActiveTab} />;
      case 'payroll-main':
        return <PayrollMainPage />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                404
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Module introuvable</h1>
              <p className="text-gray-600 mb-6">Ce module n'existe pas ou n'est pas accessible.</p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Retour au tableau de bord
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} collapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-72'}`}>
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