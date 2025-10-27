import apiClient from '../api/client';

export const systemService = {
  // Notifications
  notifications: {
    getAll: () => apiClient.get('/notifications'),
    getById: (id) => apiClient.get(`/notifications/${id}`),
    create: (data) => apiClient.post('/notifications', data),
    markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
    markAllAsRead: () => apiClient.put('/notifications/read-all'),
    delete: (id) => apiClient.delete(`/notifications/${id}`),
  },
  
  // Settings
  settings: {
    getAll: () => apiClient.get('/settings'),
    getById: (id) => apiClient.get(`/settings/${id}`),
    update: (id, data) => apiClient.put(`/settings/${id}`, data),
    create: (data) => apiClient.post('/settings', data),
    delete: (id) => apiClient.delete(`/settings/${id}`),
  },
  
  // Assets
  assets: {
    getAll: () => apiClient.get('/assets'),
    getById: (id) => apiClient.get(`/assets/${id}`),
    create: (data) => apiClient.post('/assets', data),
    update: (id, data) => apiClient.put(`/assets/${id}`, data),
    delete: (id) => apiClient.delete(`/assets/${id}`),
  },

  // Système de pointage
  timeTracking: {
    clockIn: async (data) => {
      const response = await apiClient.post('/time-tracking/clock-in', data);
      return response.data;
    },

    clockOut: async (sessionId, data) => {
      const response = await apiClient.put(`/time-tracking/sessions/${sessionId}/clock-out`, data);
      return response.data;
    },

    startBreak: async (sessionId, data) => {
      const response = await apiClient.put(`/time-tracking/sessions/${sessionId}/break-start`, data);
      return response.data;
    },

    endBreak: async (sessionId, data) => {
      const response = await apiClient.put(`/time-tracking/sessions/${sessionId}/break-end`, data);
      return response.data;
    },

    getEntries: async (date) => {
      const response = await apiClient.get(`/time-tracking/entries?date=${date}`);
      return response.data;
    },

    getWeeklyEntries: async (startDate) => {
      const response = await apiClient.get(`/time-tracking/entries/weekly?start=${startDate}`);
      return response.data;
    }
  },

  // Système de paie
  payroll: {
    getAttendanceData: async (year, month) => {
      const response = await apiClient.get(`/payroll/attendance/${year}/${month}`);
      return response.data;
    },

    getOvertimeData: async (year, month) => {
      const response = await apiClient.get(`/payroll/overtime/${year}/${month}`);
      return response.data;
    },

    getLeaveData: async (year, month) => {
      const response = await apiClient.get(`/payroll/leaves/${year}/${month}`);
      return response.data;
    },

    generatePayslip: async (data) => {
      const response = await apiClient.post('/payroll/payslips/generate', data);
      return response.data;
    },

    finalize: async (data) => {
      const response = await apiClient.post('/payroll/finalize', data);
      return response.data;
    },

    getPayslip: async (employeeId, period) => {
      const response = await apiClient.get(`/payroll/payslips/${employeeId}/${period}`);
      return response.data;
    },

    downloadPayslip: async (payslipId) => {
      const response = await apiClient.get(`/payroll/payslips/${payslipId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    }
  },
  
  // WebSocket connection
  websocket: {
    connect: () => {
      const token = localStorage.getItem('access_token');
      const wsUrl = `ws://localhost:8000/ws?token=${token}`;
      return new WebSocket(wsUrl);
    }
  }
};