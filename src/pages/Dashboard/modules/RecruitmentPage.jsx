import React, { useState } from "react";
import { UserPlus, Briefcase, Users, Search, Filter, MapPin, Clock } from "lucide-react";

const RecruitmentPage = () => {
  const [activeTab, setActiveTab] = useState("candidates");
  const [searchTerm, setSearchTerm] = useState('');
  
  const candidates = [
    {
      id: 1,
      name: "Alice Dupont",
      email: "alice.dupont@email.com",
      position: "Développeur React",
      experience: "3 ans",
      status: "interview",
      appliedDate: "2024-01-15",
      avatar: "AD"
    },
    {
      id: 2,
      name: "Bob Martin",
      email: "bob.martin@email.com",
      position: "Designer UX/UI",
      experience: "5 ans",
      status: "screening",
      appliedDate: "2024-01-12",
      avatar: "BM"
    },
    {
      id: 3,
      name: "Claire Moreau",
      email: "claire.moreau@email.com",
      position: "Chef de Projet",
      experience: "7 ans",
      status: "offer",
      appliedDate: "2024-01-10",
      avatar: "CM"
    },
    {
      id: 4,
      name: "David Laurent",
      email: "david.laurent@email.com",
      position: "Développeur Backend",
      experience: "4 ans",
      status: "rejected",
      appliedDate: "2024-01-08",
      avatar: "DL"
    }
  ];
  
  const jobOpenings = [
    {
      id: 1,
      title: "Développeur React Senior",
      department: "Développement",
      location: "Paris",
      type: "CDI",
      applicants: 12,
      status: "open"
    },
    {
      id: 2,
      title: "Designer UX/UI",
      department: "Design",
      location: "Lyon",
      type: "CDI",
      applicants: 8,
      status: "open"
    },
    {
      id: 3,
      title: "Chef de Projet Digital",
      department: "Management",
      location: "Remote",
      type: "CDI",
      applicants: 15,
      status: "open"
    },
    {
      id: 4,
      title: "Développeur Backend",
      department: "Développement",
      location: "Marseille",
      type: "CDD",
      applicants: 6,
      status: "closed"
    }
  ];
  
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recrutement</h1>
        <p className="text-gray-600">Gérez vos offres d'emploi et candidatures</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-blue-600">{openJobs}</span>
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
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Briefcase className="w-4 h-4" />
              <span>Nouvelle offre</span>
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("candidates")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "candidates"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Candidats ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "jobs"
                ? "text-blue-600 border-b-2 border-blue-600"
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
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {candidate.experience}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        candidate.status === 'screening' ? 'bg-yellow-100 text-yellow-800' :
                        candidate.status === 'interview' ? 'bg-blue-100 text-blue-800' :
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
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Voir profil
                      </button>
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
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Gérer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruitmentPage;
