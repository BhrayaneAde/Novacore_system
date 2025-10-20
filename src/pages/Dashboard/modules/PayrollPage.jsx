import React, { useState } from "react";
import { DollarSign, Download, Send, Search, Filter, Calendar } from "lucide-react";

const PayrollPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  
  const payrollRecords = [
    {
      id: 1,
      employeeName: "Marie Dubois",
      month: "Janvier 2024",
      baseSalary: 5417,
      bonus: 500,
      deductions: 1250,
      netSalary: 4667,
      status: "processed"
    },
    {
      id: 2,
      employeeName: "Thomas Martin",
      month: "Janvier 2024",
      baseSalary: 6250,
      bonus: 750,
      deductions: 1450,
      netSalary: 5550,
      status: "processed"
    },
    {
      id: 3,
      employeeName: "Sophie Laurent",
      month: "Janvier 2024",
      baseSalary: 4583,
      bonus: 200,
      deductions: 1050,
      netSalary: 3733,
      status: "pending"
    },
    {
      id: 4,
      employeeName: "Pierre Moreau",
      month: "Janvier 2024",
      baseSalary: 5667,
      bonus: 400,
      deductions: 1300,
      netSalary: 4767,
      status: "pending"
    }
  ];
  
  const filteredRecords = payrollRecords.filter(record => 
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const totalPayroll = payrollRecords.reduce((sum, record) => sum + record.netSalary, 0);
  const processedCount = payrollRecords.filter((r) => r.status === "processed").length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Paie & Avantages</h1>
        <p className="text-gray-600">Gérez les salaires et les avantages sociaux</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {totalPayroll.toLocaleString("fr-FR")} €
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Total mensuel</h3>
          <p className="text-sm text-gray-600">Salaires nets</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">{processedCount}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Salaires traités</h3>
          <p className="text-sm text-gray-600">Ce mois</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-orange-600">{payrollRecords.length - processedCount}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">En attente</h3>
          <p className="text-sm text-gray-600">Traitement</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-purple-600">
              {Math.round(totalPayroll / payrollRecords.length).toLocaleString("fr-FR")} €
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Salaire moyen</h3>
          <p className="text-sm text-gray-600">Par employé</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Registre de paie - Janvier 2024</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <DollarSign className="w-4 h-4" />
              <span>Traiter la paie</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="2024-01">Janvier 2024</option>
              <option value="2023-12">Décembre 2023</option>
              <option value="2023-11">Novembre 2023</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Employé</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Période</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Salaire de base</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Bonus</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Déductions</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Net à payer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Statut</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {record.employeeName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{record.employeeName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{record.month}</td>
                  <td className="py-4 px-6 text-gray-900">
                    {record.baseSalary.toLocaleString("fr-FR")} €
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-green-600 font-medium">
                      +{record.bonus.toLocaleString("fr-FR")} €
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-red-600 font-medium">
                      -{record.deductions.toLocaleString("fr-FR")} €
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-gray-900">
                      {record.netSalary.toLocaleString("fr-FR")} €
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      record.status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.status === 'processed' ? 'Traité' : 'En attente'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      {record.status === 'pending' && (
                        <button className="text-green-600 hover:text-green-700 transition-colors">
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Summary Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total de la période</span>
            <div className="flex items-center space-x-6">
              <span className="text-sm font-medium text-gray-900">
                Salaires traités: <span className="font-bold">{processedCount}/{payrollRecords.length}</span>
              </span>
              <span className="text-sm font-medium text-gray-900">
                Montant total: <span className="font-bold text-blue-600">{totalPayroll.toLocaleString("fr-FR")} €</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;
