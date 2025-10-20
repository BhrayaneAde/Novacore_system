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
} from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { logout, currentUser } = useAuthStore();

  const employerMenuItems = [
    { icon: LayoutDashboard, label: "Accueil", tab: "dashboard" },
    { icon: Users, label: "Employés", tab: "employees" },
    { icon: Wallet, label: "Paie & Avantages", tab: "payroll" },
    { icon: Target, label: "Performance", tab: "performance" },
    { icon: UserPlus, label: "Recrutement", tab: "recruitment" },
    { icon: Settings, label: "Paramètres", tab: "settings" },
  ];

  const hrAdminMenuItems = [
    { icon: LayoutDashboard, label: "Accueil", tab: "dashboard" },
    { icon: Users, label: "Employés", tab: "employees" },
    { icon: Wallet, label: "Paie & Avantages", tab: "payroll" },
    { icon: Target, label: "Performance", tab: "performance" },
    { icon: UserPlus, label: "Recrutement", tab: "recruitment" },
  ];

  const hrUserMenuItems = [
    { icon: LayoutDashboard, label: "Accueil", tab: "dashboard" },
    { icon: Users, label: "Employés", tab: "employees" },
  ];

  const managerMenuItems = [
    { icon: LayoutDashboard, label: "Accueil", tab: "dashboard" },
    { icon: Users, label: "Mes Employés", tab: "employees" },
    { icon: Target, label: "Performance Équipe", tab: "performance" },
  ];

  const employeeMenuItems = [
    { icon: LayoutDashboard, label: "Accueil", tab: "dashboard" },
    { icon: CheckSquare, label: "Mes Tâches", tab: "tasks" },
    { icon: FileText, label: "Mes Fiches de Paie", tab: "payslips" },
    { icon: Calendar, label: "Mes Congés", tab: "leaves" },
    { icon: Clock, label: "Mes Heures", tab: "timesheet" },
    { icon: User, label: "Mon Profil", tab: "profile" },
    { icon: FileText, label: "Mes Documents", tab: "documents" },
  ];

  // Sélectionner le menu selon le rôle
  const getMenuItems = () => {
    switch (currentUser?.role) {
      case 'employer': return employerMenuItems;
      case 'hr_admin': return hrAdminMenuItems;
      case 'hr_user': return hrUserMenuItems;
      case 'manager': return managerMenuItems;
      case 'employee': return employeeMenuItems;
      default: return hrAdminMenuItems;
    }
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 flex flex-col justify-between">
      <div>
        <div className="p-6 border-b border-gray-200 flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm ${
            currentUser?.role === 'employer' ? 'bg-purple-600' :
            currentUser?.role === 'hr_admin' ? 'bg-blue-600' :
            currentUser?.role === 'hr_user' ? 'bg-cyan-600' :
            currentUser?.role === 'manager' ? 'bg-orange-600' :
            currentUser?.role === 'employee' ? 'bg-green-600' : 'bg-blue-600'
          }`}>
            {currentUser?.role === 'employer' ? 'CEO' :
             currentUser?.role === 'hr_admin' ? 'HR+' :
             currentUser?.role === 'hr_user' ? 'HR' :
             currentUser?.role === 'manager' ? 'MGR' :
             currentUser?.role === 'employee' ? 'EMP' : 'HR'}
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
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
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
               currentUser?.role === 'employee' ? 'Employé' : 'RH Manager'}
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