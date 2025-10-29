import React, { useState } from 'react';
import { MessageSquare, Calendar, Plus, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

const OneOnOnePage = () => {
  const { currentUser, isManager, isSeniorManager } = useAuthStore();
  
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      employeeName: 'Lucas Martin',
      employeeId: 1,
      date: '2025-01-25',
      time: '14:00',
      duration: 30,
      status: 'scheduled',
      type: 'regular',
      agenda: [
        'Performance du mois',
        'Objectifs en cours',
        'Besoins de formation',
        'Feedback bidirectionnel'
      ],
      notes: '',
      actionItems: [],
      lastMeeting: '2024-12-20'
    },
    {
      id: 2,
      employeeName: 'Camille Dubois',
      employeeId: 2,
      date: '2025-01-22',
      time: '10:30',
      duration: 45,
      status: 'completed',
      type: 'performance',
      agenda: [
        'Révision des objectifs Q4',
        'Plan de développement 2025',
        'Challenges rencontrés',
        'Reconnaissance des réussites'
      ],
      notes: 'Excellente progression sur les projets. Intérêt pour une formation en leadership.',
      actionItems: [
        { task: 'Inscription formation leadership', deadline: '2025-02-01', completed: false },
        { task: 'Définir objectifs Q1', deadline: '2025-01-30', completed: true }
      ],
      lastMeeting: '2024-12-15'
    },
    {
      id: 3,
      employeeName: 'Antoine Moreau',
      employeeId: 3,
      date: '2025-01-20',
      time: '16:00',
      duration: 60,
      status: 'completed',
      type: 'development',
      agenda: [
        'Évolution de carrière',
        'Compétences à développer',
        'Opportunités internes',
        'Plan de mentorat'
      ],
      notes: 'Motivation élevée pour évoluer vers un poste de senior. Besoin de renforcer les compétences techniques.',
      actionItems: [
        { task: 'Certification AWS', deadline: '2025-03-01', completed: false },
        { task: 'Mentorat junior dev', deadline: '2025-02-15', completed: false }
      ],
      lastMeeting: '2024-11-20'
    }
  ]);

  const [newMeeting, setNewMeeting] = useState({
    employeeName: '',
    date: '',
    time: '',
    duration: 30,
    type: 'regular',
    agenda: ['Performance du mois', 'Objectifs en cours', 'Feedback']
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  if (!isManager() && !isSeniorManager()) {
    return (
      <div className="p-6 text-center">
        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès Manager Requis</h2>
        <p className="text-gray-600">Cette fonctionnalité est réservée aux managers.</p>
      </div>
    );
  }

  const handleCreateMeeting = () => {
    const meeting = {
      id: Date.now(),
      ...newMeeting,
      employeeId: Date.now(),
      status: 'scheduled',
      notes: '',
      actionItems: [],
      lastMeeting: null
    };
    setMeetings([...meetings, meeting]);
    setNewMeeting({
      employeeName: '',
      date: '',
      time: '',
      duration: 30,
      type: 'regular',
      agenda: ['Performance du mois', 'Objectifs en cours', 'Feedback']
    });
    setShowCreateModal(false);
  };

  const updateMeetingNotes = (meetingId, notes) => {
    setMeetings(meetings.map(m => 
      m.id === meetingId ? { ...m, notes, status: 'completed' } : m
    ));
  };

  const addActionItem = (meetingId, task, deadline) => {
    setMeetings(meetings.map(m => 
      m.id === meetingId 
        ? { 
            ...m, 
            actionItems: [...m.actionItems, { task, deadline, completed: false }]
          } 
        : m
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-secondary-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'regular': return 'bg-secondary-100 text-blue-800';
      case 'performance': return 'bg-purple-100 text-purple-800';
      case 'development': return 'bg-green-100 text-green-800';
      case 'feedback': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingMeetings = meetings.filter(m => m.status === 'scheduled').length;
  const completedThisMonth = meetings.filter(m => 
    m.status === 'completed' && 
    new Date(m.date).getMonth() === new Date().getMonth()
  ).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête avec guide */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Entretiens 1-on-1</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-secondary-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Entretiens Individuels</h3>
              <p className="text-blue-700 text-sm mb-2">
                Planifiez et menez des entretiens réguliers avec vos collaborateurs pour leur développement.
              </p>
              <div className="text-blue-700 text-sm space-y-1">
                <p><strong>Objectifs:</strong> Suivi performance, développement compétences, feedback bidirectionnel, résolution problèmes</p>
                <p><strong>Fréquence:</strong> Mensuel pour les nouveaux, trimestriel pour les expérimentés, hebdomadaire si nécessaire</p>
                <p><strong>Suivi:</strong> Notes d'entretien, actions à suivre, évolution des objectifs et plan de développement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-secondary-600" />
            <h3 className="font-semibold text-gray-900">À venir</h3>
          </div>
          <p className="text-2xl font-bold text-secondary-600">{upcomingMeetings}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-900">Ce mois</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">{completedThisMonth}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Équipe</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">3</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Actions</h3>
          </div>
          <p className="text-2xl font-bold text-orange-600">
            {meetings.reduce((acc, m) => acc + m.actionItems.filter(a => !a.completed).length, 0)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Entretiens planifiés</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Planifier un entretien
        </button>
      </div>

      {/* Meetings List */}
      <div className="space-y-6">
        {meetings.map(meeting => (
          <div key={meeting.id} className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                  <span className="text-secondary-600 font-semibold text-sm">
                    {meeting.employeeName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{meeting.employeeName}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{meeting.date} à {meeting.time}</span>
                    <span>{meeting.duration} min</span>
                    {meeting.lastMeeting && (
                      <span>Dernier: {meeting.lastMeeting}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(meeting.type)}`}>
                  {meeting.type === 'regular' ? 'Régulier' :
                   meeting.type === 'performance' ? 'Performance' :
                   meeting.type === 'development' ? 'Développement' : 'Feedback'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                  {meeting.status === 'scheduled' ? 'Planifié' :
                   meeting.status === 'completed' ? 'Terminé' : 'Annulé'}
                </span>
              </div>
            </div>

            {/* Agenda */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Ordre du jour</h4>
              <ul className="space-y-1">
                {meeting.agenda.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-secondary-600 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Notes */}
            {meeting.status === 'completed' && meeting.notes && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Notes de l'entretien</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{meeting.notes}</p>
              </div>
            )}

            {/* Action Items */}
            {meeting.actionItems.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Actions à suivre</h4>
                <div className="space-y-2">
                  {meeting.actionItems.map((action, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        action.completed ? 'bg-green-600 border-green-600' : 'border-gray-300'
                      }`}>
                        {action.completed && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${action.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {action.task}
                        </p>
                        <p className="text-xs text-gray-500">Échéance: {action.deadline}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {meeting.status === 'scheduled' && (
                <button
                  onClick={() => setSelectedMeeting(meeting)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Commencer l'entretien
                </button>
              )}
              <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                Modifier
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Meeting Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Planifier un entretien</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employé</label>
                <input
                  type="text"
                  value={newMeeting.employeeName}
                  onChange={(e) => setNewMeeting({...newMeeting, employeeName: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500"
                  placeholder="Nom de l'employé"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                  <input
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
                  <select
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting({...newMeeting, duration: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500"
                  >
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newMeeting.type}
                    onChange={(e) => setNewMeeting({...newMeeting, type: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500"
                  >
                    <option value="regular">Régulier</option>
                    <option value="performance">Performance</option>
                    <option value="development">Développement</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateMeeting}
                className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700"
              >
                Planifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OneOnOnePage;