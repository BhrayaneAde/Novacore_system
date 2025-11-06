import React from 'react';
import { CreditCard, DollarSign, AlertTriangle, Target } from 'lucide-react';

const AdvancedPayrollManagement = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="text-center py-16">
        <div className="p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <CreditCard className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Gestion Avancée</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Prêts, avances, saisies sur salaire et gestion des primes variables
        </p>
        <div className="bg-red-50 rounded-xl p-6 max-w-2xl mx-auto">
          <h4 className="font-semibold text-red-900 mb-4">Fonctionnalités à implémenter :</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-red-600" />
              <span className="text-red-800">Prêts et avances sur salaire</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-red-800">Saisies sur salaire</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-red-600" />
              <span className="text-red-800">Primes variables/objectives</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-red-600" />
              <span className="text-red-800">Indemnités de fin de contrat</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-red-600" />
              <span className="text-red-800">Gestion des remboursements</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-red-600" />
              <span className="text-red-800">Calculs de performance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPayrollManagement;