import React, { useState, useEffect } from 'react';
import { FileText, Download, Mail, BarChart3, Calendar, Users } from 'lucide-react';
import api from '../../services/api';

const PayrollReports = ({ period }) => {
  const [employees, setEmployees] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingEmails, setSendingEmails] = useState(false);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    try {
      const [employeesRes, analyticsRes] = await Promise.all([
        api.get(`/payroll/records/?period=${period}`),
        api.get(`/payroll-reports/analytics/${period}`)
      ]);
      
      setEmployees(employeesRes.data.records || []);
      setAnalytics(analyticsRes.data.analytics || []);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
  };

  const downloadPayslip = async (employeeId, employeeName) => {
    try {
      const response = await api.get(`/payroll-reports/payslip/${employeeId}/${period}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bulletin_${employeeName}_${period}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur téléchargement:', error);
    }
  };

  const downloadJournal = async () => {
    try {
      const response = await api.get(`/payroll-reports/journal/${period}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `journal_paie_${period}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur téléchargement journal:', error);
    }
  };

  const sendAllPayslips = async () => {
    setSendingEmails(true);
    try {
      const response = await api.post(`/payroll-reports/send-payslips/${period}`);
      alert(`${response.data.sent_count} bulletins envoyés avec succès`);
    } catch (error) {
      console.error('Erreur envoi emails:', error);
      alert('Erreur lors de l\'envoi des emails');
    } finally {
      setSendingEmails(false);
    }
  };

  const exportAccounting = async () => {
    try {
      const response = await api.get(`/payroll-reports/export-accounting/${period}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `export_comptable_${period}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur export comptable:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions principales */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions de diffusion</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={downloadJournal}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span>Journal de paie</span>
          </button>
          
          <button
            onClick={sendAllPayslips}
            disabled={sendingEmails}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
          >
            <Mail className="w-5 h-5" />
            <span>{sendingEmails ? 'Envoi...' : 'Envoyer bulletins'}</span>
          </button>
          
          <button
            onClick={exportAccounting}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export comptable</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
            <BarChart3 className="w-5 h-5" />
            <span>Déclarations</span>
          </button>
        </div>
      </div>

      {/* Bulletins individuels */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulletins de paie individuels</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Employé</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Net à payer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map(employee => (
                <tr key={employee.id}>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {employee.employee_name || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {(employee.net_salary || 0).toLocaleString()} F
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      employee.status === 'validated' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {employee.status === 'validated' ? 'Validé' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => downloadPayslip(employee.employee_id, employee.employee_name)}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics par département */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse par département</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.map((dept, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{dept.department}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Employés:</span>
                  <span className="font-medium">{dept.employee_count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Masse salariale:</span>
                  <span className="font-medium">{dept.total_gross?.toLocaleString()} F</span>
                </div>
                <div className="flex justify-between">
                  <span>Salaire moyen:</span>
                  <span className="font-medium">{dept.average_salary?.toLocaleString()} F</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PayrollReports;