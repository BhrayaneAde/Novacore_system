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
    { name: 'Paie & Avantages', href: '/app/payroll-main', logo: NovaPaieR },
    { name: 'Performance', href: '/app/performance', logo: NovaPerformR },
    { name: 'Recrutement', href: '/app/recruitment', logo: NovaHireR },
    { name: 'Paramètres', href: '/app/settings', icon: Settings, useIcon: true },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 animate-slide-in-left z-20">
      <div 
        className="flex-1 flex flex-col min-h-0" 
        style={{
          background: 'linear-gradient(180deg, #023342 0%, #055169 70%, rgba(245, 158, 11, 0.1) 100%)', 
          boxShadow: '12px 0 48px rgba(2, 51, 66, 0.4), inset -2px 0 0 rgba(245, 158, 11, 0.2), inset 0 0 100px rgba(245, 158, 11, 0.05)', 
          backdropFilter: 'blur(15px)',
          borderRight: '1px solid rgba(245, 158, 11, 0.2)'
        }}
      >
        <div 
          className="flex items-center h-16 flex-shrink-0 px-4 group cursor-pointer" 
          style={{
            background: 'linear-gradient(135deg, #023342 0%, #055169 50%, #f59e0b 100%)', 
            borderBottom: '1px solid rgba(245, 158, 11, 0.3)', 
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
          }}
        >
          <img 
            src={NovaCoreR} 
            alt="NovaCore" 
            className="h-10 w-auto transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 drop-shadow-2xl" 
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(245, 158, 11, 0.3))'
            }}
          />
          <div className="ml-3 hidden lg:block">
            <h1 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors duration-300">
              NovaCore
            </h1>
            <p className="text-xs text-amber-300/80 group-hover:text-amber-200/80 transition-colors duration-300">
              SIRH Intelligent
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-3 py-6 space-y-2 animate-fade-in-up">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 hover:scale-105 relative overflow-hidden ${
                    isActive
                      ? 'text-white shadow-2xl'
                      : 'text-gray-300 hover:text-white'
                  }`
                }
                style={({ isActive }) => isActive ? {
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #055169 100%)',
                  borderLeft: '4px solid #f59e0b',
                  borderRight: '2px solid rgba(245, 158, 11, 0.5)',
                  boxShadow: '0 12px 32px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(15px)',
                  transform: 'translateX(8px)'
                } : {}}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.querySelector('span').classList.contains('text-white')) {
                    e.currentTarget.style.background = 'linear-gradient(90deg, rgba(245, 158, 11, 0.1) 0%, rgba(5, 81, 105, 0.2) 100%)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.2), inset 0 1px 0 rgba(245, 158, 11, 0.1)';
                    e.currentTarget.style.transform = 'translateX(6px) scale(1.02)';
                    e.currentTarget.style.borderLeft = '3px solid rgba(245, 158, 11, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.querySelector('span').classList.contains('text-white')) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateX(0) scale(1)';
                    e.currentTarget.style.borderLeft = 'none';
                  }
                }}
              >
                {item.useIcon ? (
                  <item.icon
                    className="mr-4 flex-shrink-0 h-6 w-6 transition-all duration-500 group-hover:rotate-12 group-hover:scale-125 text-amber-300 group-hover:text-amber-200"
                    aria-hidden="true"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))'
                    }}
                  />
                ) : (
                  <img 
                    src={item.logo} 
                    alt={item.name}
                    className="mr-4 flex-shrink-0 h-6 w-6 object-contain transition-all duration-500 group-hover:rotate-12 group-hover:scale-125"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3)) brightness(1.1) contrast(1.1)'
                    }}
                  />
                )}
                <span className="transition-all duration-300 group-hover:translate-x-2 font-semibold">{item.name}</span>
                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              </NavLink>
            ))}
          </nav>
          
          {/* User Profile & Logout */}
          <div 
            className="px-3 py-4 animate-fade-in-up" 
            style={{
              borderTop: '1px solid rgba(245, 158, 11, 0.3)', 
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(5, 81, 105, 0.3) 100%)', 
              backdropFilter: 'blur(15px)',
              boxShadow: 'inset 0 1px 0 rgba(245, 158, 11, 0.1)'
            }}
          >
            <div className="flex items-center px-3 py-3 mb-3 rounded-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(245, 158, 11, 0.2)';
                e.target.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(245, 158, 11, 0.1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                alt="User"
                className="mr-3 h-10 w-10 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                style={{
                  border: '2px solid rgba(245, 158, 11, 0.5)',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                }}
              />
              <div className="flex-1">
                <p className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors duration-300">
                  {currentUser?.name || 'Admin User'}
                </p>
                <p className="text-xs text-amber-300/80 group-hover:text-amber-200/80 transition-colors duration-300">
                  {currentUser?.role || 'Administrateur RH'}
                </p>
              </div>
              <div className="h-3 w-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse"
                style={{
                  boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)'
                }}
              ></div>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-4 py-3 text-sm font-bold rounded-xl text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 relative overflow-hidden"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                e.target.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.3)';
                e.target.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'translateX(0)';
              }}
            >
              <LogOut className="mr-3 flex-shrink-0 h-5 w-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" aria-hidden="true" />
              <span className="transition-all duration-300 group-hover:translate-x-1">Déconnexion</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
