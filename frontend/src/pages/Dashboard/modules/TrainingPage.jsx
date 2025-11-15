import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Calendar, Award, Plus, Play, Search, Filter, MoreVertical, Edit, Trash2, Eye, Download, Upload, Clock, CheckCircle, AlertCircle, Star, Target, TrendingUp, FileText, User, Settings, X, Check, MapPin, Phone, Mail } from 'lucide-react';

const TrainingPage = () => {
  const [trainings, setTrainings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // cards, list, calendar
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    loadTrainings();
    loadEmployees();
    loadTrainers();
  }, []);

  const loadTrainings = async () => {
    try {
      const mockTrainings = [
        {
          id: 1,
          title: 'Formation Sécurité au Travail',
          description: 'Formation obligatoire sur les règles de sécurité et prévention des accidents',
          category: 'Sécurité',
          type: 'Obligatoire',
          duration: '8h',
          durationHours: 8,
          participants: 15,
          maxParticipants: 20,
          startDate: '2024-04-15',
          endDate: '2024-04-15',
          startTime: '09:00',
          endTime: '17:00',
          status: 'upcoming',
          trainer: 'Expert Sécurité SARL',
          trainerId: 1,
          location: 'Salle de formation A',
          cost: 150000,
          budget: 200000,
          objectives: ['Connaître les règles de sécurité', 'Identifier les risques', 'Utiliser les EPI'],
          prerequisites: ['Aucun'],
          materials: ['Manuel sécurité', 'EPI de démonstration'],
          certification: true,
          validityPeriod: 12, // mois
          rating: 4.5,
          feedback: [],
          attendanceRate: 0,
          completionRate: 0,
          enrolledEmployees: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
          waitingList: [16, 17, 18, 19, 20],
          createdBy: 'Marie Dupont',
          createdAt: '2024-01-10',
          updatedAt: '2024-01-15'
        },
        {
          id: 2,
          title: 'Leadership et Management',
          description: 'Développement des compétences managériales et de leadership',
          category: 'Management',
          type: 'Développement',
          duration: '16h',
          durationHours: 16,
          participants: 8,
          maxParticipants: 12,
          startDate: '2024-04-20',
          endDate: '2024-04-21',
          startTime: '09:00',
          endTime: '17:00',
          status: 'upcoming',
          trainer: 'Coach Professionnel International',
          trainerId: 2,
          location: 'Centre de formation externe',
          cost: 480000,
          budget: 500000,
          objectives: ['Développer son style de leadership', 'Gérer une équipe', 'Communiquer efficacement'],
          prerequisites: ['Expérience managériale souhaitée'],
          materials: ['Livre Leadership', 'Cahier d\'exercices', 'Tests de personnalité'],
          certification: true,
          validityPeriod: 24,
          rating: 4.8,
          feedback: [],
          attendanceRate: 0,
          completionRate: 0,
          enrolledEmployees: [21, 22, 23, 24, 25, 26, 27, 28],
          waitingList: [29, 30],
          createdBy: 'Thomas Dubois',
          createdAt: '2024-01-05',
          updatedAt: '2024-01-20'
        },
        {
          id: 3,
          title: 'Outils Informatiques Avancés',
          description: 'Maîtrise des outils bureautiques et logiciels métier',
          category: 'Informatique',
          type: 'Technique',
          duration: '12h',
          durationHours: 12,
          participants: 12,
          maxParticipants: 12,
          startDate: '2024-03-15',
          endDate: '2024-03-16',
          startTime: '09:00',
          endTime: '15:00',
          status: 'completed',
          trainer: 'Formateur IT Certifié',
          trainerId: 3,
          location: 'Salle informatique',
          cost: 180000,
          budget: 200000,
          objectives: ['Maîtriser Excel avancé', 'Utiliser PowerBI', 'Automatiser les tâches'],
          prerequisites: ['Connaissances de base en informatique'],
          materials: ['Ordinateurs', 'Logiciels', 'Support de cours'],
          certification: true,
          validityPeriod: 18,
          rating: 4.3,
          feedback: [
            { employee: 'Jean Martin', rating: 5, comment: 'Très utile pour mon travail quotidien' },
            { employee: 'Sophie Bernard', rating: 4, comment: 'Bon contenu, rythme un peu rapide' }
          ],
          attendanceRate: 100,
          completionRate: 92,
          enrolledEmployees: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42],
          waitingList: [],
          createdBy: 'Pierre Moreau',
          createdAt: '2024-02-01',
          updatedAt: '2024-03-20'
        },
        {
          id: 4,
          title: 'Communication Interpersonnelle',
          description: 'Améliorer ses compétences en communication et relations interpersonnelles',
          category: 'Soft Skills',
          type: 'Développement',
          duration: '6h',
          durationHours: 6,
          participants: 0,
          maxParticipants: 15,
          startDate: '2024-05-10',
          endDate: '2024-05-10',
          startTime: '09:00',
          endTime: '15:00',
          status: 'draft',
          trainer: 'Consultant en Communication',
          trainerId: 4,
          location: 'Salle de réunion principale',
          cost: 120000,
          budget: 150000,
          objectives: ['Améliorer l\'écoute active', 'Gérer les conflits', 'Présenter efficacement'],
          prerequisites: ['Aucun'],
          materials: ['Support de cours', 'Exercices pratiques'],
          certification: false,
          validityPeriod: 0,
          rating: 0,
          feedback: [],
          attendanceRate: 0,
          completionRate: 0,
          enrolledEmployees: [],
          waitingList: [],
          createdBy: 'Emma Rousseau',
          createdAt: '2024-01-25',
          updatedAt: '2024-01-25'
        },
        {
          id: 5,
          title: 'Gestion du Temps et Productivité',
          description: 'Techniques et outils pour optimiser sa gestion du temps',
          category: 'Productivité',
          type: 'Développement',
          duration: '4h',
          durationHours: 4,
          participants: 18,
          maxParticipants: 20,
          startDate: '2024-02-28',
          endDate: '2024-02-28',
          startTime: '14:00',
          endTime: '18:00',
          status: 'ongoing',
          trainer: 'Coach en Productivité',
          trainerId: 5,
          location: 'Salle de formation B',
          cost: 90000,
          budget: 100000,
          objectives: ['Identifier les voleurs de temps', 'Prioriser les tâches', 'Utiliser des outils de productivité'],
          prerequisites: ['Aucun'],
          materials: ['Planners', 'Applications mobiles', 'Templates'],
          certification: false,
          validityPeriod: 0,
          rating: 4.1,
          feedback: [],
          attendanceRate: 90,
          completionRate: 0,
          enrolledEmployees: [43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
          waitingList: [61, 62],
          createdBy: 'Marie Dupont',
          createdAt: '2024-01-30',
          updatedAt: '2024-02-25'
        }
      ];
      
      setTrainings(mockTrainings);
      
      // Calculer les statistiques
      const totalTrainings = mockTrainings.length;
      const upcomingTrainings = mockTrainings.filter(t => t.status === 'upcoming').length;
      const ongoingTrainings = mockTrainings.filter(t => t.status === 'ongoing').length;
      const completedTrainings = mockTrainings.filter(t => t.status === 'completed').length;
      const draftTrainings = mockTrainings.filter(t => t.status === 'draft').length;
      const totalParticipants = mockTrainings.reduce((sum, t) => sum + t.participants, 0);
      const totalBudget = mockTrainings.reduce((sum, t) => sum + t.budget, 0);
      const totalCost = mockTrainings.reduce((sum, t) => sum + t.cost, 0);
      const avgRating = mockTrainings.filter(t => t.rating > 0).reduce((sum, t) => sum + t.rating, 0) / mockTrainings.filter(t => t.rating > 0).length;
      
      setStats({
        totalTrainings,
        upcomingTrainings,
        ongoingTrainings,
        completedTrainings,
        draftTrainings,
        totalParticipants,
        totalBudget,
        totalCost,
        avgRating: avgRating || 0,
        budgetUtilization: ((totalCost / totalBudget) * 100).toFixed(1)
      });
    } catch (error) {
      console.error('Erreur chargement formations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    // Simulation d'employés
    const mockEmployees = [
      { id: 1, name: 'Jean Dupont', department: 'Développement', position: 'Développeur Senior' },
      { id: 2, name: 'Marie Martin', department: 'RH', position: 'Responsable RH' },
      { id: 3, name: 'Pierre Durand', department: 'Marketing', position: 'Chef de projet' }
    ];
    setEmployees(mockEmployees);
  };

  const loadTrainers = async () => {
    const mockTrainers = [
      { id: 1, name: 'Expert Sécurité SARL', speciality: 'Sécurité au travail', rating: 4.5 },
      { id: 2, name: 'Coach Professionnel International', speciality: 'Leadership', rating: 4.8 },
      { id: 3, name: 'Formateur IT Certifié', speciality: 'Informatique', rating: 4.3 }
    ];
    setTrainers(mockTrainers);
  };

  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.trainer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || training.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || training.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'À venir', icon: Calendar },
      ongoing: { bg: 'bg-green-100', text: 'text-green-800', label: 'En cours', icon: Play },
      completed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Terminée', icon: CheckCircle },
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Brouillon', icon: Edit },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Annulée', icon: X }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Obligatoire': return 'text-red-600 bg-red-50';
      case 'Développement': return 'text-blue-600 bg-blue-50';
      case 'Technique': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleCreateTraining = (formData) => {
    const newTraining = {
      id: Date.now(),
      ...formData,
      participants: 0,
      status: 'draft',
      rating: 0,
      feedback: [],
      attendanceRate: 0,
      completionRate: 0,
      enrolledEmployees: [],
      waitingList: [],
      createdBy: 'Utilisateur actuel',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTrainings([...trainings, newTraining]);
    setShowCreateModal(false);
  };

  const handleEditTraining = (formData) => {
    setTrainings(trainings.map(t => 
      t.id === editingTraining.id ? { ...t, ...formData, updatedAt: new Date().toISOString() } : t
    ));
    setShowEditModal(false);
    setEditingTraining(null);
  };

  const handleDeleteTraining = (trainingId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      setTrainings(trainings.filter(t => t.id !== trainingId));
    }
  };

  const TrainingModal = ({ isOpen, onClose, onSubmit, training = null, title }) => {
    const [formData, setFormData] = useState({
      title: training?.title || '',
      description: training?.description || '',
      category: training?.category || 'Développement',
      type: training?.type || 'Développement',
      duration: training?.duration || '',
      durationHours: training?.durationHours || 0,
      maxParticipants: training?.maxParticipants || 10,
      startDate: training?.startDate || '',
      endDate: training?.endDate || '',
      startTime: training?.startTime || '09:00',
      endTime: training?.endTime || '17:00',
      trainer: training?.trainer || '',
      location: training?.location || '',
      cost: training?.cost || 0,
      budget: training?.budget || 0,
      objectives: training?.objectives?.join('\n') || '',
      prerequisites: training?.prerequisites?.join('\n') || '',
      materials: training?.materials?.join('\n') || '',
      certification: training?.certification || false,
      validityPeriod: training?.validityPeriod || 0
    });

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre de la formation</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Catégorie</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Sécurité">Sécurité</option>
                      <option value="Management">Management</option>
                      <option value="Informatique">Informatique</option>
                      <option value="Soft Skills">Soft Skills</option>
                      <option value="Productivité">Productivité</option>
                      <option value="Technique">Technique</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Obligatoire">Obligatoire</option>
                      <option value="Développement">Développement</option>
                      <option value="Technique">Technique</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Durée</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="ex: 8h, 2 jours"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Heures</label>
                    <input
                      type="number"
                      value={formData.durationHours}
                      onChange={(e) => setFormData({...formData, durationHours: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre max de participants</label>
                  <input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date de début</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date de fin</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Heure de début</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Heure de fin</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Formateur</label>
                  <input
                    type="text"
                    value={formData.trainer}
                    onChange={(e) => setFormData({...formData, trainer: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Lieu</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Coût (F CFA)</label>
                    <input
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({...formData, cost: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Budget (F CFA)</label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.certification}
                      onChange={(e) => setFormData({...formData, certification: e.target.checked})}
                      className="mr-2"
                    />
                    Certification
                  </label>
                  {formData.certification && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Validité (mois)</label>
                      <input
                        type="number"
                        value={formData.validityPeriod}
                        onChange={(e) => setFormData({...formData, validityPeriod: parseInt(e.target.value)})}
                        className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Objectifs (un par ligne)</label>
                <textarea
                  value={formData.objectives}
                  onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Objectif 1\nObjectif 2\nObjectif 3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Prérequis (un par ligne)</label>
                <textarea
                  value={formData.prerequisites}
                  onChange={(e) => setFormData({...formData, prerequisites: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Prérequis 1\nPrérequis 2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Matériel fourni (un par ligne)</label>
                <textarea
                  value={formData.materials}
                  onChange={(e) => setFormData({...formData, materials: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Support de cours\nMatériel pratique"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {training ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Formations</h1>
            <p className="text-gray-600">Planification et suivi du développement des compétences</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white rounded-lg border px-3 py-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1 rounded ${viewMode === 'cards' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <Users className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1 rounded ${viewMode === 'calendar' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle formation</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Formations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTrainings}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Cours/À Venir</p>
              <p className="text-2xl font-bold text-green-600">{stats.upcomingTrainings + stats.ongoingTrainings}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Participants</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalParticipants}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Note Moyenne</p>
              <p className="text-2xl font-bold text-orange-600">{stats.avgRating.toFixed(1)}/5</p>
            </div>
            <Star className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="upcoming">À venir</option>
              <option value="ongoing">En cours</option>
              <option value="completed">Terminées</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="Sécurité">Sécurité</option>
              <option value="Management">Management</option>
              <option value="Informatique">Informatique</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Productivité">Productivité</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredTrainings.length} formation(s) trouvée(s)
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTrainings.map((training) => (
            <div key={training.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{training.title}</h3>
                    {getStatusBadge(training.status)}
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(training.type)}`}>
                      {training.type}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {training.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{training.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{training.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{training.participants}/{training.maxParticipants}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(training.startDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{training.location}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Inscriptions</span>
                      <span className="font-medium">{training.participants}/{training.maxParticipants}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(training.participants / training.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {training.rating > 0 && (
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(training.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({training.rating.toFixed(1)})</span>
                    </div>
                  )}
                </div>
                
                <div className="relative ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Formateur:</span> {training.trainer}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedTraining(training)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Voir détails"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingTraining(training);
                      setShowEditModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTraining(training.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrainings.map((training) => (
                <tr key={training.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{training.title}</div>
                      <div className="text-sm text-gray-500">{training.trainer}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(training.type)} w-fit`}>
                        {training.type}
                      </span>
                      <span className="text-xs text-gray-500">{training.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <div>{new Date(training.startDate).toLocaleDateString('fr-FR')}</div>
                      <div className="text-xs text-gray-500">{training.duration}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{training.participants}/{training.maxParticipants}</div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(training.participants / training.maxParticipants) * 100}%`}}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(training.status)}
                  </td>
                  <td className="px-6 py-4">
                    {training.rating > 0 ? (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-900">{training.rating.toFixed(1)}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedTraining(training)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingTraining(training);
                          setShowEditModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTraining(training.id)}
                        className="text-red-600 hover:text-red-900"
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
      )}

      {filteredTrainings.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune formation trouvée</h3>
          <p className="text-gray-600 mb-6">Aucune formation ne correspond à vos critères de recherche</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterCategory('all');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Modals */}
      <TrainingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTraining}
        title="Créer une nouvelle formation"
      />
      
      <TrainingModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTraining(null);
        }}
        onSubmit={handleEditTraining}
        training={editingTraining}
        title="Modifier la formation"
      />
    </div>
  );
};

export default TrainingPage;