import { useState, useEffect } from 'react';
import { Users, Building2, Mail, Phone, Calendar, MoreVertical, UserMinus, Edit, Eye } from 'lucide-react';
import { systemService } from '../../services';
import { useAuthStore } from '../../store/useAuthStore';
import ManagerDetails from './ManagerDetails';

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
        <div className="text-center py-8">
          <p>Chargement des managers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(managers) ? managers.map((manager) => (
            <div key={manager.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg font-medium text-blue-600">
                    {manager.name?.charAt(0) || 'M'}
                  </span>
                </div>
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors"
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
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun manager</h3>
          <p className="text-gray-600">Aucun manager n'a encore été nommé.</p>
        </div>
      )}

      {/* Modal de révocation */}
      {showRevokeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Révoquer le Manager</h2>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir révoquer ce manager ? Cette action ne peut pas être annulée.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleRevoke(showRevokeModal)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Révoquer
              </button>
              <button
                onClick={() => setShowRevokeModal(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagersList;