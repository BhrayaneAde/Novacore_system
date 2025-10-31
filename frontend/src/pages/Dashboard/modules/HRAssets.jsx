import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, Printer, Laptop, Plus, Search, Filter, QrCode, Tag, MapPin, User, Calendar, AlertTriangle, CheckCircle, Clock, Edit3, Trash2, X } from 'lucide-react';
import { employeesService } from '../../../services/employees';
import apiClient from '../../../api/client';

const HRAssets = () => {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assignData, setAssignData] = useState({
    asset_id: '',
    employee_id: '',
    location: '',
    notes: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    category: 'Ordinateur',
    brand: '',
    model: '',
    serial_number: '',
    purchase_date: '',
    warranty_end: '',
    location: '',
    value: '',
    description: '',
    tags: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assetsRes, employeesRes] = await Promise.all([
        apiClient.get('/hr-assets/'),
        employeesService.getAll()
      ]);
      setAssets(assetsRes.data || []);
      setEmployees(employeesRes.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAsset) {
        await apiClient.put(`/hr-assets/${selectedAsset.id}`, formData);
      } else {
        await apiClient.post('/hr-assets/', formData);
      }
      await loadData();
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (assetId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) {
      try {
        await apiClient.delete(`/hr-assets/${assetId}`);
        await loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleAssign = async (assetId, employeeId) => {
    try {
      await apiClient.post(`/hr-assets/${assetId}/assign/${employeeId}`);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
    }
  };

  const handleUnassign = async (assetId) => {
    try {
      await apiClient.post(`/hr-assets/${assetId}/unassign`);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la désassignation:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Ordinateur',
      brand: '',
      model: '',
      serial_number: '',
      purchase_date: '',
      warranty_end: '',
      location: '',
      value: '',
      description: '',
      tags: []
    });
    setSelectedAsset(null);
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const openEditModal = (asset) => {
    setSelectedAsset(asset);
    setFormData({
      name: asset.name || '',
      category: asset.category || 'Ordinateur',
      brand: asset.brand || '',
      model: asset.model || '',
      serial_number: asset.serial_number || '',
      purchase_date: asset.purchase_date || '',
      warranty_end: asset.warranty_end || '',
      location: asset.location || '',
      value: asset.value || '',
      description: asset.description || '',
      tags: asset.tags?.map(t => t.tag_name) || []
    });
    setShowEditModal(true);
  };

  const categories = ['Ordinateur', 'Téléphone', 'Imprimante', 'Moniteur', 'Mobilier', 'Accessoire'];
  const statuses = ['Disponible', 'Assigné', 'Maintenance', 'Hors service'];
  const conditions = ['Excellent', 'Bon', 'Moyen', 'Réparation'];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.asset_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assigned_to?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || asset.category === filterCategory;
    const matchesStatus = !filterStatus || asset.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des équipements...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Disponible': return 'bg-green-100 text-green-800';
      case 'Assigné': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Hors service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Bon': return 'bg-blue-100 text-blue-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Réparation': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Ordinateur': return <Laptop className="w-4 h-4" />;
      case 'Téléphone': return <Smartphone className="w-4 h-4" />;
      case 'Imprimante': return <Printer className="w-4 h-4" />;
      case 'Moniteur': return <Monitor className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  const generateQRCode = (assetId) => {
    // Simulation de génération QR code
    alert(`QR Code généré pour l'équipement ${assetId}`);
  };

  const printLabel = (asset) => {
    // Simulation d'impression d'étiquette
    alert(`Étiquette imprimée pour ${asset.name} (${asset.asset_id})`);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Monitor className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gestion des Équipements</h3>
              <p className="text-sm text-gray-600">Suivi et étiquetage des actifs de l'entreprise</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowInventoryModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Tag className="w-4 h-4" />
              Répertorier Équipements
            </button>
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <User className="w-4 h-4" />
              Assigner Équipement
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter Équipement
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Disponibles</h4>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {assets.filter(a => a.status === 'Disponible').length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Assignés</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {assets.filter(a => a.status === 'Assigné').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <h4 className="font-semibold text-yellow-900">Maintenance</h4>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {assets.filter(a => a.status === 'Maintenance').length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-5 h-5 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Total</h4>
            </div>
            <p className="text-2xl font-bold text-gray-600">{assets.length}</p>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, ID ou assigné..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes catégories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous statuts</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Table des équipements */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Équipement</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Catégorie</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Assigné à</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Localisation</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">État</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Statut</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(asset.category)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{asset.name}</p>
                        <p className="text-sm text-gray-500">ID: {asset.asset_id}</p>
                        <div className="flex gap-1 mt-1">
                          {asset.tags?.map(tag => (
                            <span key={tag.id} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag.tag_name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{asset.category}</p>
                      <p className="text-sm text-gray-500">{asset.brand} {asset.model}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {asset.assigned_to ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-xs">
                            {asset.assigned_to.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-900">{asset.assigned_to.name}</span>
                          <p className="text-xs text-gray-500">{asset.assigned_to.email}</p>
                        </div>
                      </div>
                    ) : (
                      <select
                        onChange={(e) => e.target.value && handleAssign(asset.id, parseInt(e.target.value))}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                        defaultValue=""
                      >
                        <option value="">Assigner à...</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{asset.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(asset.condition)}`}>
                      {asset.condition}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => generateQRCode(asset.asset_id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Générer QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => printLabel(asset)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Imprimer étiquette"
                      >
                        <Tag className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(asset)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {asset.assigned_to && (
                        <button
                          onClick={() => handleUnassign(asset.id)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Désassigner"
                        >
                          <User className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(asset.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

        {filteredAssets.length === 0 && (
          <div className="text-center py-12">
            <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun équipement trouvé</p>
          </div>
        )}

        {/* Récapitulatif des équipements */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif des Équipements</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {assets.filter(a => a.status === 'Disponible').length}
              </p>
              <p className="text-sm text-gray-600">Non utilisés</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {assets.filter(a => a.status === 'Assigné').length}
              </p>
              <p className="text-sm text-gray-600">Fonctionnels</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {assets.filter(a => a.status === 'Hors service').length}
              </p>
              <p className="text-sm text-gray-600">En panne</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {assets.filter(a => a.status === 'Maintenance').length}
              </p>
              <p className="text-sm text-gray-600">En maintenance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Répertorier Équipements */}
      {showInventoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Répertorier les Équipements de l'Entreprise</h3>
              <button onClick={() => setShowInventoryModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Instructions</h4>
                <p className="text-blue-800 text-sm">
                  Utilisez ce formulaire pour ajouter rapidement plusieurs équipements à votre inventaire.
                  Vous pourrez ensuite les assigner aux employés selon vos besoins.
                </p>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'équipement</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Ex: MacBook Pro 16 pouces" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                    <input type="number" min="1" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="1" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Apple, Dell, HP..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Bureau, Entrepôt..." />
                  </div>
                </div>
                
                <button type="button" className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                  Ajouter à l'inventaire
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Assignation */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Assigner un Équipement</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Équipement</label>
                <select 
                  value={assignData.asset_id}
                  onChange={(e) => setAssignData({...assignData, asset_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Sélectionner un équipement...</option>
                  {assets.filter(a => a.status === 'Disponible').map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} ({asset.asset_id}) - {asset.category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employé</label>
                <select 
                  value={assignData.employee_id}
                  onChange={(e) => setAssignData({...assignData, employee_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Sélectionner un employé...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.email}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nouvelle localisation</label>
                <input 
                  type="text"
                  value={assignData.location}
                  onChange={(e) => setAssignData({...assignData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Bureau 201, Domicile, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
                <textarea 
                  value={assignData.notes}
                  onChange={(e) => setAssignData({...assignData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Informations complémentaires..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={async () => {
                    if (assignData.asset_id && assignData.employee_id) {
                      await handleAssign(parseInt(assignData.asset_id), parseInt(assignData.employee_id));
                      setAssignData({ asset_id: '', employee_id: '', location: '', notes: '' });
                      setShowAssignModal(false);
                    }
                  }}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                >
                  Assigner
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajout/Modification */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                {selectedAsset ? 'Modifier l\'équipement' : 'Ajouter un équipement'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de série</label>
                  <input
                    type="text"
                    value={formData.serial_number}
                    onChange={(e) => setFormData({...formData, serial_number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d\'achat</label>
                  <input
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fin de garantie</label>
                  <input
                    type="date"
                    value={formData.warranty_end}
                    onChange={(e) => setFormData({...formData, warranty_end: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valeur (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {selectedAsset ? 'Modifier' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRAssets;