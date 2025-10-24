import apiClient from '../api/client';

export const emailService = {
  // Envoyer une invitation par email
  async sendInvitation(invitationData) {
    const response = await apiClient.post('/email/send-invitation', {
      recipient_email: invitationData.email,
      recipient_name: `${invitationData.firstName} ${invitationData.lastName}`,
      role: invitationData.role,
      company_name: invitationData.companyName,
      invitation_link: invitationData.invitationLink,
      sender_name: invitationData.senderName
    });
    return response.data;
  },
  
  // Envoyer un email de bienvenue
  async sendWelcomeEmail(userData) {
    const response = await apiClient.post('/email/send-welcome', {
      recipient_email: userData.email,
      recipient_name: `${userData.firstName} ${userData.lastName}`,
      company_name: userData.companyName,
      login_link: userData.loginLink,
      temporary_password: userData.temporaryPassword
    });
    return response.data;
  },
  
  // Envoyer une notification de changement de rôle
  async sendRoleChangeNotification(userData) {
    const response = await apiClient.post('/email/send-role-change', {
      recipient_email: userData.email,
      recipient_name: `${userData.firstName} ${userData.lastName}`,
      new_role: userData.newRole,
      changed_by: userData.changedBy,
      company_name: userData.companyName
    });
    return response.data;
  },
  
  // Envoyer une notification de réinitialisation de mot de passe
  async sendPasswordReset(email) {
    const response = await apiClient.post('/email/send-password-reset', {
      email
    });
    return response.data;
  },
  
  // Templates d'emails disponibles
  async getEmailTemplates() {
    const response = await apiClient.get('/email/templates');
    return response.data;
  },
  
  // Personnaliser un template d'email
  async updateEmailTemplate(templateId, templateData) {
    const response = await apiClient.put(`/email/templates/${templateId}`, templateData);
    return response.data;
  }
};