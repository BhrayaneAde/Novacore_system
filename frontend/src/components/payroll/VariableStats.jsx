import React from 'react';
import { BarChart3, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const VariableStats = ({ variables }) => {
  const stats = {
    total: variables.length,
    active: variables.filter(v => v.is_active).length,
    inactive: variables.filter(v => !v.is_active).length,
    mandatory: variables.filter(v => v.is_mandatory).length,
    byType: variables.reduce((acc, v) => {
      acc[v.variable_type] = (acc[v.variable_type] || 0) + 1;
      return acc;
    }, {})
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 font-medium mb-1">Total</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{stats.total}</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 font-medium mb-1">Actives</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.active}</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 font-medium mb-1">Inactives</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">{stats.inactive}</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-gray-500 to-slate-500 rounded-xl">
            <XCircle className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 font-medium mb-1">Obligatoires</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">{stats.mandatory}</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {Object.keys(stats.byType).length > 0 && (
        <div className="col-span-full bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
            Répartition par type
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div
                key={type}
                className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 text-center"
              >
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{type}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VariableStats;