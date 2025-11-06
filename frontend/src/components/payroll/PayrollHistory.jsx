import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Users, DollarSign, Eye, Download } from 'lucide-react';
import api from '../../services/api';

const PayrollHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [periodDetails, setPeriodDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    try {
      const response = await api.get('/payroll/records/');
      const records = response.data.records || [];
      
      // Grouper par période
      const groupedByPeriod = records.reduce((acc, record) => {
        const period = record.period;
        if (!acc[period]) {
          acc[period] = {
            period: period,
            employeeCount: 0,
            totalGross: 0,
            totalNet: 0,
            totalTax: 0,
            totalCNSS: 0,
            records: []
          };
        }
        acc[period].employeeCount++;
        acc[period].totalGross += record.gross_salary || 0;
        acc[period].totalNet += record.net_salary || 0;
        acc[period].totalTax += record.tax_amount || 0;
        acc[period].totalCNSS += (record.salary_breakdown?.cnss_employee || 0);
        acc[period].records.push(record);
        return acc;
      }, {});
      
      const sortedHistory = Object.values(groupedByPeriod)
        .sort((a, b) => new Date(b.period + '-01').getTime() - new Date(a.period + '-01').getTime());
      
      setHistoryData(sortedHistory);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewPeriodDetails = (period) => {
    setSelectedPeriod(period);
    setPeriodDetails(period.records);
  };

  const formatPeriod = (period) => {
    const [year, month] = period.split('-');
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const downloadPeriodReport = async (period) => {
    try {
      const response = await api.get(`/payroll-reports/journal/${period}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport_${period}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur téléchargement:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des paies</h3>
        
        {historyData.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun historique de paie disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyData.map((period) => (
              <div key={period.period} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{formatPeriod(period.period)}</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewPeriodDetails(period)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadPeriodReport(period.period)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Employés</span>
                    </div>
                    <span className="font-medium">{period.employeeCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Masse salariale</span>
                    </div>
                    <span className="font-medium text-green-600">
                      {period.totalGross.toLocaleString()} F
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Net versé</span>
                    </div>
                    <span className="font-medium text-blue-600">
                      {period.totalNet.toLocaleString()} F
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">IRPP total</span>
                    <span className="font-medium text-red-600">
                      {period.totalTax.toLocaleString()} F
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">CNSS total</span>
                    <span className="font-medium text-orange-600">
                      {period.totalCNSS.toLocaleString()} F
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Détails de la période sélectionnée */}
      {selectedPeriod && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Détails - {formatPeriod(selectedPeriod.period)}
            </h3>
            <button
              onClick={() => setSelectedPeriod(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Employé</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Salaire brut</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">CNSS</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">IRPP</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Net</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {periodDetails.map((record) => (
                  <tr key={record.id}>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {record.employee_name || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      {(record.gross_salary || 0).toLocaleString()} F
                    </td>
                    <td className="py-3 px-4 text-orange-600">
                      {(record.salary_breakdown?.cnss_employee || 0).toLocaleString()} F
                    </td>
                    <td className="py-3 px-4 text-red-600">
                      {(record.tax_amount || 0).toLocaleString()} F
                    </td>
                    <td className="py-3 px-4 font-medium text-green-600">
                      {(record.net_salary || 0).toLocaleString()} F
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'validated' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status === 'validated' ? 'Validé' : 'Brouillon'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Résumé de la période */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {selectedPeriod.employeeCount}
                </div>
                <div className="text-sm text-gray-600">Employés</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {selectedPeriod.totalGross.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Brut total (F)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {selectedPeriod.totalNet.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Net total (F)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {(selectedPeriod.totalTax + selectedPeriod.totalCNSS).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Charges totales (F)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollHistory;