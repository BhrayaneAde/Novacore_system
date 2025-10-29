import React from "react";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Target,
  UserPlus,
  Settings,
  MoreVertical,
  LogOut,
  User,
  FileText,
  Calendar,
  Clock,
  CheckSquare,
  Edit3,
  Crown,
  MessageSquare,
  BarChart3,
  Shield,
} from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { systemService } from "../../../services/system";
import { useState, useEffect } from "react";

const Sidebar = ({ activeTab, setActiveTab, collapsed = false, setSidebarCollapsed }) => {
  const { logout, currentUser } = useAuthStore();
  const [userPermissions, setUserPermissions] = useState(null);

  useEffect(() => {
    loadUserPermissions();
  }, [currentUser]);

  const loadUserPermissions = async () => {
    if (!currentUser?.role) return;
    
    try {
      const response = await systemService.settings.getRoles();
      const userRole = response.data?.find(role => role.name.toLowerCase() === currentUser.role);
      setUserPermissions(userRole?.permissions || []);
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  const hasPermission = (module, action = 'read') => {
    if (!userPermissions || !module) return true;
    
    if (typeof userPermissions === 'object' && !Array.isArray(userPermissions)) {
      return userPermissions[module]?.[action] || false;
    }
    
    if (Array.isArray(userPermissions)) {
      const modulePermissions = userPermissions.find(p => p.module === module);
      return modulePermissions?.actions?.[action] || false;
    }
    
    return true;
  };

  const allMenuItems = [
    { icon: LayoutDashboard, label: "Accueil", tab: "dashboard", module: null },
    { icon: Users, label: "Employés", tab: "employees", module: "employees" },
    { icon: CheckSquare, label: "Tâches", tab: "task-management", module: "tasks" },
    { icon: Target, label: "Évaluations", tab: "employee-evaluation", module: "performance" },
    { icon: UserPlus, label: "Managers", tab: "managers-list", module: "employees" },
    { icon: Target, label: "Nominations", tab: "manager-nominations", module: "employees" },
    { icon: Edit3, label: "Éditeur Contrats", tab: "contract-editor", module: "contracts" },
    { icon: Wallet, label: "Paie & Avantages", tab: "payroll", module: "payroll" },
    { icon: Target, label: "Performance", tab: "performance", module: "performance" },
    { icon: UserPlus, label: "Recrutement", tab: "recruitment", module: "recruitment" },
    { icon: BarChart3, label: "Rapports", tab: "advanced-reports", module: "reports" },
    { icon: Shield, label: "Audit Logs", tab: "audit-logs", module: "settings" },
    { icon: Crown, label: "Succession", tab: "succession-planning", module: "employees" },
    { icon: Settings, label: "Paramètres", tab: "settings", module: "settings" },
    { icon: Calendar, label: "Planning Équipe", tab: "manager-planning", module: "attendance" },
    { icon: Target, label: "Objectifs", tab: "goal-setting", module: "performance" },
    { icon: MessageSquare, label: "1-on-1", tab: "one-on-one", module: "performance" },
    { icon: FileText, label: "Documents", tab: "manager-documents", module: "documents" },
    { icon: FileText, label: "Gestion RH", tab: "hr-management", module: "employees" },
    { icon: UserPlus, label: "Onboarding", tab: "onboarding-workflow", module: "employees" },
    { icon: CheckSquare, label: "Mes Tâches", tab: "employee-tasks", module: "tasks" },
    { icon: Target, label: "Ma Performance", tab: "my-performance", module: "performance" },
    { icon: User, label: "Mon Profil & Espace", tab: "employee-self-service", module: null },
    { icon: Wallet, label: "Mes Fiches de Paie", tab: "payslips", module: "payroll" },
    { icon: Calendar, label: "Mes Congés", tab: "leaves", module: "attendance" },
    { icon: Clock, label: "Mes Heures", tab: "timesheet", module: "attendance" },
    { icon: FileText, label: "Mes Documents", tab: "documents", module: "documents" }
  ];

  const getMenuItems = () => {
    const roleBasedItems = {
      'employer': ['dashboard', 'employees', 'task-management', 'employee-evaluation', 'managers-list', 'manager-nominations', 'contract-editor', 'payroll', 'performance', 'recruitment', 'advanced-reports', 'audit-logs', 'succession-planning', 'settings', 'hr-management'],
      'hr_admin': ['dashboard', 'employees', 'task-management', 'employee-evaluation', 'managers-list', 'manager-nomination', 'contract-editor', 'payroll', 'performance', 'recruitment', 'onboarding-workflow', 'advanced-reports', 'hr-management'],
      'hr_user': ['dashboard', 'employees'],
      'manager': ['dashboard', 'employees', 'task-management', 'employee-evaluation', 'manager-planning', 'goal-setting', 'one-on-one', 'manager-documents', 'advanced-reports', 'performance'],
      'employee': ['dashboard', 'employee-tasks', 'my-performance', 'goal-setting', 'employee-self-service', 'payslips', 'leaves', 'timesheet', 'documents']
    };

    const allowedTabs = roleBasedItems[currentUser?.role] || roleBasedItems['employee'];
    
    return allMenuItems.filter(item => {
      if (!item.module || item.tab === 'dashboard' || item.tab === 'employee-self-service') {
        return allowedTabs.includes(item.tab);
      }
      
      return allowedTabs.includes(item.tab) && hasPermission(item.module);
    });
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 transition-all duration-300 ${collapsed ? 'w-16' : 'w-72'}`}>
      <div className="flex h-full flex-col" style={{background: 'linear-gradient(to bottom, #055169, #023342)', color: '#ffffff'}}>
        <div className="h-16 flex items-center gap-2 px-4" style={{borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
          <button 
            onClick={() => setSidebarCollapsed(!collapsed)}
            className="inline-flex items-center justify-center h-9 w-9 rounded-md transition-colors flex-shrink-0"
            style={{color: '#ffffff'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            title="Réduire/Agrandir le menu"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {!collapsed && (
            <>
              <div 
                className="h-9 w-9 grid place-items-center rounded font-semibold tracking-tight flex-shrink-0"
                style={{backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff'}}
              >
                {currentUser?.role === 'employer' ? 'CEO' :
                 currentUser?.role === 'hr_admin' ? 'HR+' :
                 currentUser?.role === 'hr_user' ? 'HR' :
                 currentUser?.role === 'manager' ? 'MGR' :
                 currentUser?.role === 'employee' ? 'EMP' : 'USR'}
              </div>
              <div className="leading-tight">
                <div className="text-[15px] font-medium tracking-tight">
                  {currentUser?.role === 'employer' ? 'Administration' :
                   currentUser?.role === 'hr_admin' ? 'RH Admin' :
                   currentUser?.role === 'hr_user' ? 'RH Utilisateur' :
                   currentUser?.role === 'manager' ? 'Management' :
                   currentUser?.role === 'employee' ? 'Portail Employé' : 'NovaCore'}
                </div>
                <div className="text-xs" style={{color: 'rgba(255,255,255,0.6)'}}>Tableau de bord</div>
              </div>
            </>
          )}
        </div>

        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          {menuItems.map((item, i) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={i}
                onClick={() => setActiveTab(item.tab)}
                className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm w-full text-left mb-1"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.8)',
                  border: isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <item.icon className="size-4 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto" style={{borderTop: '1px solid rgba(255,255,255,0.1)'}}>
          <div className="px-4 py-4 flex items-center gap-3">
            <img 
              className="h-9 w-9 rounded-full object-cover flex-shrink-0" 
              style={{border: '1px solid rgba(255,255,255,0.1)'}} 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&q=80&auto=format&fit=crop" 
              alt="Avatar" 
            />
            {!collapsed && (
              <>
                <div className="min-w-0">
                  <div className="text-sm font-medium tracking-tight truncate">{currentUser?.name || 'Marie Dubois'}</div>
                  <div className="text-xs" style={{color: 'rgba(255,255,255,0.6)'}}>
                    {currentUser?.role === 'employer' ? 'Employeur' :
                     currentUser?.role === 'hr_admin' ? 'Admin RH' :
                     currentUser?.role === 'hr_user' ? 'Utilisateur RH' :
                     currentUser?.role === 'manager' ? 'Manager' :
                     currentUser?.role === 'employee' ? 'Employé' : 'Utilisateur'}
                  </div>
                </div>
                <button 
                  className="ml-auto inline-flex items-center justify-center h-9 w-9 rounded-md transition-colors" 
                  title="Options"
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <MoreVertical className="size-4" />
                </button>
              </>
            )}
          </div>
          <div className="px-4 pb-4">
            <button 
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-2 h-9 rounded-md transition-colors"
              style={{backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              title={collapsed ? 'Déconnexion' : ''}
            >
              <LogOut className="size-4" />
              {!collapsed && 'Déconnexion'}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;