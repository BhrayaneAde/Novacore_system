import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Send, Filter, Calendar, User, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { payrollCalculationAPI, payslipsAPI } from '../../services/api';

const PayslipManagement = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-03');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  useEffect(() => {
    loadPayslips();
  }, [selectedPeriod, statusFilter]);

  const loadPayslips = async () => {
    setLoading(true);
    try {
      const params = {
        period: selectedPeriod,
        ...(statusFilter !== 'all' && { status: statusFilter })
      };
      
      const response = await payslipsAPI.getPayslips(params);
      const payslipsData = response.data || [];
      
      // Formatage des données pour l'affichage
      const formattedPayslips = payslipsData.map(payslip => ({
        id: payslip.id,
        employeeId: payslip.employee_id,
        employeName: payslip.employee_name,
        period: payslip.period,
        baseSalary: payslip.base_salary,
        grossSalary: payslip.gross_salary,
        netSalary: payslip.net_salary,
        deductions: payslip.deductions,
        status: payslip.status,
        generatedAt: payslip.generated_at,
        sentAt: payslip.sent_at
      }));
      
      setPayslips(formattedPayslips);
    } catch (error) {
      console.error('Erreur lors du chargement des bulletins:', error);
      // Fallback vers des données simulées en cas d'erreur
      setPayslips([]);
    } finally {
      setLoading(false);
    }
  };

  const generatePayslips = async () => {
    try {
      const response = await payslipsAPI.generatePayslips({
        period: selectedPeriod,
        employee_ids: null
      });
      
      if (response.data.payslips) {
        loadPayslips();
        alert(`${response.data.payslips.length} bulletins générés avec succès`);
      }
    } catch (error) {
      console.error('Erreur génération bulletins:', error);
      alert('Erreur lors de la génération');
    }
  };

  const sendPayslip = async (payslipId) => {
    try {
      const response = await payslipsAPI.sendPayslip(payslipId);
      setPayslips(payslips.map(p => 
        p.id === payslipId 
          ? { ...p, status: 'sent', sentAt: new Date().toISOString() }
          : p
      ));
      alert(`Bulletin envoyé avec succès à ${response.data.sent_to}`);
    } catch (error) {
      console.error('Erreur envoi bulletin:', error);
      alert('Erreur lors de l\'envoi');
    }
  };

  const downloadPayslip = async (payslipId) => {
    try {
      const response = await payslipsAPI.downloadPayslip(payslipId);
      
      // Création du lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Nom du fichier depuis les headers ou par défaut
      const contentDisposition = response.headers['content-disposition'];
      let filename = `bulletin_paie_${payslipId}.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      alert('Erreur lors du téléchargement');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Brouillon' },
      generated: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Généré' },
      validated: { bg: 'bg-green-100', text: 'text-green-800', label: 'Validé' },
      sent: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Envoyé' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const stats = {
    total: payslips.length,
    generated: payslips.filter(p => p.status === 'generated').length,
    sent: payslips.filter(p => p.status === 'sent').length,
    validated: payslips.filter(p => p.status === 'validated').length
  };

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bulletins de Paie</h2>
              <p className="text-gray-600">Génération et gestion des bulletins</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="2024-01">Janvier 2024</option>
              <option value="2024-02">Février 2024</option>
              <option value="2024-03">Mars 2024</option>
            </select>
            
            <button
              onClick={generatePayslips}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Générer bulletins</span>
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Générés</p>
                <p className="text-2xl font-bold text-green-900">{stats.generated}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Envoyés</p>
                <p className="text-2xl font-bold text-purple-900">{stats.sent}</p>
              </div>
              <Send className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Validés</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.validated}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="generated">Générés</option>
            <option value="validated">Validés</option>
            <option value="sent">Envoyés</option>
          </select>
        </div>
      </div>

      {/* Liste des bulletins */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : payslips.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employé</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salaire brut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salaire net</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payslips.map((payslip) => (
                  <tr key={payslip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{payslip.employeName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(payslip.period + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {payslip.grossSalary.toLocaleString()} €
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600">
                      {payslip.netSalary.toLocaleString()} €
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(payslip.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedPayslip(payslip)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Voir"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadPayslip(payslip.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Télécharger PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {payslip.status === 'validated' && (
                          <button
                            onClick={() => sendPayslip(payslip.id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                            title="Envoyer"
                          >
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
        ) : (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun bulletin trouvé</h3>
            <p className="text-gray-500">Générez des bulletins pour la période sélectionnée</p>
          </div>
        )}
      </div>

      {/* Modal de prévisualisation */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  Bulletin de paie - {selectedPayslip.employeName}
                </h3>
                <button
                  onClick={() => setSelectedPayslip(null)}
                  className="text-white hover:text-gray-200"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Période</label>
                    <p className="text-lg font-semibold">
                      {new Date(selectedPayslip.period + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Statut</label>
                    <div className="mt-1">{getStatusBadge(selectedPayslip.status)}</div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Détails du salaire</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Salaire de base</span>
                      <span className="font-medium">{selectedPayslip.baseSalary.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Salaire brut</span>
                      <span className="font-medium">{selectedPayslip.grossSalary.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Déductions totales</span>
                      <span className="font-medium">-{selectedPayslip.deductions.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-green-600 border-t pt-2">
                      <span>Salaire net</span>
                      <span>{selectedPayslip.netSalary.toLocaleString()} €</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayslipManagement;