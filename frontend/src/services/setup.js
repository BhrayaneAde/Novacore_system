import apiClient from '../api/client';

export const setupService = {
  appearance: {
    get: async () => {
      const response = await apiClient.get('/setup/appearance');
      return response.data;
    },
    
    update: async (data) => {
      const response = await apiClient.put('/setup/appearance', data);
      return response.data;
    }
  },
  
  getSmtpConfig: () => apiClient.get('/settings/smtp'),
  updateSmtpConfig: (data) => apiClient.put('/settings/smtp', data),
  getSecuritySettings: () => apiClient.get('/settings/security'),
  updateSecuritySettings: (data) => apiClient.put('/settings/security', data),
  getNotificationSettings: () => apiClient.get('/settings/notifications'),
  updateNotificationSettings: (data) => apiClient.put('/settings/notifications', data),
  getLeavePolicy: () => Promise.resolve({ data: null }),
  updateLeavePolicy: (data) => Promise.resolve({ data: null }),
  getWorkSchedule: () => Promise.resolve({ data: null }),
  updateWorkSchedule: (data) => Promise.resolve({ data: null }),
  getSecurityConfig: () => Promise.resolve({ data: null }),
  updateSecurityConfig: (data) => Promise.resolve({ data: null })
};