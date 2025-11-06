import React from 'react';

const PayrollLoader = ({ message = "Chargement..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Loader principal avec les couleurs de la marque */}
        <div className="relative">
          {/* Cercle extérieur - bleu pétrole */}
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-teal-200"></div>
          {/* Cercle intérieur - or */}
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent absolute top-0 left-0"></div>
          {/* Point central */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-teal-500 to-amber-500 rounded-full"></div>
        </div>
        
        {/* Message */}
        <div className="space-y-2">
          <p className="text-teal-700 font-semibold text-lg">{message}</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollLoader;