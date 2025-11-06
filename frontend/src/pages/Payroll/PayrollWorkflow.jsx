import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';

const PayrollWorkflow = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="text-center py-16">
        <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Workflow et Validations</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Processus de validation hiérarchique et audit trail complet
        </p>
        <div className="bg-indigo-50 rounded-xl p-6 max-w-2xl mx-auto">
          <h4 className="font-semibold text-indigo-900 mb-4">Fonctionnalités à implémenter :</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-800">Validation hiérarchique</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-800">Processus d'approbation</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-800">Notifications automatiques</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-800">Audit trail</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-800">Contrôles de cohérence</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-800">Historique des modifications</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollWorkflow;