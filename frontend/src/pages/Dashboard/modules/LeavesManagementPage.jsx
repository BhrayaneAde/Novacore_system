import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, Check, X, Clock } from 'lucide-react';
import { leavesService } from '../../../services';
import LeaveRequestForm from '../../../components/forms/LeaveRequestForm';
import Loader from '../../../components/ui/Loader';

const LeavesManagementPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const response = await leavesService.getAll();
      setLeaves(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des congés:', error);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedLeave) {
        await leavesService.update(selectedLeave.id, formData);
      } else {
        await leavesService.create(formData);
      }
      await loadLeaves();
      setShowForm(false);
      setSelectedLeave(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      try {
        await leavesService.delete(id);
        await loadLeaves();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleStatusUpdate = async (id, status, reason = '') => {
    try {
      await leavesService.updateStatus(id, status, reason);
      await loadLeaves();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      vacation: 'Congés payés',
      sick: 'Congé maladie',
      personal: 'Congé personnel',
      maternity: 'Congé maternité',
      paternity: 'Congé paternité',
      rtt: 'RTT'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Congés</h1>
          <p className="text-gray-600">{leaves.length} demandes au total</p>
        </div>
        <button
          onClick={() => {
            setSelectedLeave(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle demande
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Employé</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Période</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Durée</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Statut</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {leave.employee?.name?.charAt(0) || 'E'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{leave.employee?.name || 'Employé'}</p>
                        <p className="text-sm text-gray-500">Demandé le {leave.request_date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                      {getTypeLabel(leave.type)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium">{leave.start_date}</p>
                      <p className="text-sm text-gray-500">au {leave.end_date}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold">{leave.days}</span> jour{leave.days > 1 ? 's' : ''}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                      {leave.status === 'approved' ? 'Approuvé' :
                       leave.status === 'rejected' ? 'Refusé' : 'En attente'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {leave.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(leave.id, 'approved')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Approuver"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Motif du refus:');
                              if (reason !== null) {
                                handleStatusUpdate(leave.id, 'rejected', reason);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Refuser"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setSelectedLeave(leave);
                          setShowForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(leave.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <LeaveRequestForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedLeave(null);
        }}
        onSave={handleSave}
        leaveRequest={selectedLeave}
      />
    </div>
  );
};

export default LeavesManagementPage;