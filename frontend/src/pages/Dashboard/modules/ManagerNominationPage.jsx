import React, { useState } from 'react';
import { Crown, Check, X, Clock, User, Award } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

const ManagerNominationPage = () => {
  const { currentUser, isEmployer } = useAuthStore();
  const [nominations, setNominations] = useState([
    {
      id: 1,
      nominee: 'Lucas Martin',
      nominator: 'Emma Rousseau',
      department: 'Design',
      position: 'Manager Design',
      reason: 'Excellentes compétences en leadership et vision créative',
      date: '2025-01-15',
      status: 'pending',
      skills: ['Leadership', 'Créativité', 'Communication'],
      experience: '5 ans'
    },
    {
      id: 2,
      nominee: 'Sophie Martin',
      nominator: 'Pierre Moreau',
      department: 'Ventes',
      position: 'Manager Commercial',
      reason: 'Résultats exceptionnels et capacité à motiver l\'équipe',
      date: '2025-01-12',
      status: 'approved',
      skills: ['Négociation', 'Management', 'Stratégie'],
      experience: '7 ans'
    },
    {
      id: 3,
      nominee: 'Antoine Moreau',
      nominator: 'Thomas Dubois',
      department: 'IT',
      position: 'Tech Lead',
      reason: 'Expertise technique et mentorat des développeurs juniors',
      date: '2025-01-10',
      status: 'rejected',
      rejectionReason: 'Manque d\'expérience en management',
      skills: ['Technique', 'Mentorat', 'Innovation'],
      experience: '3 ans'
    }
  ]);

  if (!isEmployer()) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
          <Crown className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-900 mb-2">Accès Restreint</h2>
          <p className="text-red-700">Seul l'employeur peut valider les nominations de managers.</p>
        </div>
      </div>
    );
  }

  const handleNomination = (id, action, reason = '') => {
    setNominations(prev => prev.map(nom => 
      nom.id === id 
        ? { ...nom, status: action, rejectionReason: action === 'rejected' ? reason : undefined }
        : nom
    ));
  };

  const pendingCount = nominations.filter(n => n.status === 'pending').length;
  const approvedCount = nominations.filter(n => n.status === 'approved').length;
  const rejectedCount = nominations.filter(n => n.status === 'rejected').length;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Validation des Nominations</h1>
        <p className="text-gray-600">Approuvez ou rejetez les nominations de managers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h3 className="font-semibold text-gray-900">En attente</h3>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Check className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-900">Approuvées</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <X className="w-6 h-6 text-red-600" />
            <h3 className="font-semibold text-gray-900">Rejetées</h3>
          </div>
          <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Total</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">{nominations.length}</p>
        </div>
      </div>

      {/* Nominations List */}
      <div className="space-y-6">
        {nominations.map(nomination => (
          <div key={nomination.id} className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {nomination.nominee.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{nomination.nominee}</h3>
                  <p className="text-gray-600">Candidat pour {nomination.position}</p>
                  <p className="text-sm text-gray-500">Nominé par {nomination.nominator} • {nomination.date}</p>
                </div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                nomination.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                nomination.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {nomination.status === 'pending' ? 'En attente' :
                 nomination.status === 'approved' ? 'Approuvé' : 'Rejeté'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Informations</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Département:</span> {nomination.department}</p>
                  <p><span className="font-medium">Expérience:</span> {nomination.experience}</p>
                  <p><span className="font-medium">Poste visé:</span> {nomination.position}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Compétences clés</h4>
                <div className="flex flex-wrap gap-2">
                  {nomination.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Justification</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{nomination.reason}</p>
            </div>

            {nomination.rejectionReason && (
              <div className="mb-6">
                <h4 className="font-semibold text-red-900 mb-2">Motif de rejet</h4>
                <p className="text-red-700 bg-red-50 p-4 rounded-lg">{nomination.rejectionReason}</p>
              </div>
            )}

            {nomination.status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleNomination(nomination.id, 'approved')}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Approuver
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Motif du rejet (optionnel):');
                    if (reason !== null) {
                      handleNomination(nomination.id, 'rejected', reason || 'Aucun motif spécifié');
                    }
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Rejeter
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Formation des nouveaux managers */}
      <div className="mt-12 bg-blue-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-900">Formation des Nouveaux Managers</h2>
        </div>
        <p className="text-blue-700 mb-4">
          Les managers approuvés doivent suivre un programme de formation obligatoire.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            'Leadership & Communication',
            'Gestion d\'équipe',
            'Évaluation des performances'
          ].map((module, index) => (
            <div key={index} className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">{module}</h4>
              <p className="text-sm text-gray-600">Durée: 2 jours</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerNominationPage;