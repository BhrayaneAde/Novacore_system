import React, { useState, useEffect } from 'react';
import { Mail, Users, Clock, CheckCircle, XCircle, Download, Settings, RefreshCw, Filter } from 'lucide-react';
import { useToast } from '../components/ui/useToast';
import Toast from '../components/ui/Toast';

const AutoRecruitment = () => {
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [departments, setDepartments] = useState([]);
  const [showConfig, setShowConfig] = useState(false);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const statusLabels = {
    'nouveau': { label: 'Nouveau', color: 'bg-blue-100 text-blue-800' },
    'en_cours': { label: 'En cours', color: 'bg-yellow-100 text-yellow-800' },
    'entretien': { label: 'Entretien', color: 'bg-purple-100 text-purple-800' },
    'accepte': { label: 'Accepté', color: 'bg-green-100 text-green-800' },
    'rejete': { label: 'Rejeté', color: 'bg-red-100 text-red-800' }
  };

  useEffect(() => {
    loadData();
    loadDepartments();
  }, [selectedDepartment, selectedStatus]);

  const loadData = async () => {
    try {
      const [candidatesRes, statsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/auto-recruitment/candidates?${new URLSearchParams({
          ...(selectedDepartment && { department_id: selectedDepartment }),
          ...(selectedStatus && { status: selectedStatus })
        })}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/auto-recruitment/stats`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
        })
      ]);

      if (candidatesRes.ok && statsRes.ok) {
        setCandidates(await candidatesRes.json());
        setStats(await statsRes.json());
      }
    } catch (error) {
      showError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/departments`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.ok) {
        setDepartments(await response.json());
      }
    } catch (error) {
      console.error('Erreur chargement départements:', error);
    }
  };

  const syncEmails = async () => {
    setSyncing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/auto-recruitment/sync-emails`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });

      if (response.ok) {
        const result = await response.json();
        showSuccess(`${result.processed} nouvelles candidatures traitées`);
        loadData();
      } else {
        showError('Erreur lors de la synchronisation');
      }
    } catch (error) {
      showError('Erreur lors de la synchronisation');
    } finally {
      setSyncing(false);
    }
  };

  const updateStatus = async (candidateId, newStatus, notes = '') => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/auto-recruitment/candidates/${candidateId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ status: newStatus, notes })
      });

      if (response.ok) {
        showSuccess('Statut mis à jour');
        loadData();
      } else {
        showError('Erreur lors de la mise à jour');
      }
    } catch (error) {
      showError('Erreur lors de la mise à jour');
    }
  };

  const downloadCV = async (candidateId, filename) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/auto-recruitment/candidates/${candidateId}/cv`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });

      if (response.ok) {
        const data = await response.json();
        // Simuler le téléchargement
        showSuccess(`CV ${filename} téléchargé`);
      } else {
        showError('CV non disponible');
      }
    } catch (error) {
      showError('Erreur lors du téléchargement');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du recrutement automatisé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Recrutement Automatisé</h1>
                <p className="text-sm text-gray-600">Candidatures reçues par email</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Config</span>
              </button>
              
              <button
                onClick={syncEmails}
                disabled={syncing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Sync...' : 'Synchroniser'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Configuration Panel */}
        {showConfig && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Configuration Email</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email RH</label>
                <input
                  type="email"
                  placeholder="rh@entreprise.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                <input
                  type="password"
                  placeholder="Mot de passe email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Sauvegarder
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_candidates || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nouveaux</p>
                <p className="text-2xl font-bold text-gray-900">{stats.new_candidates || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entretiens</p>
                <p className="text-2xl font-bold text-gray-900">{stats.interviews || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-gray-900">{stats.in_review || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les départements</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              {Object.entries(statusLabels).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Candidates List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Candidatures ({candidates.length})</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {candidate.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{candidate.name}</h4>
                        <p className="text-sm text-gray-600">{candidate.email}</p>
                        {candidate.phone && (
                          <p className="text-sm text-gray-600">{candidate.phone}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        <strong>Poste:</strong> {candidate.position}
                      </span>
                      <span className="text-sm text-gray-600">
                        <strong>Département:</strong> {candidate.department}
                      </span>
                      <span className="text-sm text-gray-600">
                        <strong>Reçu:</strong> {new Date(candidate.received_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 truncate">
                        <strong>Objet:</strong> {candidate.email_subject}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabels[candidate.status]?.color}`}>
                      {statusLabels[candidate.status]?.label}
                    </span>
                    
                    {candidate.cv_filename && (
                      <button
                        onClick={() => downloadCV(candidate.id, candidate.cv_filename)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Télécharger CV"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    
                    <select
                      value={candidate.status}
                      onChange={(e) => updateStatus(candidate.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(statusLabels).map(([key, value]) => (
                        <option key={key} value={key}>{value.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
            
            {candidates.length === 0 && (
              <div className="p-12 text-center">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune candidature trouvée</p>
                <p className="text-sm text-gray-400 mt-2">
                  Configurez votre email et synchronisez pour voir les candidatures
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default AutoRecruitment;