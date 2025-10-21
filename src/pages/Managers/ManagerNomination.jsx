import { useState } from 'react';
import { Users, Building2, MessageSquare, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import { employees, departments, users } from '../../data/mockData';
import { managerNominations, nominationStatuses } from '../../data/managerNominations';
import { useAuthStore } from '../../store/useAuthStore';

const ManagerNomination = () => {
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    proposedManagerId: '',
    departmentId: '',
    reason: '',
    comments: ''
  });

  const availableEmployees = employees.filter(emp => 
    !departments.some(dept => dept.managerId === users.find(u => u.employeeId === emp.id)?.id)
  );

  const availableDepartments = departments.filter(dept => !dept.managerId);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nouvelle nomination:', formData);
    setShowForm(false);
    setFormData({ proposedManagerId: '', departmentId: '', reason: '', comments: '' });
  };

  const handleApprove = (nominationId) => {
    console.log('Approuver nomination:', nominationId);
  };

  const handleReject = (nominationId) => {
    console.log('Refuser nomination:', nominationId);
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Inconnu';
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.name : 'Inconnu';
  };

  const getProposerName = (userId) => {
    const proposer = users.find(u => u.id === userId);
    return proposer ? `${proposer.firstName} ${proposer.lastName}` : 'Inconnu';
  };

  const canNominate = user?.role === 'employer' || user?.role === 'hr_admin';
  const canApprove = user?.role === 'employer';

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nomination des Managers</h1>
          <p className="text-gray-600 mt-2">Gérez les nominations et approbations des managers de département</p>
        </div>
        {canNominate && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Proposer un Manager
          </button>
        )}
      </div>

      {/* Formulaire de nomination */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Proposer un Manager</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employé à nommer</label>
                <select
                  value={formData.proposedManagerId}
                  onChange={(e) => setFormData({...formData, proposedManagerId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un employé</option>
                  {availableEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} - {emp.position}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Département</label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un département</option>
                  {availableDepartments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Raison de la nomination</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Expliquez pourquoi cette personne devrait être manager..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commentaires (optionnel)</label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({...formData, comments: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Commentaires additionnels..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Proposer
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des nominations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Demandes de Nomination</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {managerNominations.map((nomination) => {
            const status = nominationStatuses[nomination.status];
            const proposedEmployee = employees.find(emp => emp.id === nomination.proposedManagerId);
            
            return (
              <div key={nomination.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {proposedEmployee ? `${proposedEmployee.firstName} ${proposedEmployee.lastName}` : 'Employé inconnu'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Proposé pour: {getDepartmentName(nomination.departmentId)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Proposé par</p>
                        <p className="font-medium">{getProposerName(nomination.proposedBy)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date de proposition</p>
                        <p className="font-medium">{new Date(nomination.proposedAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Raison</p>
                      <p className="text-gray-900">{nomination.reason}</p>
                    </div>

                    {nomination.comments && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Commentaires</p>
                        <p className="text-gray-900">{nomination.comments}</p>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
                      {status.label}
                    </span>

                    {nomination.status === 'pending' && canApprove && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(nomination.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1 text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approuver
                        </button>
                        <button
                          onClick={() => handleReject(nomination.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 text-sm"
                        >
                          <XCircle className="w-4 h-4" />
                          Refuser
                        </button>
                      </div>
                    )}

                    {nomination.status === 'approved' && (
                      <div className="text-xs text-gray-500">
                        Approuvé le {new Date(nomination.approvedAt).toLocaleDateString('fr-FR')}
                      </div>
                    )}

                    {nomination.status === 'rejected' && (
                      <div className="text-xs text-gray-500">
                        Refusé le {new Date(nomination.rejectedAt).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ManagerNomination;