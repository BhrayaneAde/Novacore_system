import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, Check, X } from 'lucide-react';

const HRLeaves = () => {
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, employee: 'Sophie Martin', type: 'Congés payés', startDate: '2025-02-15', endDate: '2025-02-22', days: 6, reason: 'Vacances familiales', status: 'pending', requestDate: '2025-01-20' },
    { id: 2, employee: 'Thomas Dubois', type: 'RTT', startDate: '2025-02-10', endDate: '2025-02-10', days: 1, reason: 'Rendez-vous médical', status: 'pending', requestDate: '2025-01-18' },
    { id: 3, employee: 'Emma Rousseau', type: 'Congé maladie', startDate: '2025-01-25', endDate: '2025-01-26', days: 2, reason: 'Certificat médical joint', status: 'approved', requestDate: '2025-01-24' },
    { id: 4, employee: 'Pierre Moreau', type: 'Congés payés', startDate: '2025-03-01', endDate: '2025-03-08', days: 6, reason: 'Voyage', status: 'rejected', requestDate: '2025-01-15', rejectionReason: 'Période de forte activité' }
  ]);

  const handleLeaveAction = (id, action, reason = '') => {
    setLeaveRequests(prev => prev.map(request => 
      request.id === id 
        ? { ...request, status: action, rejectionReason: action === 'rejected' ? reason : undefined }
        : request
    ));
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gestion des Congés</h3>
              <p className="text-sm text-gray-600">Approuver ou rejeter les demandes</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
              {leaveRequests.filter(r => r.status === 'pending').length} en attente
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Employé</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Période</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Durée</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Motif</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Statut</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaveRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {request.employee.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{request.employee}</p>
                        <p className="text-sm text-gray-500">Demandé le {request.requestDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.type === 'Congés payés' ? 'bg-green-100 text-green-800' :
                      request.type === 'RTT' ? 'bg-blue-100 text-blue-800' :
                      request.type === 'Congé maladie' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-900">
                    <div>
                      <p className="font-medium">{request.startDate}</p>
                      {request.startDate !== request.endDate && (
                        <p className="text-sm text-gray-500">au {request.endDate}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">
                    <span className="font-semibold">{request.days}</span> jour{request.days > 1 ? 's' : ''}
                  </td>
                  <td className="py-4 px-6 text-gray-900 max-w-xs">
                    <p className="truncate" title={request.reason}>{request.reason}</p>
                    {request.rejectionReason && (
                      <p className="text-sm text-red-600 mt-1">Refusé: {request.rejectionReason}</p>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status === 'approved' ? 'Approuvé' :
                       request.status === 'rejected' ? 'Refusé' : 'En attente'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {request.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLeaveAction(request.id, 'approved')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approuver"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Motif du refus (optionnel):');
                            if (reason !== null) {
                              handleLeaveAction(request.id, 'rejected', reason || 'Aucun motif spécifié');
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Refuser"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Traité</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Statistiques rapides */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <h4 className="font-semibold text-yellow-900">En attente</h4>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {leaveRequests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Approuvés</h4>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {leaveRequests.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <X className="w-5 h-5 text-red-600" />
              <h4 className="font-semibold text-red-900">Refusés</h4>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {leaveRequests.filter(r => r.status === 'rejected').length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Total jours</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {leaveRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.days, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRLeaves;