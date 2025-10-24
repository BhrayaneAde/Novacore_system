import React, { useState } from 'react';
import { Crown, TrendingUp, Star, Users, Target, Award, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

const SuccessionPlanningPage = () => {
  const { currentUser, hasRole, isSeniorManager } = useAuthStore();
  
  const [talents, setTalents] = useState([
    {
      id: 1,
      name: 'Lucas Martin',
      currentRole: 'Designer Senior',
      department: 'Design',
      potentialRoles: ['Manager Design', 'Creative Director'],
      readinessLevel: 'ready_now',
      performanceScore: 92,
      leadershipScore: 78,
      technicalScore: 95,
      strengths: ['Créativité', 'Mentorat', 'Vision produit'],
      developmentAreas: ['Management', 'Communication stratégique'],
      developmentPlan: [
        { action: 'Formation leadership', deadline: '2025-03-01', status: 'in_progress' },
        { action: 'Mentorat équipe junior', deadline: '2025-04-01', status: 'planned' }
      ],
      riskLevel: 'low',
      retentionRisk: 15
    },
    {
      id: 2,
      name: 'Camille Dubois',
      currentRole: 'Développeur Full Stack',
      department: 'Développement',
      potentialRoles: ['Tech Lead', 'Architecte Solution'],
      readinessLevel: 'ready_1_year',
      performanceScore: 88,
      leadershipScore: 65,
      technicalScore: 94,
      strengths: ['Expertise technique', 'Problem solving', 'Innovation'],
      developmentAreas: ['Leadership', 'Gestion projet', 'Communication'],
      developmentPlan: [
        { action: 'Certification AWS', deadline: '2025-06-01', status: 'in_progress' },
        { action: 'Formation management', deadline: '2025-05-01', status: 'planned' },
        { action: 'Projet lead', deadline: '2025-07-01', status: 'planned' }
      ],
      riskLevel: 'medium',
      retentionRisk: 35
    },
    {
      id: 3,
      name: 'Antoine Moreau',
      currentRole: 'Commercial Senior',
      department: 'Ventes',
      potentialRoles: ['Manager Commercial', 'Directeur Ventes'],
      readinessLevel: 'ready_2_years',
      performanceScore: 85,
      leadershipScore: 72,
      technicalScore: 80,
      strengths: ['Négociation', 'Relation client', 'Résultats'],
      developmentAreas: ['Stratégie', 'Gestion équipe', 'Analyse financière'],
      developmentPlan: [
        { action: 'MBA Executive', deadline: '2026-12-01', status: 'planned' },
        { action: 'Mentorat manager', deadline: '2025-08-01', status: 'planned' }
      ],
      riskLevel: 'high',
      retentionRisk: 60
    }
  ]);

  const [keyPositions] = useState([
    {
      id: 1,
      title: 'Directeur Technique',
      currentHolder: 'Thomas Dubois',
      criticality: 'high',
      successors: [
        { name: 'Camille Dubois', readiness: 'ready_1_year', score: 85 },
        { name: 'Lucas Martin', readiness: 'ready_2_years', score: 72 }
      ],
      riskFactors: ['Expertise unique', 'Connaissance système legacy'],
      timeline: '6 mois'
    },
    {
      id: 2,
      title: 'Manager Marketing',
      currentHolder: 'Emma Rousseau',
      criticality: 'medium',
      successors: [
        { name: 'Sophie Martin', readiness: 'ready_now', score: 88 },
        { name: 'Antoine Moreau', readiness: 'ready_2_years', score: 75 }
      ],
      riskFactors: ['Réseau externe', 'Vision stratégique'],
      timeline: '12 mois'
    }
  ]);

  if (!isSeniorManager() && !hasRole('employer')) {
    return (
      <div className="p-6 text-center">
        <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès Senior Manager Requis</h2>
        <p className="text-gray-600">La planification de succession est réservée aux senior managers.</p>
      </div>
    );
  }

  const getReadinessColor = (level) => {
    switch (level) {
      case 'ready_now': return 'bg-green-100 text-green-800';
      case 'ready_1_year': return 'bg-blue-100 text-blue-800';
      case 'ready_2_years': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCriticalityColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const readyNow = talents.filter(t => t.readinessLevel === 'ready_now').length;
  const highPotential = talents.filter(t => t.performanceScore >= 85).length;
  const atRisk = talents.filter(t => t.retentionRisk >= 50).length;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Planification de Succession</h1>
        <p className="text-gray-600">Identification et développement des talents clés</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-900">Prêts maintenant</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">{readyNow}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Haut potentiel</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">{highPotential}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="font-semibold text-gray-900">Risque départ</h3>
          </div>
          <p className="text-2xl font-bold text-red-600">{atRisk}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Postes clés</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">{keyPositions.length}</p>
        </div>
      </div>

      {/* Talent Pool */}
      <div className="space-y-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Pool de Talents</h2>
        
        {talents.map(talent => (
          <div key={talent.id} className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {talent.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{talent.name}</h3>
                  <p className="text-gray-600">{talent.currentRole} • {talent.department}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReadinessColor(talent.readinessLevel)}`}>
                      {talent.readinessLevel === 'ready_now' ? 'Prêt maintenant' :
                       talent.readinessLevel === 'ready_1_year' ? 'Prêt dans 1 an' : 'Prêt dans 2 ans'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(talent.riskLevel)}`}>
                      Risque {talent.riskLevel === 'high' ? 'élevé' : talent.riskLevel === 'medium' ? 'moyen' : 'faible'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 mb-1">{talent.performanceScore}%</div>
                <div className="text-sm text-gray-600">Performance globale</div>
              </div>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{talent.performanceScore}%</div>
                <div className="text-sm text-gray-600">Performance</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${talent.performanceScore}%` }} />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{talent.leadershipScore}%</div>
                <div className="text-sm text-gray-600">Leadership</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${talent.leadershipScore}%` }} />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{talent.technicalScore}%</div>
                <div className="text-sm text-gray-600">Technique</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${talent.technicalScore}%` }} />
                </div>
              </div>
            </div>

            {/* Potential Roles */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Rôles potentiels</h4>
              <div className="flex flex-wrap gap-2">
                {talent.potentialRoles.map((role, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Strengths & Development */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Forces</h4>
                <div className="space-y-1">
                  {talent.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                      {strength}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Axes de développement</h4>
                <div className="space-y-1">
                  {talent.developmentAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-orange-700">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                      {area}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Development Plan */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Plan de développement</h4>
              <div className="space-y-2">
                {talent.developmentPlan.map((plan, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        plan.status === 'completed' ? 'bg-green-600' :
                        plan.status === 'in_progress' ? 'bg-blue-600' : 'bg-gray-400'
                      }`} />
                      <span className="text-sm font-medium text-gray-900">{plan.action}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {plan.deadline}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Positions */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Postes Clés & Succession</h2>
        
        <div className="space-y-6">
          {keyPositions.map(position => (
            <div key={position.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{position.title}</h3>
                  <p className="text-gray-600">Titulaire actuel: {position.currentHolder}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(position.criticality)}`}>
                    Criticité {position.criticality === 'high' ? 'élevée' : position.criticality === 'medium' ? 'moyenne' : 'faible'}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                    Timeline: {position.timeline}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Successeurs identifiés</h4>
                <div className="space-y-2">
                  {position.successors.map((successor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-xs">{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-900">{successor.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReadinessColor(successor.readiness)}`}>
                          {successor.readiness === 'ready_now' ? 'Prêt maintenant' :
                           successor.readiness === 'ready_1_year' ? 'Prêt dans 1 an' : 'Prêt dans 2 ans'}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">{successor.score}%</div>
                        <div className="text-xs text-gray-600">Score global</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Facteurs de risque</h4>
                <div className="flex flex-wrap gap-2">
                  {position.riskFactors.map((risk, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      {risk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessionPlanningPage;