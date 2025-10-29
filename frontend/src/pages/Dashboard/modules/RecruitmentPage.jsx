import React, { useState, useEffect } from "react";
import { UserPlus, Briefcase, Users, Search, Filter, MapPin, Clock, Plus, Edit, Trash2 } from "lucide-react";
import { recruitmentService } from '../../../services';
import JobOpeningForm from '../../../components/forms/JobOpeningForm';
import CandidateForm from '../../../components/forms/CandidateForm';
import Loader from "../../../components/ui/Loader";

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [jobsResponse, candidatesResponse] = await Promise.all([
        recruitmentService.jobOpenings.getAll(),
        recruitmentService.candidates.getAll()
      ]);
      setJobOpenings(jobsResponse.data || []);
      setCandidates(candidatesResponse.data || []);
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
        await recruitmentService.candidates.delete(id);
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
  

  
  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
          <p className="text-sm text-gray-600">En processus</p>
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
                className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle offre</span>
              </button>
              <button 
                onClick={() => {
                  setSelectedCandidate(null);
                  setShowCandidateForm(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Nouveau candidat</span>
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
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">{candidate.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{candidate.name}</p>
                          <p className="text-sm text-gray-500">{candidate.email}</p>
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
    </div>
  );
};

export default RecruitmentPage;
