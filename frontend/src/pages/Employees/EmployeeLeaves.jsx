import React, { useState } from 'react';
import { Plus, Calendar, Clock, CheckCircle, Search, Filter, User, MapPin, MessageSquare, X } from 'lucide-react';

const EmployeeLeaves = () => {
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const leaveBalance = { 
    total: 25, 
    used: 10, 
    remaining: 15, 
    pending: 3,
    rtt: { total: 12, used: 4, remaining: 8 },
    sick: { used: 2, remaining: 'Illimité' }
  };
  
  const [leaveRequests] = useState([
    { 
      id: 1, 
      type: 'Congés payés', 
      startDate: '2024-01-15', 
      endDate: '2024-01-19', 
      days: 5, 
      status: 'Approuvé',
      reason: 'Vacances familiales',
      approver: 'Jean Martin',
      requestDate: '2023-12-20'
    },
    { 
      id: 2, 
      type: 'RTT', 
      startDate: '2024-01-08', 
      endDate: '2024-01-08', 
      days: 1, 
      status: 'Approuvé',
      reason: 'Rendez-vous médical',
      approver: 'Jean Martin',
      requestDate: '2024-01-02'
    },
    { 
      id: 3, 
      type: 'Congés payés', 
      startDate: '2024-02-12', 
      endDate: '2024-02-16', 
      days: 5, 
      status: 'En attente',
      reason: 'Vacances d\'hiver',
      approver: 'Jean Martin',
      requestDate: '2024-01-10'
    },
    { 
      id: 4, 
      type: 'Congé maladie', 
      startDate: '2023-12-18', 
      endDate: '2023-12-19', 
      days: 2, 
      status: 'Refusé',
      reason: 'Grippe',
      approver: 'Jean Martin',
      requestDate: '2023-12-18',
      refusalReason: 'Justificatif médical manquant'
    }
  ]);

  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Approuvé': return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
      case 'En attente': return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock };
      case 'Refusé': return { color: 'bg-red-100 text-red-800 border-red-200', icon: X };
      default: return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Congés</h1>
              <p className="text-gray-600 mt-1">Gérez vos demandes et consultez vos soldes</p>
            </div>
            <button 
              onClick={() => setShowNewRequestModal(true)}
              className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Nouvelle demande
            </button>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-secondary-600" />
                </div>
                <span className="text-3xl font-bold text-secondary-600">{leaveBalance.remaining}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Congés restants</h3>
              <p className="text-sm text-gray-600">Sur {leaveBalance.total} jours annuels</p>
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div className="bg-secondary-600 h-2 rounded-full" style={{width: `${(leaveBalance.remaining / leaveBalance.total) * 100}%`}}></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-3xl font-bold text-green-600">{leaveBalance.rtt.remaining}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">RTT restants</h3>
              <p className="text-sm text-gray-600">Sur {leaveBalance.rtt.total} jours</p>
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: `${(leaveBalance.rtt.remaining / leaveBalance.rtt.total) * 100}%`}}></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-3xl font-bold text-orange-600">{leaveBalance.used}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Jours pris</h3>
              <p className="text-sm text-gray-600">Cette année</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary-600" />
                </div>
                <span className="text-3xl font-bold text-primary-600">{leaveBalance.pending}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">En attente</h3>
              <p className="text-sm text-gray-600">Demandes à approuver</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une demande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 bg-white min-w-[160px]"
              >
                <option value="all">Tous les statuts</option>
                <option value="approuvé">Approuvé</option>
                <option value="attente">En attente</option>
                <option value="refusé">Refusé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const statusConfig = getStatusConfig(request.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={request.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{request.type}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                          {request.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Période</p>
                          <p className="font-medium text-gray-900">
                            {new Date(request.startDate).toLocaleDateString('fr-FR')} - {new Date(request.endDate).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-sm text-gray-500">{request.days} jour{request.days > 1 ? 's' : ''}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Motif</p>
                          <p className="font-medium text-gray-900">{request.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>Approbé par {request.approver}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Demandé le {new Date(request.requestDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      {request.refusalReason && (
                        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-800">Motif du refus</span>
                          </div>
                          <p className="text-sm text-red-700">{request.refusalReason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <StatusIcon className={`w-6 h-6 flex-shrink-0 ${
                    request.status === 'Approuvé' ? 'text-green-600' :
                    request.status === 'En attente' ? 'text-primary-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande trouvée</h3>
            <p className="text-gray-600">Essayez de modifier vos filtres ou créez une nouvelle demande.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeLeaves;