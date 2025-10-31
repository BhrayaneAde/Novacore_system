import React, { useState, useEffect } from "react";
import { UserPlus, Briefcase, Users, Search, Filter, MapPin, Clock, Plus, Edit, Trash2, Mail, RefreshCw, Settings, Download } from "lucide-react";
import { recruitmentService } from '../../../services';
import JobOpeningForm from '../../../components/forms/JobOpeningForm';
import CandidateForm from '../../../components/forms/CandidateForm';
import Loader from "../../../components/ui/Loader";
import { useToast } from '../../../components/ui/useToast';
import Toast from '../../../components/ui/Toast';

const RecruitmentPage = () => {
  const [activeTab, setActiveTab] = useState("candidates");
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [jobOpenings, setJobOpenings] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [showEmailConfig, setShowEmailConfig] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [departments, setDepartments] = useState([]);
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger les offres d'emploi
      let jobsData = [];
      try {
        const jobsResponse = await recruitmentService.jobOpenings.getAll();
        jobsData = jobsResponse.data || [];
      } catch (error) {
        console.error('Erreur chargement jobs:', error);
      }
      setJobOpenings(jobsData);
      
      // Charger les candidats manuels
      let manualCandidates = [];
      try {
        const candidatesResponse = await recruitmentService.candidates.getAll();
        manualCandidates = candidatesResponse.data || [];
      } catch (error) {
        console.error('Erreur chargement candidats manuels:', error);
      }
      
      // Charger les candidats automatiques
      let autoCandidates = [];
      try {
        const autoResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/auto-recruitment/candidates`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (autoResponse.ok) {
          autoCandidates = await autoResponse.json();
        }
      } catch (error) {
        console.error('Erreur chargement candidats auto:', error);
      }
      
      // Transformer les candidats automatiques au format attendu
      const transformedAutoCandidates = autoCandidates.map(candidate => ({
        id: `auto_${candidate.id}`,
        name: candidate.name,
        email: candidate.email,
        position: candidate.position || 'Poste non spécifié',
        experience: "Email",
        status: candidate.status === 'nouveau' ? 'screening' : 
                candidate.status === 'en_cours' ? 'interview' :
                candidate.status === 'entretien' ? 'interview' :
                candidate.status === 'accepte' ? 'offer' : 'rejected',
        appliedDate: candidate.received_at,
        avatar: candidate.name.charAt(0).toUpperCase(),
        source: 'email',
        department: candidate.department,
        cv_filename: candidate.cv_filename,
        notes: candidate.notes
      }));
      
      setCandidates([...manualCandidates, ...transformedAutoCandidates]);
      
      // Charger les départements
      try {
        const deptsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/departments`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (deptsResponse.ok) {
          setDepartments(await deptsResponse.json());
        }
      } catch (error) {
        console.error('Erreur chargement départements:', error);
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSave = async (formData) => {
    try {
      if (selectedJob) {
        await recruitmentService.jobOpenings.update(selectedJob.id, formData);
      } else {
        await recruitmentService.jobOpenings.create(formData);
      }
      await loadData();
      setShowJobForm(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCandidateSave = async (formData) => {
    try {
      if (selectedCandidate) {
        await recruitmentService.candidates.update(selectedCandidate.id, formData);
      } else {
        await recruitmentService.candidates.create(formData);
      }
      await loadData();
      setShowCandidateForm(false);
      setSelectedCandidate(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleJobDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        await recruitmentService.jobOpenings.delete(id);
        await loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleCandidateDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce candidat ?')) {
      try {
        if (id.toString().startsWith('auto_')) {
          // Candidat automatique
          const realId = id.replace('auto_', '');
          await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/auto-recruitment/candidates/${realId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
          });
        } else {
          // Candidat manuel
          await recruitmentService.candidates.delete(id);
        }
        await loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };
  
  const syncEmails = async () => {
    setSyncing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/auto-recruitment/sync-emails`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        showSuccess(`${result.processed} nouvelles candidatures traitées`);
        await loadData();
      } else {
        showError('Erreur lors de la synchronisation');
      }
    } catch (error) {
      showError('Erreur lors de la synchronisation');
    } finally {
      setSyncing(false);
    }
  };
  
  const updateCandidateStatus = async (candidateId, newStatus) => {
    if (candidateId.toString().startsWith('auto_')) {
      const realId = candidateId.replace('auto_', '');
      const statusMap = {
        'screening': 'en_cours',
        'interview': 'entretien', 
        'offer': 'accepte',
        'rejected': 'rejete'
      };
      
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/auto-recruitment/candidates/${realId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({ status: statusMap[newStatus] || newStatus })
        });
        
        showSuccess('Statut mis à jour');
        await loadData();
      } catch (error) {
        showError('Erreur lors de la mise à jour');
      }
    }
  };
  
  const downloadCV = async (candidateId, filename) => {
    if (candidateId.toString().startsWith('auto_')) {
      const realId = candidateId.replace('auto_', '');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/auto-recruitment/candidates/${realId}/cv`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
        });
        
        if (response.ok) {
          showSuccess(`CV ${filename} téléchargé`);
        } else {
          showError('CV non disponible');
        }
      } catch (error) {
        showError('Erreur lors du téléchargement');
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
  
  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const emailCandidates = candidates.filter(c => c.source === 'email').length;
  const manualCandidates = candidates.filter(c => c.source !== 'email').length;
  
  const filteredJobs = jobOpenings.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openJobs = jobOpenings.filter((job) => job.status === "open").length;
  const totalApplicants = jobOpenings.reduce((sum, job) => sum + job.applicants, 0);

  return (
    <div className="p-6  mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recrutement</h1>
        <p className="text-gray-600">Gérez vos offres d'emploi et candidatures</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-secondary-600" />
            </div>
            <span className="text-2xl font-bold text-secondary-600">{openJobs}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Postes ouverts</h3>
          <p className="text-sm text-gray-600">Recrutement actif</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-purple-600">{totalApplicants}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Candidatures</h3>
          <p className="text-sm text-gray-600">Total reçues</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">{candidates.length}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Candidats actifs</h3>
          <p className="text-sm text-gray-600">{emailCandidates} par email, {manualCandidates} manuels</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-orange-600">
              {candidates.filter(c => c.status === 'interview').length}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Entretiens</h3>
          <p className="text-sm text-gray-600">Programmés</p>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setSelectedJob(null);
                  setShowJobForm(true);
                }}
                style={{
                  backgroundColor: '#055169',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#023342'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#055169'}
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle offre</span>
              </button>
              <button 
                onClick={() => {
                  setSelectedCandidate(null);
                  setShowCandidateForm(true);
                }}
                style={{
                  backgroundColor: '#16a34a',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#15803d'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#16a34a'}
              >
                <UserPlus className="w-4 h-4" />
                <span>Nouveau candidat</span>
              </button>
              <button 
                onClick={() => setShowEmailConfig(!showEmailConfig)}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
              >
                <Settings className="w-4 h-4" />
                <span>Config Email</span>
              </button>
              <button 
                onClick={syncEmails}
                disabled={syncing}
                style={{
                  backgroundColor: syncing ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: syncing ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => !syncing && (e.target.style.backgroundColor = '#1d4ed8')}
                onMouseLeave={(e) => !syncing && (e.target.style.backgroundColor = '#2563eb')}
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Sync...' : 'Sync Email'}</span>
              </button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 text-sm"
            />
          </div>
        </div>
        
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("candidates")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "candidates"
                ? "text-secondary-600 border-b-2 border-secondary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Candidats ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "jobs"
                ? "text-secondary-600 border-b-2 border-secondary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Offres d'emploi ({jobOpenings.length})
          </button>
        </div>
      </div>

      {/* Email Configuration Panel */}
      {showEmailConfig && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Configuration Email Automatique
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email RH</label>
              <input
                type="email"
                placeholder="rh@entreprise.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                placeholder="Mot de passe email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Classification automatique</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• <strong>Informatique:</strong> développeur, dev, tech, backend, frontend</p>
              <p>• <strong>Marketing:</strong> marketing, digital, seo, content</p>
              <p>• <strong>Commercial:</strong> commercial, vente, sales, client</p>
              <p>• <strong>RH:</strong> rh, ressources humaines, recrutement</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              Sauvegarder Configuration
            </button>
          </div>
        </div>
      )}

      {/* Content Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === "candidates" ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Candidat</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Poste</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Expérience</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Statut</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Date candidature</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          candidate.source === 'email' ? 'bg-gradient-to-r from-blue-500 to-green-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}>
                          <span className="text-white font-semibold text-sm">{candidate.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 flex items-center gap-2">
                            {candidate.name}
                            {candidate.source === 'email' && <Mail className="w-4 h-4 text-blue-500" title="Reçu par email" />}
                          </p>
                          <p className="text-sm text-gray-500">{candidate.email}</p>
                          {candidate.department && (
                            <p className="text-xs text-gray-400">{candidate.department}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{candidate.position}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-blue-800">
                        {candidate.experience}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        candidate.status === 'screening' ? 'bg-yellow-100 text-yellow-800' :
                        candidate.status === 'interview' ? 'bg-secondary-100 text-blue-800' :
                        candidate.status === 'offer' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {candidate.status === 'screening' ? 'Présélection' :
                         candidate.status === 'interview' ? 'Entretien' :
                         candidate.status === 'offer' ? 'Offre' : 'Rejeté'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(candidate.appliedDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {candidate.source === 'email' ? (
                          <>
                            {candidate.cv_filename && (
                              <button 
                                onClick={() => downloadCV(candidate.id, candidate.cv_filename)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Télécharger CV"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                            <select
                              value={candidate.status}
                              onChange={(e) => updateCandidateStatus(candidate.id, e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="screening">Présélection</option>
                              <option value="interview">Entretien</option>
                              <option value="offer">Offre</option>
                              <option value="rejected">Rejeté</option>
                            </select>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => {
                                setSelectedCandidate(candidate);
                                setShowCandidateForm(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleCandidateDelete(candidate.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Poste</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Département</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Localisation</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Candidatures</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Statut</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{job.title}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {job.department}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{job.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {job.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900">{job.applicants}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status === 'open' ? 'Ouvert' : 'Fermé'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedJob(job);
                            setShowJobForm(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleJobDelete(job.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
          )}
        </div>
      </div>

      <JobOpeningForm
        isOpen={showJobForm}
        onClose={() => {
          setShowJobForm(false);
          setSelectedJob(null);
        }}
        onSave={handleJobSave}
        jobOpening={selectedJob}
      />

      <CandidateForm
        isOpen={showCandidateForm}
        onClose={() => {
          setShowCandidateForm(false);
          setSelectedCandidate(null);
        }}
        onSave={handleCandidateSave}
        candidate={selectedCandidate}
        jobOpenings={jobOpenings}
      />
      
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default RecruitmentPage;