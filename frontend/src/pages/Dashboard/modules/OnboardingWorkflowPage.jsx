import React, { useState } from 'react';
import { UserPlus, CheckCircle, Clock, AlertTriangle, Play, Pause, Settings } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

const OnboardingWorkflowPage = () => {
  const { currentUser, isHRAdmin } = useAuthStore();
  
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      employeeName: 'Alice Dupont',
      position: 'Développeur React',
      startDate: '2025-02-01',
      status: 'in_progress',
      progress: 60,
      currentStep: 3,
      steps: [
        { id: 1, name: 'Préparation poste', assignee: 'IT', status: 'completed', dueDate: '2025-01-30' },
        { id: 2, name: 'Création accès', assignee: 'IT', status: 'completed', dueDate: '2025-01-31' },
        { id: 3, name: 'Accueil manager', assignee: 'Thomas Dubois', status: 'in_progress', dueDate: '2025-02-01' },
        { id: 4, name: 'Formation sécurité', assignee: 'HR', status: 'pending', dueDate: '2025-02-02' },
        { id: 5, name: 'Présentation équipe', assignee: 'Manager', status: 'pending', dueDate: '2025-02-03' }
      ]
    },
    {
      id: 2,
      employeeName: 'Marc Lambert',
      position: 'Designer UX',
      startDate: '2025-02-15',
      status: 'not_started',
      progress: 0,
      currentStep: 1,
      steps: [
        { id: 1, name: 'Préparation poste', assignee: 'IT', status: 'pending', dueDate: '2025-02-13' },
        { id: 2, name: 'Création accès', assignee: 'IT', status: 'pending', dueDate: '2025-02-14' },
        { id: 3, name: 'Accueil manager', assignee: 'Emma Rousseau', status: 'pending', dueDate: '2025-02-15' },
        { id: 4, name: 'Formation outils', assignee: 'HR', status: 'pending', dueDate: '2025-02-16' }
      ]
    }
  ]);

  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Développeur',
      steps: [
        'Préparation environnement dev',
        'Accès repositories',
        'Formation architecture',
        'Premier projet'
      ],
      duration: '5 jours'
    },
    {
      id: 2,
      name: 'Manager',
      steps: [
        'Formation leadership',
        'Présentation équipe',
        'Objectifs département',
        'Processus RH'
      ],
      duration: '7 jours'
    }
  ]);

  if (!isHRAdmin()) {
    return (
      <div className="p-6 text-center">
        <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès HR Admin Requis</h2>
        <p className="text-gray-600">Cette fonctionnalité est réservée aux administrateurs RH.</p>
      </div>
    );
  }

  const updateStepStatus = (workflowId, stepId, status) => {
    setWorkflows(workflows.map(w => 
      w.id === workflowId 
        ? {
            ...w,
            steps: w.steps.map(s => s.id === stepId ? { ...s, status } : s),
            progress: Math.round((w.steps.filter(s => s.status === 'completed').length / w.steps.length) * 100)
          }
        : w
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeWorkflows = workflows.filter(w => w.status === 'in_progress').length;
  const completedSteps = workflows.reduce((acc, w) => acc + w.steps.filter(s => s.status === 'completed').length, 0);
  const totalSteps = workflows.reduce((acc, w) => acc + w.steps.length, 0);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflow Onboarding</h1>
        <p className="text-gray-600">Automatisation de l'intégration des nouveaux employés</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Play className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-900">En cours</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">{activeWorkflows}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-900">Étapes complétées</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">{completedSteps}/{totalSteps}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Progression</h3>
          </div>
          <p className="text-2xl font-bold text-orange-600">
            {Math.round((completedSteps / totalSteps) * 100)}%
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Templates</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">{templates.length}</p>
        </div>
      </div>

      {/* Active Workflows */}
      <div className="space-y-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Intégrations actives</h2>
        
        {workflows.map(workflow => (
          <div key={workflow.id} className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {workflow.employeeName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{workflow.employeeName}</h3>
                  <p className="text-gray-600">{workflow.position} • Début: {workflow.startDate}</p>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(workflow.status)}`}>
                  {workflow.status === 'in_progress' ? 'En cours' : 
                   workflow.status === 'completed' ? 'Terminé' : 'Pas commencé'}
                </span>
                <div className="mt-2">
                  <div className="text-sm text-gray-600 mb-1">Progression</div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all" 
                        style={{ width: `${workflow.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{workflow.progress}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {workflow.steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-green-600' :
                      step.status === 'in_progress' ? 'bg-blue-600' :
                      'bg-gray-300'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-white font-semibold text-xs">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{step.name}</h4>
                      <p className="text-sm text-gray-600">Assigné à: {step.assignee} • Échéance: {step.dueDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                      {step.status === 'completed' ? 'Terminé' :
                       step.status === 'in_progress' ? 'En cours' : 'En attente'}
                    </span>
                    
                    {step.status !== 'completed' && (
                      <button
                        onClick={() => updateStepStatus(workflow.id, step.id, 'completed')}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                      >
                        Marquer terminé
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Templates */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Templates d'intégration</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Nouveau template
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map(template => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600">Durée: {template.duration}</p>
                </div>
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">
                  Utiliser
                </button>
              </div>
              
              <div className="space-y-2">
                {template.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWorkflowPage;