import React from 'react';
import { PieChart, BarChart, TrendingUp, Download } from 'lucide-react';

const PayrollReporting = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="text-center py-16">
        <div className="p-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <PieChart className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Reporting et Analyses</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Tableaux de bord, analyses de masse salariale et rapports détaillés
        </p>
        <div className="bg-cyan-50 rounded-xl p-6 max-w-2xl mx-auto">
          <h4 className="font-semibold text-cyan-900 mb-4">Fonctionnalités à implémenter :</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-center space-x-2">
              <BarChart className="w-4 h-4 text-cyan-600" />
              <span className="text-cyan-800">Livre de paie</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-cyan-600" />
              <span className="text-cyan-800">États de charges sociales</span>
            </div>
            <div className="flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-cyan-600" />
              <span className="text-cyan-800">Analyses de masse salariale</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart className="w-4 h-4 text-cyan-600" />
              <span className="text-cyan-800">Tableaux de bord RH</span>
            </div>
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4 text-cyan-600" />
              <span className="text-cyan-800">Export Excel/PDF</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-cyan-600" />
              <span className="text-cyan-800">Analyses comparatives</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollReporting;