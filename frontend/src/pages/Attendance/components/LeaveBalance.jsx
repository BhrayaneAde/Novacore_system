import React from "react";
import { Calendar, TrendingUp } from "lucide-react";

const LeaveBalance = ({ employeeId }) => {
  const balance = {
    total: 25,
    taken: 10,
    remaining: 15,
    pending: 5,
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Solde de congés</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total annuel</span>
          <span className="text-lg font-semibold text-gray-900">{balance.total} jours</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Pris</span>
          <span className="text-lg font-medium text-red-600">-{balance.taken} jours</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">En attente</span>
          <span className="text-lg font-medium text-amber-600">{balance.pending} jours</span>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">Restant</span>
            <span className="text-2xl font-bold text-green-600">{balance.remaining} jours</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-blue-900">
          <TrendingUp className="w-4 h-4" />
          <span>Vous avez utilisé {Math.round((balance.taken / balance.total) * 100)}% de vos congés</span>
        </div>
      </div>
    </div>
  );
};

export default LeaveBalance;
