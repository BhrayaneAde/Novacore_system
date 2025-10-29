import React from "react";
import { HelpCircle, Search } from "lucide-react";
import NotificationCenter from "../../../components/NotificationCenter";

const Header = () => {
  return (
    <header className="sticky top-0 z-30" style={{background: 'linear-gradient(135deg, #023342 0%, #055169 100%)', borderBottom: '1px solid #023342', boxShadow: '0 8px 32px rgba(2, 51, 66, 0.3), 0 0 0 1px rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'}}>
      <div className="px-8 py-4 flex items-center justify-between animate-fade-in">
        <div className="relative flex-1 max-w-lg group">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110 group-focus-within:rotate-12" style={{color: '#ffffff'}} />
          <input
            type="text"
            placeholder="Rechercher un employé, document..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-300"
            style={{borderColor: 'rgba(255,255,255,0.3)', '--tw-ring-color': '#f59e0b', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', fontWeight: 'bold', backdropFilter: 'blur(10px)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'}}
            onFocus={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.target.style.transform = 'scale(1.02)';
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.target.style.transform = 'scale(1)';
            }}
          />
        </div>

        <div className="flex items-center gap-3 animate-slide-in-right">
          <NotificationCenter />
          <button className="p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-6" style={{backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
            e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
          }} onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}>
            <HelpCircle className="w-5 h-5" style={{color: '#ffffff'}} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
