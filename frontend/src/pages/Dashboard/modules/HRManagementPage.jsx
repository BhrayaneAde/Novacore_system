import React, { useState, useEffect } from 'react';
import { Users, FileText, GraduationCap, Mail, BarChart3, TrendingUp, Calendar, CheckCircle, Clock, AlertCircle, Download, Send, Plus, Edit, Trash2, Check, X, DollarSign, UserPlus, FolderOpen, CalendarClock, Bell, Building, Package } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { departmentsService, employeesService, assetsService } from '../../../services';
import DepartmentForm from '../../../components/forms/DepartmentForm';
import CompanyAssetForm from '../../../components/forms/CompanyAssetForm';
import Loader from '../../../components/ui/Loader';

const HRManagementPage = () => {
  const [activeTab, setActiveTab] = useState('onboarding');
  const { currentUser, isEmployer } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, employee: 'Sophie Martin', type: 'Congés payés', startDate: '2025-02-15', endDate: '2025-02-22', days: 6, reason: 'Vacances familiales', status: 'pending', requestDate: '2025-01-20' },
    { id: 2, employee: 'Thomas Dubois', type: 'RTT', startDate: '2025-02-10', endDate: '2025-02-10', days: 1, reason: 'Rendez-vous médical', status: 'pending', requestDate: '2025-01-18' },
    { id: 3, employee: 'Emma Rousseau', type: 'Congé maladie', startDate: '2025-01-25', endDate: '2025-01-26', days: 2, reason: 'Certificat médical joint', status: 'approved', requestDate: '2025-01-24' },
    { id: 4, employee: 'Pierre Moreau', type: 'Congés payés', startDate: '2025-03-01', endDate: '2025-03-08', days: 6, reason: 'Voyage', status: 'rejected', requestDate: '2025-01-15', rejectionReason: 'Période de forte activité' }
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [departmentsResponse, employeesResponse, assetsResponse] = await Promise.all([
        departmentsService.getAll(),
        employeesService.getAll(),
        assetsService.getAll()
      ]);
      setDepartments(departmentsResponse.data || []);
      setEmployees(employeesResponse.data || []);
      setAssets(assetsResponse.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentSave = async (formData) => {
    try {
      if (selectedDepartment) {
        await departmentsService.update(selectedDepartment.id, formData);
      } else {
        await departmentsService.create(formData);
      }
      await loadData();
      setShowDepartmentForm(false);
      setSelectedDepartment(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDepartmentDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
      try {
        await departmentsService.delete(id);
        await loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleAssetSave = async (formData) => {
    try {
      if (selectedAsset) {
        await assetsService.update(selectedAsset.id, formData);
      } else {
        await assetsService.create(formData);
      }
      await loadData();
      setShowAssetForm(false);
      setSelectedAsset(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleAssetDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) {
      try {
        await assetsService.delete(id);
        await loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <Loader />
      </div>
    );
  }

  // Données pour les workflows
  const onboardingTasks = [
    { id: 1, title: 'Préparer le poste de travail', assignee: 'IT', status: 'completed', dueDate: '2025-01-15' },
    { id: 2, title: 'Créer les accès système', assignee: 'IT', status: 'in_progress', dueDate: '2025-01-16' },
    { id: 3, title: 'Présentation équipe', assignee: 'Manager', status: 'pending', dueDate: '2025-01-17' },
    { id: 4, title: 'Formation sécurité', assignee: 'HR', status: 'pending', dueDate: '2025-01-18' }
  ];

  const offboardingTasks = [
    { id: 1, title: 'Récupérer équipements', assignee: 'IT', status: 'completed', dueDate: '2025-01-20' },
    { id: 2, title: 'Désactiver accès', assignee: 'IT', status: 'in_progress', dueDate: '2025-01-20' },
    { id: 3, title: 'Entretien de départ', assignee: 'HR', status: 'pending', dueDate: '2025-01-21' },
    { id: 4, title: 'Documents administratifs', assignee: 'HR', status: 'pending', dueDate: '2025-01-22' }
  ];

  // Données pour les rapports RH
  const hrReports = [
    { id: 1, title: 'Turnover Q4 2024', type: 'turnover', value: '12%', trend: 'down', lastGenerated: '2025-01-15' },
    { id: 2, title: 'Satisfaction employés', type: 'satisfaction', value: '4.2/5', trend: 'up', lastGenerated: '2025-01-10' },
    { id: 3, title: 'Absentéisme', type: 'absence', value: '3.8%', trend: 'stable', lastGenerated: '2025-01-12' },
    { id: 4, title: 'Temps de recrutement', type: 'recruitment', value: '28 jours', trend: 'down', lastGenerated: '2025-01-14' }
  ];

  // Données pour les formations
  const trainings = [
    { id: 1, title: 'Sécurité informatique', category: 'Obligatoire', participants: 45, completion: 89, nextSession: '2025-02-01' },
    { id: 2, title: 'Leadership', category: 'Management', participants: 12, completion: 75, nextSession: '2025-02-15' },
    { id: 3, title: 'React Avancé', category: 'Technique', participants: 8, completion: 100, nextSession: '2025-03-01' },
    { id: 4, title: 'Communication', category: 'Soft Skills', participants: 25, completion: 60, nextSession: '2025-02-10' }
  ];

  // Templates d'emails
  const emailTemplates = [
    { id: 1, name: 'Bienvenue nouvel employé', type: 'onboarding', subject: 'Bienvenue chez {COMPANY}', usage: 15 },
    { id: 2, name: 'Rappel formation', type: 'training', subject: 'Formation {TRAINING_NAME} - Rappel', usage: 8 },
    { id: 3, name: 'Congés approuvés', type: 'leave', subject: 'Vos congés ont été approuvés', usage: 23 },
    { id: 4, name: 'Évaluation annuelle', type: 'evaluation', subject: 'Votre évaluation annuelle', usage: 12 }
  ];

  const handleLeaveAction = (id, action, reason = '') => {
    setLeaveRequests(prev => prev.map(request => 
      request.id === id 
        ? { ...request, status: action, rejectionReason: action === 'rejected' ? reason : undefined }
        : request
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-secondary-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="p-6 mx-auto">
      {/* En-tête avec guide */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Ressources Humaines</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-secondary-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Centre de Contrôle RH</h3>
              <p className="text-blue-700 text-sm mb-2">
                Gestion complète du cycle de vie des employés, des processus RH et de la conformité.
              </p>
              <div className="text-blue-700 text-sm space-y-1">
                <p><strong>Workflows:</strong> Automatisation des processus d'onboarding, congés, évaluations</p>
                <p><strong>Gestion Congés:</strong> Demandes, approbations, planification, soldes automatiques</p>
                <p><strong>Paie & Stats:</strong> Calculs salariaux, charges sociales, reporting financier</p>
                <p><strong>Documents:</strong> Contrats, avenants, attestations, archivage sécurisé</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="bg-gray-50 rounded-xl p-2 inline-flex flex-wrap gap-2">
          {[
            { key: 'onboarding', label: 'Workflows', icon: Users },
            { key: 'leaves', label: 'Congés', icon: Calendar },
            { key: 'payroll', label: 'Paie', icon: DollarSign },
            { key: 'recruitment', label: 'Recrutement', icon: UserPlus },
            { key: 'documents', label: 'Documents', icon: FolderOpen },
            { key: 'planning', label: 'Planning', icon: CalendarClock },
            { key: 'reports', label: 'Rapports', icon: BarChart3 },
            { key: 'training', label: 'Formations', icon: GraduationCap },
            { key: 'emails', label: 'Templates', icon: Mail },
            { key: 'departments', label: 'Départements', icon: Building },
            { key: 'assets', label: 'Équipements', icon: Package },
            { key: 'alerts', label: 'Alertes', icon: Bell }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${
                activeTab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Workflows Tab */}
      {activeTab === 'onboarding' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Onboarding */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Onboarding</h3>
                  <p className="text-sm text-gray-600">Intégration nouveaux employés</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                Nouveau workflow
              </button>
            </div>
            
            <div className="space-y-3">
              {onboardingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : task.status === 'in_progress' ? (
                      <Clock className="w-5 h-5 text-secondary-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-primary-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-600">Assigné à: {task.assignee}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status === 'completed' ? 'Terminé' : 
                       task.status === 'in_progress' ? 'En cours' : 'En attente'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{task.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Offboarding */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Offboarding</h3>
                  <p className="text-sm text-gray-600">Départ employés</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                Nouveau départ
              </button>
            </div>
            
            <div className="space-y-3">
              {offboardingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : task.status === 'in_progress' ? (
                      <Clock className="w-5 h-5 text-secondary-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-primary-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-600">Assigné à: {task.assignee}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status === 'completed' ? 'Terminé' : 
                       task.status === 'in_progress' ? 'En cours' : 'En attente'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{task.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Congés Tab */}
      {activeTab === 'leaves' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-secondary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Gestion des Congés</h3>
                <p className="text-sm text-gray-600">Approuver ou rejeter les demandes</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
                {leaveRequests.filter(r => r.status === 'pending').length} en attente
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Employé</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Période</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Durée</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Motif</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Statut</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                          <span className="text-secondary-600 font-semibold text-sm">
                            {request.employee.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{request.employee}</p>
                          <p className="text-sm text-gray-500">Demandé le {request.requestDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.type === 'Congés payés' ? 'bg-green-100 text-green-800' :
                        request.type === 'RTT' ? 'bg-secondary-100 text-blue-800' :
                        request.type === 'Congé maladie' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-900">
                      <div>
                        <p className="font-medium">{request.startDate}</p>
                        {request.startDate !== request.endDate && (
                          <p className="text-sm text-gray-500">au {request.endDate}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">
                      <span className="font-semibold">{request.days}</span> jour{request.days > 1 ? 's' : ''}
                    </td>
                    <td className="py-4 px-6 text-gray-900 max-w-xs">
                      <p className="truncate" title={request.reason}>{request.reason}</p>
                      {request.rejectionReason && (
                        <p className="text-sm text-red-600 mt-1">Refusé: {request.rejectionReason}</p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status === 'approved' ? 'Approuvé' :
                         request.status === 'rejected' ? 'Refusé' : 'En attente'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {request.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleLeaveAction(request.id, 'approved')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approuver"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Motif du refus (optionnel):');
                              if (reason !== null) {
                                handleLeaveAction(request.id, 'rejected', reason || 'Aucun motif spécifié');
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Refuser"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Traité</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Statistiques rapides */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-primary-600" />
                <h4 className="font-semibold text-yellow-900">En attente</h4>
              </div>
              <p className="text-2xl font-bold text-primary-600">
                {leaveRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Approuvés</h4>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {leaveRequests.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <X className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-red-900">Refusés</h4>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {leaveRequests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-secondary-600" />
                <h4 className="font-semibold text-blue-900">Total jours</h4>
              </div>
              <p className="text-2xl font-bold text-secondary-600">
                {leaveRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.days, 0)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rapports RH Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hrReports.map((report) => (
              <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-secondary-600" />
                  </div>
                  {getTrendIcon(report.trend)}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                <p className="text-2xl font-bold text-secondary-600 mb-2">{report.value}</p>
                <p className="text-xs text-gray-500">Généré le {report.lastGenerated}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Génération de rapports</h3>
              <button className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nouveau rapport
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Rapport Turnover', desc: 'Analyse des départs et rotations' },
                { name: 'Satisfaction employés', desc: 'Enquête de satisfaction annuelle' },
                { name: 'Performance équipes', desc: 'Évaluation des performances par équipe' },
                { name: 'Coûts RH', desc: 'Analyse des coûts de recrutement et formation' },
                { name: 'Diversité & Inclusion', desc: 'Statistiques de diversité' },
                { name: 'Absentéisme', desc: 'Suivi des absences et congés maladie' }
              ].map((report, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{report.name}</h4>
                    <Download className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">{report.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Formations Tab */}
      {activeTab === 'training' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Gestion des formations</h3>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nouvelle formation
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Formation</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Catégorie</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Participants</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Completion</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Prochaine session</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {trainings.map((training) => (
                    <tr key={training.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-purple-600" />
                          </div>
                          <p className="font-medium text-gray-900">{training.title}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          {training.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-900">{training.participants}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${training.completion}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{training.completion}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900">{training.nextSession}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button className="p-2 text-secondary-600 hover:bg-blue-50 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded">
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

          {/* Certifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Certifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'AWS Cloud Practitioner', employees: 12, expiry: '2025-12-31' },
                { name: 'Scrum Master', employees: 8, expiry: '2026-06-30' },
                { name: 'RGPD', employees: 45, expiry: '2025-03-15' }
              ].map((cert, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{cert.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">{cert.employees} employés certifiés</p>
                  <p className="text-xs text-gray-500">Expire le {cert.expiry}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Paie Tab */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Masse salariale', value: '€245,680', change: '+3.2%', color: 'blue' },
              { label: 'Charges sociales', value: '€98,272', change: '+2.8%', color: 'purple' },
              { label: 'Primes versées', value: '€15,420', change: '+12%', color: 'green' },
              { label: 'Heures sup.', value: '142h', change: '-5%', color: 'orange' }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className={`w-8 h-8 text-${stat.color}-600`} />
                  <span className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Fiches de paie à générer</h3>
            <div className="space-y-3">
              {['Sophie Martin', 'Thomas Dubois', 'Emma Rousseau', 'Pierre Moreau'].map((name, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                      <span className="text-secondary-600 font-semibold text-sm">{name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <p className="font-medium">{name}</p>
                      <p className="text-sm text-gray-600">Janvier 2025</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 text-sm">
                    Générer
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recrutement Tab */}
      {activeTab === 'recruitment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Postes ouverts', value: '8', color: 'blue' },
              { label: 'Candidatures', value: '47', color: 'green' },
              { label: 'Entretiens', value: '12', color: 'purple' }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-100">
                <UserPlus className={`w-8 h-8 text-${stat.color}-600 mb-2`} />
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Offres d'emploi actives</h3>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Nouvelle offre
              </button>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Développeur React Senior', department: 'IT', candidates: 15, status: 'active' },
                { title: 'Designer UX/UI', department: 'Design', candidates: 8, status: 'active' },
                { title: 'Commercial B2B', department: 'Ventes', candidates: 24, status: 'paused' }
              ].map((job, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.department} • {job.candidates} candidatures</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {job.status === 'active' ? 'Actif' : 'En pause'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Gestion documentaire</h3>
              <button className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700">
                Ajouter document
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { category: 'Contrats', count: 45, icon: FileText, color: 'blue' },
                { category: 'Certificats médicaux', count: 12, icon: FileText, color: 'red' },
                { category: 'Formations', count: 28, icon: GraduationCap, color: 'purple' },
                { category: 'Évaluations', count: 67, icon: BarChart3, color: 'green' },
                { category: 'Procédures', count: 15, icon: FileText, color: 'orange' },
                { category: 'Règlement intérieur', count: 3, icon: FileText, color: 'gray' }
              ].map((doc, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <doc.icon className={`w-6 h-6 text-${doc.color}-600`} />
                    <h4 className="font-medium">{doc.category}</h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{doc.count}</p>
                  <p className="text-sm text-gray-600">documents</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Planning Tab */}
      {activeTab === 'planning' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Planning des équipes</h3>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className="text-center font-medium text-gray-600 p-2">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({length: 35}, (_, i) => (
                <div key={i} className="aspect-square border border-gray-200 rounded p-2 text-sm">
                  <div className="font-medium">{((i % 31) + 1)}</div>
                  {i % 7 < 5 && i > 6 && (
                    <div className="text-xs text-secondary-600 mt-1">8h-17h</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Départements Tab */}
      {activeTab === 'departments' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-secondary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Gestion des Départements</h3>
                <p className="text-sm text-gray-600">{departments.length} départements</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedDepartment(null);
                setShowDepartmentForm(true);
              }}
              className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau département
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Département</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Manager</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Employés</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Budget</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Localisation</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {departments.map((dept) => {
                  const manager = employees.find(emp => emp.id === dept.managerId);
                  const employeeCount = employees.filter(emp => emp.department === dept.name).length;
                  
                  return (
                    <tr key={dept.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-secondary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{dept.name}</p>
                            <p className="text-sm text-gray-500">{dept.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {manager ? (
                          <div>
                            <p className="font-medium text-gray-900">{manager.first_name} {manager.last_name}</p>
                            <p className="text-sm text-gray-500">{manager.email}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">Non assigné</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900">{employeeCount}</span>
                      </td>
                      <td className="py-4 px-6">
                        {dept.budget ? (
                          <span className="font-semibold text-gray-900">
                            {parseInt(dept.budget).toLocaleString('fr-FR')} €
                          </span>
                        ) : (
                          <span className="text-gray-400">Non défini</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-900">{dept.location || 'Non définie'}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedDepartment(dept);
                              setShowDepartmentForm(true);
                            }}
                            className="p-2 text-secondary-600 hover:bg-blue-50 rounded-lg"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDepartmentDelete(dept.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {departments.length === 0 && (
            <div className="text-center py-8">
              <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun département créé</p>
            </div>
          )}
        </div>
      )}

      {/* Équipements Tab */}
      {activeTab === 'assets' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Gestion des Équipements</h3>
                <p className="text-sm text-gray-600">{assets.length} équipements</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedAsset(null);
                setShowAssetForm(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvel équipement
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Équipement</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Catégorie</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Statut</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">État</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Assigné à</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Prix</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assets.map((asset) => {
                  const assignedEmployee = employees.find(emp => emp.id === asset.assigned_to_id);
                  
                  return (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{asset.name}</p>
                            <p className="text-sm text-gray-500">{asset.serial_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          {asset.category === 'equipment' ? 'Équipement' :
                           asset.category === 'furniture' ? 'Mobilier' :
                           asset.category === 'vehicle' ? 'Véhicule' :
                           asset.category === 'software' ? 'Logiciel' :
                           asset.category === 'tools' ? 'Outils' : 'Autre'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          asset.status === 'available' ? 'bg-green-100 text-green-800' :
                          asset.status === 'assigned' ? 'bg-secondary-100 text-blue-800' :
                          asset.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          asset.status === 'retired' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {asset.status === 'available' ? 'Disponible' :
                           asset.status === 'assigned' ? 'Assigné' :
                           asset.status === 'maintenance' ? 'Maintenance' :
                           asset.status === 'retired' ? 'Retiré' : 'Perdu'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          asset.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                          asset.condition === 'good' ? 'bg-secondary-100 text-blue-800' :
                          asset.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                          asset.condition === 'poor' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {asset.condition === 'excellent' ? 'Excellent' :
                           asset.condition === 'good' ? 'Bon' :
                           asset.condition === 'fair' ? 'Correct' :
                           asset.condition === 'poor' ? 'Mauvais' : 'Endommagé'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {assignedEmployee ? (
                          <div>
                            <p className="font-medium text-gray-900">{assignedEmployee.first_name} {assignedEmployee.last_name}</p>
                            <p className="text-sm text-gray-500">{assignedEmployee.email}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">Non assigné</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {asset.purchase_price ? (
                          <span className="font-semibold text-gray-900">
                            {parseFloat(asset.purchase_price).toLocaleString('fr-FR')} €
                          </span>
                        ) : (
                          <span className="text-gray-400">Non défini</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedAsset(asset);
                              setShowAssetForm(true);
                            }}
                            className="p-2 text-secondary-600 hover:bg-blue-50 rounded-lg"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAssetDelete(asset.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {assets.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun équipement enregistré</p>
            </div>
          )}
        </div>
      )}

      {/* Alertes Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" />
                Alertes actives
              </h3>
              <div className="space-y-3">
                {[
                  { type: 'Contrat', message: '3 contrats expirent dans 30 jours', priority: 'high' },
                  { type: 'Formation', message: 'Formation RGPD obligatoire en retard', priority: 'medium' },
                  { type: 'Congés', message: '5 demandes en attente', priority: 'low' },
                  { type: 'Évaluation', message: 'Évaluations annuelles à programmer', priority: 'medium' }
                ].map((alert, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    alert.priority === 'high' ? 'bg-red-50 border-red-500' :
                    alert.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                    'bg-blue-50 border-secondary-500'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{alert.type}</p>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Configuration des alertes</h3>
              <div className="space-y-4">
                {[
                  { name: 'Expiration contrats', enabled: true, days: 30 },
                  { name: 'Formations obligatoires', enabled: true, days: 7 },
                  { name: 'Évaluations annuelles', enabled: false, days: 60 },
                  { name: 'Congés non pris', enabled: true, days: 90 }
                ].map((config, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{config.name}</p>
                      <p className="text-sm text-gray-600">{config.days} jours avant</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
                      config.enabled ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        config.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Email Tab */}
      {activeTab === 'emails' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Templates d'emails</h3>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouveau template
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emailTemplates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-secondary-600 hover:bg-blue-50 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Sujet:</p>
                  <p className="text-sm text-gray-700">{template.subject}</p>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Utilisé {template.usage} fois</span>
                  <span>Variables: COMPANY, EMPLOYEE_NAME</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Variables disponibles</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700">
              <span>{'{'}{'{'}COMPANY{'}'}</span>
              <span>{'{'}{'{'}EMPLOYEE_NAME{'}'}</span>
              <span>{'{'}{'{'}MANAGER_NAME{'}'}</span>
              <span>{'{'}{'{'}START_DATE{'}'}</span>
              <span>{'{'}{'{'}TRAINING_NAME{'}'}</span>
              <span>{'{'}{'{'}LEAVE_DATES{'}'}</span>
              <span>{'{'}{'{'}DEPARTMENT{'}'}</span>
              <span>{'{'}{'{'}POSITION{'}'}</span>
            </div>
          </div>
        </div>
      )}

      <DepartmentForm
        isOpen={showDepartmentForm}
        onClose={() => {
          setShowDepartmentForm(false);
          setSelectedDepartment(null);
        }}
        onSave={handleDepartmentSave}
        department={selectedDepartment}
        employees={employees}
      />

      <CompanyAssetForm
        isOpen={showAssetForm}
        onClose={() => {
          setShowAssetForm(false);
          setSelectedAsset(null);
        }}
        onSave={handleAssetSave}
        asset={selectedAsset}
        employees={employees}
      />
    </div>
  );
};

export default HRManagementPage;