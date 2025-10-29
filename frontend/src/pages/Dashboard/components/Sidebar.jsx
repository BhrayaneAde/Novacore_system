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

const Sidebar = ({ activeTab, setActiveTab }) => {
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
    if (!userPermissions || !module) return true; // Fallback to current behavior
    
    // Handle case where userPermissions is an object with module keys
    if (typeof userPermissions === 'object' && !Array.isArray(userPermissions)) {
      return userPermissions[module]?.[action] || false;
    }
    
    // Handle case where userPermissions is an array
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

  // Filtrer les menus selon les permissions
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
      // Always show dashboard and self-service items
      if (!item.module || item.tab === 'dashboard' || item.tab === 'employee-self-service') {
        return allowedTabs.includes(item.tab);
      }
      
      // Check permissions for other items
      return allowedTabs.includes(item.tab) && hasPermission(item.module);
    });
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64" style={{background: 'linear-gradient(135deg, #023342 0%, #055169 100%)', borderRight: '1px solid #e5e7eb', zIndex: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <div>
        <div className="p-6 border-b border-gray-200 flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm ${
            currentUser?.role === 'employer' ? 'bg-gradient-to-r from-primary-500 to-primary-600' :
            currentUser?.role === 'hr_admin' ? 'bg-gradient-to-r from-secondary-500 to-secondary-600' :
            currentUser?.role === 'hr_user' ? 'bg-gradient-to-r from-teal-500 to-teal-600' :
            currentUser?.role === 'manager' ? 'bg-gradient-to-r from-primary-400 to-secondary-500' :
            currentUser?.role === 'employee' ? 'bg-gradient-to-r from-secondary-400 to-secondary-500' : 'bg-gray-600'
          }`}>
            {currentUser?.role === 'employer' ? 'CEO' :
             currentUser?.role === 'hr_admin' ? 'HR+' :
             currentUser?.role === 'hr_user' ? 'HR' :
             currentUser?.role === 'manager' ? 'MGR' :
             currentUser?.role === 'employee' ? 'EMP' : 'USR'}
          </div>
          <span className="text-lg font-semibold tracking-tight">
            {currentUser?.role === 'employer' ? 'Administration' :
             currentUser?.role === 'hr_admin' ? 'RH Admin' :
             currentUser?.role === 'hr_user' ? 'RH Utilisateur' :
             currentUser?.role === 'manager' ? 'Management' :
             currentUser?.role === 'employee' ? 'Portail Employé' : 'NovaCore'}
          </span>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item, i) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={i}
                onClick={() => setActiveTab(item.tab)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all w-full text-left ${
                  isActive
                    ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-secondary-700 border-l-4 border-secondary-500 shadow-sm"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-primary-25 hover:to-secondary-25 hover:text-secondary-600"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
            alt="User"
            className="w-9 h-9 rounded-full"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{currentUser?.name || 'Marie Dubois'}</p>
            <p className="text-xs text-gray-500">
              {currentUser?.role === 'employer' ? 'Employeur' :
               currentUser?.role === 'hr_admin' ? 'Admin RH' :
               currentUser?.role === 'hr_user' ? 'Utilisateur RH' :
               currentUser?.role === 'manager' ? 'Manager' :
               currentUser?.role === 'employee' ? 'Employé' : 'Utilisateur'}
            </p>
          </div>
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;