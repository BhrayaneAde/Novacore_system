import React, { useState } from 'react';
import { Download, Eye, Search, Filter, Calendar, DollarSign, TrendingUp, FileText } from 'lucide-react';

const EmployeePayslips = () => {
  const [payslips] = useState([
    {
      id: 1,
      month: 'Décembre 2023',
      period: '01/12/2023 - 31/12/2023',
      grossSalary: 3500,
      netSalary: 2680,
      deductions: 820,
      bonus: 200,
      status: 'available'
    },
    {
      id: 2,
      month: 'Novembre 2023',
      period: '01/11/2023 - 30/11/2023',
      grossSalary: 3500,
      netSalary: 2680,
      deductions: 820,
      bonus: 0,
      status: 'available'
    },
    {
      id: 3,
      month: 'Octobre 2023',
      period: '01/10/2023 - 31/10/2023',
      grossSalary: 3500,
      netSalary: 2680,
      deductions: 820,
      bonus: 150,
      status: 'available'
    },
    {
      id: 4,
      month: 'Septembre 2023',
      period: '01/09/2023 - 30/09/2023',
      grossSalary: 3500,
      netSalary: 2680,
      deductions: 820,
      bonus: 0,
      status: 'available'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('2023');

  const years = ['2023', '2022', '2021'];
  const totalNetSalary = payslips.reduce((sum, payslip) => sum + payslip.netSalary, 0);
  const totalBonus = payslips.reduce((sum, payslip) => sum + payslip.bonus, 0);

  const filteredPayslips = payslips.filter(payslip => {
    const matchesSearch = payslip.month.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = payslip.month.includes(yearFilter);
    return matchesSearch && matchesYear;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Fiches de Paie</h1>
              <p className="text-gray-600 mt-1">Consultez et téléchargez vos bulletins de salaire</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-all">
              <Download className="w-5 h-5" />
              Télécharger tout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Salaire net total</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{totalNetSalary.toLocaleString()}€</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Cette année</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bonus total</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{totalBonus.toLocaleString()}€</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Cette année</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fiches disponibles</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">{payslips.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Derniers 12 mois</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Salaire moyen</p>
                  <p className="text-3xl font-bold text-orange-600 mt-1">{Math.round(totalNetSalary / payslips.length).toLocaleString()}€</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Par mois</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par mois..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[120px]"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPayslips.map((payslip) => (
            <div key={payslip.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{payslip.month}</h3>
                    <p className="text-gray-600 mb-2">{payslip.period}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                        Net: {payslip.netSalary.toLocaleString()}€
                      </span>
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium">
                        Brut: {payslip.grossSalary.toLocaleString()}€
                      </span>
                      {payslip.bonus > 0 && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                          Bonus: {payslip.bonus}€
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPayslips.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune fiche de paie trouvée</h3>
            <p className="text-gray-600">Essayez de modifier vos filtres de recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeePayslips;