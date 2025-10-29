import React from "react";
import { HelpCircle, Search } from "lucide-react";
import NotificationCenter from "../../../components/NotificationCenter";

const Header = () => {
  return (
    <header className="h-16" style={{background: 'linear-gradient(to right, #055169, #023342)'}}>
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        <div className="flex-1 max-w-2xl w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{color: 'rgba(255,255,255,0.6)'}} />
          <input 
            className="w-full h-11 pl-10 pr-3 rounded-md text-sm focus:outline-none focus:ring-2 transition-all duration-300"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#ffffff',
              '--tw-ring-color': '#f59e0b'
            }}
            placeholder="Rechercher un employé, document..."
            onFocus={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
              e.target.style.borderColor = '#f59e0b';
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.target.style.borderColor = 'rgba(255,255,255,0.15)';
            }}
          />
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <NotificationCenter />
          <button 
            className="inline-flex items-center justify-center h-10 w-10 rounded-md transition-colors"
            style={{color: '#ffffff'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            title="Aide"
          >
            <HelpCircle className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
