import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// Import des logos
import NovaCoreR from '../assets/NovaCoreR.png';
import NovaPeopleR from '../assets/NovaPeopleR.png';
import NovaSignR from '../assets/NovaSignR.png';
import NovaPaieR from '../assets/NovaPaieR.png';
import NovaPerformR from '../assets/NovaPerformR.png';
import NovaHireR from '../assets/NovaHireR.png';
import NovaContratR from '../assets/NovaContratR.png';

const Sidebar = () => {
  const { logout, currentUser } = useAuthStore();
  
  const navigation = [
    { name: 'Tableau de bord', href: '/app/dashboard', icon: LayoutDashboard, useIcon: true },
    { name: 'Gestion du Personnel', href: '/app/employees', logo: NovaPeopleR },
    { name: 'Contrats', href: '/app/contracts', logo: NovaContratR },
    { name: 'Paie & Avantages', href: '/app/payroll', logo: NovaPaieR },
    { name: 'Performance', href: '/app/performance', logo: NovaPerformR },
    { name: 'Recrutement', href: '/app/recruitment', logo: NovaHireR },
    { name: 'Paramètres', href: '/app/settings', icon: Settings, useIcon: true },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
          <img src={NovaCoreR} alt="NovaCore" className="h-10 w-auto" />
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                {item.useIcon ? (
                  <item.icon
                    className="mr-3 flex-shrink-0 h-6 w-6"
                    aria-hidden="true"
                  />
                ) : (
                  <img 
                    src={item.logo} 
                    alt={item.name}
                    className="mr-3 flex-shrink-0 h-6 w-6 object-contain"
                  />
                )}
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          {/* User Profile & Logout */}
          <div className="px-2 py-4 border-t border-gray-700">
            <div className="flex items-center px-2 py-2 mb-2">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                alt="User"
                className="mr-3 h-8 w-8 rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{currentUser?.name || 'Utilisateur'}</p>
                <p className="text-xs text-gray-400">{currentUser?.role || 'RH Manager'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <LogOut className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
