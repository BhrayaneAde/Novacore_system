import apiClient from '../api/client';

// Rôles disponibles dans le système
export const USER_ROLES = {
  EMPLOYER: 'employer',
  HR_ADMIN: 'hr_admin', 
  MANAGER: 'manager',
  EMPLOYEE: 'employee'
};

// Permissions par rôle
export const ROLE_PERMISSIONS = {
  [USER_ROLES.EMPLOYER]: ['all'],
  [USER_ROLES.HR_ADMIN]: ['manage_employees', 'manage_leaves', 'manage_contracts', 'view_reports'],
  [USER_ROLES.MANAGER]: ['manage_team', 'approve_leaves', 'assign_tasks', 'view_team_reports'],
  [USER_ROLES.EMPLOYEE]: ['view_profile', 'request_leave', 'view_tasks', 'update_attendance']
};

export const usersService = {
  getAll: () => apiClient.get('/users'),
  getById: (id) => apiClient.get(`/users/${id}`),
  create: (data) => apiClient.post('/users', data),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
  delete: (id) => apiClient.delete(`/users/${id}`),
  getMe: () => apiClient.get('/users/me'),
  
  // Gestion des rôles et permissions
  assignRole: (userId, role) => apiClient.put(`/users/${userId}/role`, { role }),
  updatePermissions: (userId, permissions) => apiClient.put(`/users/${userId}/permissions`, { permissions }),
  
  // Invitations par email (pour l'employeur)
  inviteUser: (userData) => apiClient.post('/email/send-invitation', {
    email: userData.email,
    first_name: userData.firstName,
    last_name: userData.lastName,
    role: userData.role,
    department_id: userData.departmentId
  }),
  
  // Gestion des invitations en attente
  getPendingInvitations: () => apiClient.get('/email/invitations/pending'),
  resendInvitation: (invitationId) => apiClient.post(`/email/invitations/${invitationId}/resend`),
  cancelInvitation: (invitationId) => apiClient.delete(`/email/invitations/${invitationId}`),
  
  // Companies
  companies: {
    getAll: () => apiClient.get('/companies'),
    getById: (id) => apiClient.get(`/companies/${id}`),
    create: (data) => apiClient.post('/companies', data),
    update: (id, data) => apiClient.put(`/companies/${id}`, data),
    delete: (id) => apiClient.delete(`/companies/${id}`),
    getMe: () => apiClient.get('/companies/me'),
    getDepartments: () => apiClient.get('/companies/departments'),
  }
};