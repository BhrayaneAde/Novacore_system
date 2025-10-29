import { Bell, Search, User, Settings, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { currentUser } = useAuthStore();

  return (
    <header 
      className="relative z-10 animate-slide-in-down"
      style={{
        background: 'linear-gradient(135deg, #023342 0%, #055169 50%, #f59e0b 100%)',
        boxShadow: '0 8px 32px rgba(2, 51, 66, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.2)'
      }}
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Barre de recherche */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-amber-300 group-hover:text-amber-200 transition-colors duration-300" />
          </div>
          <input
            type="text"
            className="block w-80 pl-10 pr-4 py-2 rounded-xl leading-5 placeholder-amber-200/70 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent sm:text-sm transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fff',
              backdropFilter: 'blur(10px)'
            }}
            placeholder="Rechercher dans NovaCore..."
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        
        {/* Actions utilisateur */}
        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <button 
            className="relative p-2 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-12 group"
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(245, 158, 11, 0.2)';
              e.target.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(245, 158, 11, 0.1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <Bell className="h-6 w-6 text-amber-300 group-hover:text-amber-200 transition-colors duration-300" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse">
              3
            </span>
          </button>
          
          {/* Paramètres rapides */}
          <button 
            className="p-2 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-12 group"
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(245, 158, 11, 0.2)';
              e.target.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(245, 158, 11, 0.1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <Settings className="h-6 w-6 text-amber-300 group-hover:text-amber-200 transition-colors duration-300" />
          </button>
          
          {/* Profil utilisateur */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-xl transition-all duration-300 hover:scale-105 group"
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(245, 158, 11, 0.2)';
                e.target.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(245, 158, 11, 0.1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                  alt="User"
                  className="h-8 w-8 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                  style={{
                    border: '2px solid rgba(245, 158, 11, 0.5)',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                  }}
                />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors duration-300">
                  {currentUser?.name || 'Admin User'}
                </p>
                <p className="text-xs text-amber-300/80 group-hover:text-amber-200/80 transition-colors duration-300">
                  {currentUser?.role || 'Administrateur'}
                </p>
              </div>
              <ChevronDown className={`h-4 w-4 text-amber-300 transition-all duration-300 group-hover:text-amber-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Menu déroulant profil */}
            {isProfileOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl z-50 animate-fade-in-up"
                style={{
                  background: 'linear-gradient(135deg, #023342 0%, #055169 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div className="py-2">
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-white hover:bg-amber-500/20 transition-colors duration-300">
                    <User className="mr-3 h-4 w-4 text-amber-300" />
                    Mon Profil
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-white hover:bg-amber-500/20 transition-colors duration-300">
                    <Settings className="mr-3 h-4 w-4 text-amber-300" />
                    Paramètres
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
