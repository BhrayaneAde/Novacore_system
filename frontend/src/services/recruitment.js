import apiClient from '../api/client';

export const recruitmentService = {
  // Départements
  getDepartments: () => apiClient.get('/recruitment/departments'),
  
  // Offres d'emploi
  getJobOpenings: () => apiClient.get('/recruitment/job-openings'),
  createJobOpening: (jobData) => apiClient.post('/recruitment/job-openings', jobData),
  getJobOpening: (id) => apiClient.get(`/recruitment/job-openings/${id}`),
  updateJobOpening: (id, jobData) => apiClient.put(`/recruitment/job-openings/${id}`, jobData),
  
  // Surveillance email
  getSurveillanceStatus: () => apiClient.get('/recruitment/surveillance/status'),
  
  // Candidats
  getCandidates: (params = {}) => apiClient.get('/auto-recruitment/candidates', { params }),
  updateCandidateStatus: (candidateId, status, notes) => 
    apiClient.put(`/auto-recruitment/candidates/${candidateId}/status`, { status, notes }),
  getCandidateCV: (candidateId) => apiClient.get(`/auto-recruitment/candidates/${candidateId}/cv`),
  
  // Synchronisation email
  syncEmails: () => apiClient.post('/auto-recruitment/sync-emails'),
  
  // Statistiques
  getRecruitmentStats: () => apiClient.get('/auto-recruitment/stats'),
  
  // Entretiens
  getInterviews: (date) => apiClient.get('/recruitment/interviews', { params: { date } }),
  createInterview: (interviewData) => apiClient.post('/recruitment/interviews', interviewData),
  updateInterview: (id, interviewData) => apiClient.put(`/recruitment/interviews/${id}`, interviewData),
  deleteInterview: (id) => apiClient.delete(`/recruitment/interviews/${id}`)
};