import { useState, useEffect } from 'react';
import { Users, Building2, Mail, Phone, Calendar, MoreVertical, UserMinus, Edit, Eye } from 'lucide-react';
import { systemService } from '../../services';
import { useAuthStore } from '../../store/useAuthStore';
import ManagerDetails from './ManagerDetails';
import Loader from '../../components/ui/Loader';
import Avatar from '../../components/ui/Avatar';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';

const ManagersList = () => {
  const { user } = useAuthStore();
  const [showRevokeModal, setShowRevokeModal] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadManagers = async () => {
      try {
        const response = await systemService.manager.getAll();
        setManagers(response.data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des managers:', error);
        setManagers([]);
      } finally {
        setLoading(false);
      }
    };
    loadManagers();
  }, []);

  const handleRevoke = async (managerId) => {
    try {
      // await systemService.manager.revoke(managerId);
      const response = await systemService.manager.getAll();
      setManagers(response.data || []);
    } catch (error) {
      console.error('Erreur lors de la révocation:', error);
    }
    setShowRevokeModal(null);
  };

  const canManage = user?.role === 'employer' || user?.role === 'hr_admin';

  if (selectedManager) {
    return (
      <ManagerDetails 
        manager={selectedManager} 
        onBack={() => setSelectedManager(null)} 
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Managers Actuels</h1>
          <p className="text-gray-600 mt-2">Liste des managers de département et leurs équipes</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader size={32} />
          <p className="mt-3 text-gray-600">Chargement...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(managers) ? managers.map((manager) => (
            <div key={manager.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar 
                  name={manager.name} 
                  size="lg"
                  variant="secondary"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {manager.name}
                  </h3>
                  <p className="text-sm text-gray-600">{manager.role}</p>
                </div>
              </div>
              
              {canManage && (
                <div className="relative">
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{manager.department?.name || 'Aucun département'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{manager.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{manager.department?.employees || 0} employés</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Depuis {manager.hire_date ? new Date(manager.hire_date).toLocaleDateString('fr-FR') : 'N/A'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-600">Performance: </span>
                  <span className={`font-medium ${
                    manager.department?.performance?.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {manager.department?.performance || 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedManager(manager)}
                  className="flex-1 bg-secondary-600 hover:bg-secondary-700 text-white text-sm py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Voir détails
                </button>
                
                {canManage && (
                  <button
                    onClick={() => setShowRevokeModal(manager.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <UserMinus className="w-4 h-4" />
                    Révoquer
                  </button>
                )}
              </div>
            </div>
            </div>
          )) : null}
        </div>
      )}

      {!loading && managers.length === 0 && (
        <EmptyState
          icon={Users}
          heading="Aucun manager"
          children={<p>Aucun manager n'a encore été nommé.</p>}
        />
      )}

      {/* Modal de révocation */}
      <Modal
        isOpen={!!showRevokeModal}
        onClose={() => setShowRevokeModal(null)}
        title="Révoquer le Manager"
        type="danger"
        onConfirm={() => handleRevoke(showRevokeModal)}
        confirmText="Révoquer"
        cancelText="Annuler"
      >
        <p className="text-gray-600">
          Êtes-vous sûr de vouloir révoquer ce manager ? Cette action ne peut pas être annulée.
        </p>
      </Modal>
    </div>
  );
};

export default ManagersList;