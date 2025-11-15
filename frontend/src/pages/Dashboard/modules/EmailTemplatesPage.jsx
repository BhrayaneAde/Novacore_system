import React, { useState, useEffect } from 'react';
import { Mail, Plus, Edit, Trash2, Eye, Copy, Send, Search, Filter, MoreVertical, FileText, User, Calendar, AlertCircle, CheckCircle, X, Save, Code, Palette, Settings } from 'lucide-react';

const EmailTemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const mockTemplates = [
        {
          id: 1,
          name: 'Bienvenue Nouvel Employé',
          subject: 'Bienvenue chez {{company_name}} - {{employee_name}}',
          category: 'Onboarding',
          type: 'Automatique',
          status: 'active',
          description: 'Email de bienvenue envoyé automatiquement aux nouveaux employés',
          content: `
            <h2>Bienvenue {{employee_name}} !</h2>
            <p>Nous sommes ravis de vous accueillir au sein de l'équipe {{department_name}} de {{company_name}}.</p>
            <p>Votre premier jour de travail est prévu le {{start_date}}.</p>
            <h3>Informations importantes :</h3>
            <ul>
              <li>Heure d'arrivée : {{start_time}}</li>
              <li>Lieu : {{office_address}}</li>
              <li>Contact RH : {{hr_contact}}</li>
            </ul>
            <p>N'hésitez pas à nous contacter si vous avez des questions.</p>
            <p>À bientôt !</p>
          `,
          variables: ['company_name', 'employee_name', 'department_name', 'start_date', 'start_time', 'office_address', 'hr_contact'],
          triggers: ['employee_created', 'contract_signed'],
          usageCount: 45,
          lastUsed: '2024-01-15',
          createdBy: 'Marie Dupont',
          createdAt: '2023-12-01',
          updatedAt: '2024-01-10'
        },
        {
          id: 2,
          name: 'Rappel Évaluation Annuelle',
          subject: 'Rappel : Votre évaluation annuelle - {{employee_name}}',
          category: 'Performance',
          type: 'Automatique',
          status: 'active',
          description: 'Rappel automatique pour les évaluations annuelles',
          content: `
            <h2>Rappel : Évaluation Annuelle</h2>
            <p>Bonjour {{employee_name}},</p>
            <p>Votre évaluation annuelle est programmée pour le {{evaluation_date}} à {{evaluation_time}}.</p>
            <p><strong>Lieu :</strong> {{meeting_location}}</p>
            <p><strong>Évaluateur :</strong> {{manager_name}}</p>
            <h3>Documents à préparer :</h3>
            <ul>
              <li>Auto-évaluation (formulaire joint)</li>
              <li>Objectifs de l'année écoulée</li>
              <li>Projets réalisés</li>
            </ul>
            <p>Merci de confirmer votre présence.</p>
          `,
          variables: ['employee_name', 'evaluation_date', 'evaluation_time', 'meeting_location', 'manager_name'],
          triggers: ['evaluation_scheduled', 'evaluation_reminder'],
          usageCount: 28,
          lastUsed: '2024-01-12',
          createdBy: 'Thomas Dubois',
          createdAt: '2023-11-15',
          updatedAt: '2024-01-05'
        },
        {
          id: 3,
          name: 'Demande de Congé Approuvée',
          subject: 'Congé approuvé - {{leave_type}} du {{start_date}} au {{end_date}}',
          category: 'Congés',
          type: 'Automatique',
          status: 'active',
          description: 'Notification d\'approbation de demande de congé',
          content: `
            <h2>Demande de Congé Approuvée</h2>
            <p>Bonjour {{employee_name}},</p>
            <p>Votre demande de {{leave_type}} a été <strong>approuvée</strong>.</p>
            <h3>Détails :</h3>
            <ul>
              <li><strong>Type :</strong> {{leave_type}}</li>
              <li><strong>Période :</strong> Du {{start_date}} au {{end_date}}</li>
              <li><strong>Durée :</strong> {{duration}} jour(s)</li>
              <li><strong>Approuvé par :</strong> {{approver_name}}</li>
            </ul>
            <p>Profitez bien de votre congé !</p>
          `,
          variables: ['employee_name', 'leave_type', 'start_date', 'end_date', 'duration', 'approver_name'],
          triggers: ['leave_approved'],
          usageCount: 67,
          lastUsed: '2024-01-14',
          createdBy: 'Sophie Bernard',
          createdAt: '2023-10-20',
          updatedAt: '2023-12-15'
        },
        {
          id: 4,
          name: 'Formation Programmée',
          subject: 'Formation programmée : {{training_title}} - {{training_date}}',
          category: 'Formation',
          type: 'Automatique',
          status: 'active',
          description: 'Notification de programmation de formation',
          content: `
            <h2>Formation Programmée</h2>
            <p>Bonjour {{employee_name}},</p>
            <p>Vous êtes inscrit(e) à la formation suivante :</p>
            <h3>{{training_title}}</h3>
            <p><strong>Date :</strong> {{training_date}}</p>
            <p><strong>Heure :</strong> {{training_time}}</p>
            <p><strong>Lieu :</strong> {{training_location}}</p>
            <p><strong>Formateur :</strong> {{trainer_name}}</p>
            <p><strong>Durée :</strong> {{training_duration}}</p>
            <h3>Objectifs :</h3>
            <p>{{training_objectives}}</p>
            <p>Merci de confirmer votre participation.</p>
          `,
          variables: ['employee_name', 'training_title', 'training_date', 'training_time', 'training_location', 'trainer_name', 'training_duration', 'training_objectives'],
          triggers: ['training_enrolled', 'training_reminder'],
          usageCount: 34,
          lastUsed: '2024-01-13',
          createdBy: 'Emma Rousseau',
          createdAt: '2023-11-30',
          updatedAt: '2024-01-08'
        },
        {
          id: 5,
          name: 'Bulletin de Paie Disponible',
          subject: 'Votre bulletin de paie {{month}} {{year}} est disponible',
          category: 'Paie',
          type: 'Automatique',
          status: 'active',
          description: 'Notification de mise à disposition du bulletin de paie',
          content: `
            <h2>Bulletin de Paie Disponible</h2>
            <p>Bonjour {{employee_name}},</p>
            <p>Votre bulletin de paie pour {{month}} {{year}} est maintenant disponible.</p>
            <p>Vous pouvez le consulter et le télécharger depuis votre espace employé.</p>
            <p><strong>Salaire net :</strong> {{net_salary}} F CFA</p>
            <p><a href="{{payslip_link}}" style="background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Télécharger mon bulletin</a></p>
            <p>Pour toute question, contactez le service RH.</p>
          `,
          variables: ['employee_name', 'month', 'year', 'net_salary', 'payslip_link'],
          triggers: ['payslip_generated'],
          usageCount: 156,
          lastUsed: '2024-01-16',
          createdBy: 'Pierre Moreau',
          createdAt: '2023-09-10',
          updatedAt: '2024-01-02'
        },
        {
          id: 6,
          name: 'Alerte Document Manquant',
          subject: 'Action requise : Documents manquants - {{employee_name}}',
          category: 'Documents',
          type: 'Manuel',
          status: 'active',
          description: 'Rappel pour documents manquants dans le dossier employé',
          content: `
            <h2>Documents Manquants</h2>
            <p>Bonjour {{employee_name}},</p>
            <p>Nous avons remarqué que certains documents sont manquants dans votre dossier :</p>
            <h3>Documents requis :</h3>
            <ul>{{missing_documents}}</ul>
            <p>Merci de nous faire parvenir ces documents dans les plus brefs délais.</p>
            <p><strong>Échéance :</strong> {{deadline}}</p>
            <p>Vous pouvez les envoyer par email ou les déposer au service RH.</p>
            <p>Contact : {{hr_contact}}</p>
          `,
          variables: ['employee_name', 'missing_documents', 'deadline', 'hr_contact'],
          triggers: ['manual_send'],
          usageCount: 12,
          lastUsed: '2024-01-11',
          createdBy: 'Marie Dupont',
          createdAt: '2023-12-05',
          updatedAt: '2024-01-11'
        },
        {
          id: 7,
          name: 'Fin de Période d\'Essai',
          subject: 'Fin de période d\'essai - {{employee_name}}',
          category: 'Contrats',
          type: 'Automatique',
          status: 'draft',
          description: 'Notification de fin de période d\'essai',
          content: `
            <h2>Fin de Période d'Essai</h2>
            <p>Bonjour {{employee_name}},</p>
            <p>Votre période d'essai se termine le {{trial_end_date}}.</p>
            <p>Nous sommes heureux de vous confirmer votre titularisation au poste de {{position}} dans le département {{department_name}}.</p>
            <h3>Prochaines étapes :</h3>
            <ul>
              <li>Signature du contrat définitif</li>
              <li>Mise à jour des avantages</li>
              <li>Entretien de fin de période d'essai</li>
            </ul>
            <p>Félicitations et bienvenue officiellement dans l'équipe !</p>
          `,
          variables: ['employee_name', 'trial_end_date', 'position', 'department_name'],
          triggers: ['trial_period_end'],
          usageCount: 0,
          lastUsed: null,
          createdBy: 'Thomas Dubois',
          createdAt: '2024-01-05',
          updatedAt: '2024-01-05'
        }
      ];
      
      setTemplates(mockTemplates);
      
      // Calculer les statistiques
      const activeTemplates = mockTemplates.filter(t => t.status === 'active').length;
      const draftTemplates = mockTemplates.filter(t => t.status === 'draft').length;
      const totalUsage = mockTemplates.reduce((sum, t) => sum + t.usageCount, 0);
      const avgUsage = totalUsage / mockTemplates.length;
      
      setStats({
        total: mockTemplates.length,
        active: activeTemplates,
        draft: draftTemplates,
        totalUsage,
        avgUsage: Math.round(avgUsage)
      });
    } catch (error) {
      console.error('Erreur chargement templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || template.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Actif', icon: CheckCircle },
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Brouillon', icon: Edit },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactif', icon: X }
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

  const getCategoryColor = (category) => {
    const colors = {
      'Onboarding': 'text-blue-600 bg-blue-50',
      'Performance': 'text-purple-600 bg-purple-50',
      'Congés': 'text-green-600 bg-green-50',
      'Formation': 'text-orange-600 bg-orange-50',
      'Paie': 'text-red-600 bg-red-50',
      'Documents': 'text-gray-600 bg-gray-50',
      'Contrats': 'text-indigo-600 bg-indigo-50'
    };
    return colors[category] || 'text-gray-600 bg-gray-50';
  };

  const handleCreateTemplate = (formData) => {
    const newTemplate = {
      id: Date.now(),
      ...formData,
      usageCount: 0,
      lastUsed: null,
      createdBy: 'Utilisateur actuel',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTemplates([...templates, newTemplate]);
    setShowCreateModal(false);
  };

  const handleEditTemplate = (formData) => {
    setTemplates(templates.map(t => 
      t.id === editingTemplate.id ? { ...t, ...formData, updatedAt: new Date().toISOString() } : t
    ));
    setShowEditModal(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (templateId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      setTemplates(templates.filter(t => t.id !== templateId));
    }
  };

  const handleDuplicateTemplate = (template) => {
    const duplicatedTemplate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copie)`,
      status: 'draft',
      usageCount: 0,
      lastUsed: null,
      createdBy: 'Utilisateur actuel',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTemplates([...templates, duplicatedTemplate]);
  };

  const TemplateModal = ({ isOpen, onClose, onSubmit, template = null, title }) => {
    const [formData, setFormData] = useState({
      name: template?.name || '',
      subject: template?.subject || '',
      category: template?.category || 'Onboarding',
      type: template?.type || 'Manuel',
      status: template?.status || 'draft',
      description: template?.description || '',
      content: template?.content || '',
      variables: template?.variables?.join(', ') || '',
      triggers: template?.triggers?.join(', ') || ''
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
              <div>
                <label className="block text-sm font-medium mb-2">Nom du template</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Onboarding">Onboarding</option>
                  <option value="Performance">Performance</option>
                  <option value="Congés">Congés</option>
                  <option value="Formation">Formation</option>
                  <option value="Paie">Paie</option>
                  <option value="Documents">Documents</option>
                  <option value="Contrats">Contrats</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Sujet de l'email</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Utilisez {{variable}} pour les variables dynamiques"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Contenu HTML</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                rows={12}
                placeholder="Contenu HTML de l'email. Utilisez {{variable}} pour les variables dynamiques."
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Variables (séparées par des virgules)</label>
                <input
                  type="text"
                  value={formData.variables}
                  onChange={(e) => setFormData({...formData, variables: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="employee_name, company_name, date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Déclencheurs (séparés par des virgules)</label>
                <input
                  type="text"
                  value={formData.triggers}
                  onChange={(e) => setFormData({...formData, triggers: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="employee_created, contract_signed"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Automatique">Automatique</option>
                  <option value="Manuel">Manuel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Statut</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Brouillon</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
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
                {template ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const PreviewModal = ({ isOpen, onClose, template }) => {
    if (!isOpen || !template) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Aperçu : {template.name}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Sujet :</h3>
              <p className="text-gray-700">{template.subject}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Contenu :</h3>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: template.content }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Variables disponibles :</h3>
                <div className="flex flex-wrap gap-2">
                  {template.variables.map((variable, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {`{{${variable}}}`}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Déclencheurs :</h3>
                <div className="flex flex-wrap gap-2">
                  {template.triggers.map((trigger, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {trigger}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Fermer
            </button>
          </div>
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
          <Mail className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Templates d'Emails</h1>
            <p className="text-gray-600">Gestion des modèles d'emails automatiques et manuels</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau template</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Templates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilisations Totales</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalUsage}</p>
            </div>
            <Send className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Moyenne d'Usage</p>
              <p className="text-2xl font-bold text-orange-600">{stats.avgUsage}</p>
            </div>
            <FileText className="w-8 h-8 text-orange-600" />
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
                placeholder="Rechercher un template..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Performance">Performance</option>
              <option value="Congés">Congés</option>
              <option value="Formation">Formation</option>
              <option value="Paie">Paie</option>
              <option value="Documents">Documents</option>
              <option value="Contrats">Contrats</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous statuts</option>
              <option value="active">Actifs</option>
              <option value="draft">Brouillons</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredTemplates.length} template(s) trouvé(s)
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  {getStatusBadge(template.status)}
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {template.type}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 text-sm">{template.description}</p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Sujet:</span> {template.subject}
                  </div>
                  <div>
                    <span className="font-medium">Variables:</span> {template.variables.length}
                  </div>
                  <div>
                    <span className="font-medium">Utilisé:</span> {template.usageCount} fois
                  </div>
                  {template.lastUsed && (
                    <div>
                      <span className="font-medium">Dernière utilisation:</span> {new Date(template.lastUsed).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative ml-4">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-xs text-gray-500">
                Créé par {template.createdBy}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setPreviewTemplate(template);
                    setShowPreviewModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Aperçu"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDuplicateTemplate(template)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                  title="Dupliquer"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setEditingTemplate(template);
                    setShowEditModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
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

      {filteredTemplates.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun template trouvé</h3>
          <p className="text-gray-600 mb-6">Aucun template ne correspond à vos critères de recherche</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('all');
              setFilterStatus('all');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Modals */}
      <TemplateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTemplate}
        title="Créer un nouveau template"
      />
      
      <TemplateModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTemplate(null);
        }}
        onSubmit={handleEditTemplate}
        template={editingTemplate}
        title="Modifier le template"
      />
      
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setPreviewTemplate(null);
        }}
        template={previewTemplate}
      />
    </div>
  );
};

export default EmailTemplatesPage;