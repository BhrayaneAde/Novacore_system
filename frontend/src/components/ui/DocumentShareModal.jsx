import React, { useState, useEffect } from 'react';
import { X, Share2, Users, Calendar, MessageSquare } from 'lucide-react';
import { useHRStore } from '../../store/useHRStore';
import { usersService, employeesService } from '../../services';
import { useAuthStore } from '../../store/useAuthStore';
import Button from './Button';

const DocumentShareModal = ({ isOpen, onClose, document, ownerId }) => {
  const { shareDocument } = useHRStore();
  const { currentUser } = useAuthStore();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [permissions, setPermissions] = useState('read');
  const [message, setMessage] = useState('');
  const [expiryDays, setExpiryDays] = useState(30);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [loading, setLoading] = useState(false);

  // Groupes prédéfinis
  const shareGroups = [
    { id: 'my_team', name: 'Mon équipe', description: 'Membres de mon équipe directe' },
    { id: 'my_department', name: 'Mon département', description: 'Tous les membres du département' },
    { id: 'managers', name: 'Managers', description: 'Tous les managers' },
    { id: 'all_employees', name: 'Tous les employés', description: 'Tous les employés de l\'entreprise' }
  ];

  useEffect(() => {
    if (isOpen) {
      loadEmployees();
    }
  }, [isOpen]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeesService.getAll();
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !document) return null;

  const currentEmployee = employees.find(emp => emp.user_id === currentUser?.id);
  const availableEmployees = employees.filter(emp => emp.user_id !== currentUser?.id);

  const handleGroupSelect = (groupId) => {
    setSelectedGroup(groupId);
    const group = shareGroups.find(g => g.id === groupId);
    if (group) {
      let groupMembers = [];
      switch (groupId) {
        case 'my_team':
        case 'my_department':
          groupMembers = availableEmployees.filter(emp => emp.department_id === currentEmployee?.department_id);
          break;
        case 'managers':
          groupMembers = availableEmployees.filter(emp => 
            emp.position?.toLowerCase().includes('manager') || 
            emp.position?.toLowerCase().includes('chef') ||
            emp.position?.toLowerCase().includes('responsable')
          );
          break;
        case 'all_employees':
          groupMembers = availableEmployees;
          break;
      }
      setSelectedEmployees(groupMembers.map(emp => emp.id));
    }
  };

  const handleEmployeeToggle = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
    setSelectedGroup(''); // Reset group selection when manually selecting
  };

  const handleShare = () => {
    if (selectedEmployees.length === 0) return;

    const expiryDate = expiryDays ? 
      new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
      : null;

    shareDocument(document.id, ownerId, selectedEmployees, permissions, {
      message,
      expiryDate
    });

    onClose();
    setSelectedEmployees([]);
    setMessage('');
    setSelectedGroup('');
  };

  const permissionOptions = [
    { value: 'read', label: 'Lecture seule', description: 'Peut uniquement consulter le document' },
    { value: 'download', label: 'Lecture + Téléchargement', description: 'Peut consulter et télécharger' },
    { value: 'comment', label: 'Lecture + Commentaires', description: 'Peut consulter et commenter' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Share2 className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Partager le document</h3>
              <p className="text-sm text-gray-600">{document.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Groupes prédéfinis */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Groupes rapides</h4>
          <div className="grid grid-cols-2 gap-2">
            {shareGroups.map(group => (
              <button
                key={group.id}
                onClick={() => handleGroupSelect(group.id)}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  selectedGroup === group.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="font-medium text-sm">{group.name}</span>
                </div>
                <p className="text-xs text-gray-500">{group.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sélection individuelle */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Sélectionner des employés ({selectedEmployees.length} sélectionnés)
          </h4>
          <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
            {availableEmployees.map(employee => (
              <label
                key={employee.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={selectedEmployees.includes(employee.id)}
                  onChange={() => handleEmployeeToggle(employee.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {employee.first_name?.[0]}{employee.last_name?.[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{employee.first_name} {employee.last_name}</p>
                  <p className="text-xs text-gray-500">{employee.position} • {employee.department?.name}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Permissions */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Permissions</h4>
          <div className="space-y-2">
            {permissionOptions.map(option => (
              <label
                key={option.value}
                className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="permissions"
                  value={option.value}
                  checked={permissions === option.value}
                  onChange={(e) => setPermissions(e.target.value)}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{option.label}</p>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Message et expiration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Message (optionnel)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ajouter un message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Expiration
            </label>
            <select
              value={expiryDays}
              onChange={(e) => setExpiryDays(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={7}>7 jours</option>
              <option value={30}>30 jours</option>
              <option value={90}>90 jours</option>
              <option value={365}>1 an</option>
              <option value={0}>Jamais</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleShare}
            disabled={selectedEmployees.length === 0}
            icon={Share2}
          >
            Partager ({selectedEmployees.length})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentShareModal;