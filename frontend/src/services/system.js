import apiClient from '../api/client';

export const systemService = {
  // Notifications
  notifications: {
    getAll: () => apiClient.get('/notifications'),
    getById: (id) => apiClient.get(`/notifications/${id}`),
    create: (data) => apiClient.post('/notifications', data),
    markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
    markAllAsRead: () => apiClient.put('/notifications/mark-all-read'),
    getUnreadCount: () => apiClient.get('/notifications/unread-count'),
    delete: (id) => apiClient.delete(`/notifications/${id}`),
  },

  // Attendance Calendar
  attendance: {
    getCalendar: (employeeId, month, year) => 
      apiClient.get(`/attendance/calendar/${employeeId}?month=${month}&year=${year}`),
    getStatistics: (employeeId) => 
      apiClient.get(`/attendance/statistics/${employeeId}`),
    getRecords: () => apiClient.get('/attendance/records'),
    createRecord: (data) => apiClient.post('/attendance/records', data),
    getTimeEntries: () => apiClient.get('/attendance/time-entries'),
    createTimeEntry: (data) => apiClient.post('/attendance/time-entries', data),
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
    }
  },

  // Système de rapports
  reports: {
    generate: async (reportId, params) => {
      const response = await apiClient.post('/reports/generate', {
        report_id: reportId,
        ...params
      });
      return response.data;
    },

    export: async (reportId, format, params) => {
      const response = await apiClient.post('/reports/export', {
        report_id: reportId,
        format,
        ...params
      }, {
        responseType: 'blob'
      });
      return response.data;
    },

    getHistory: async () => {
      const response = await apiClient.get('/reports/history');
      return response.data;
    }
  },

  // Analytics
  analytics: {
    getHeadcount: async (period) => {
      const response = await apiClient.get(`/analytics/headcount?period=${period}`);
      return response.data;
    },

    getTurnover: async (period) => {
      const response = await apiClient.get(`/analytics/turnover?period=${period}`);
      return response.data;
    },

    getAttendance: async (period) => {
      const response = await apiClient.get(`/analytics/attendance?period=${period}`);
      return response.data;
    },

    getCosts: async (period) => {
      const response = await apiClient.get(`/analytics/costs?period=${period}`);
      return response.data;
    },

    getPerformance: async (period) => {
      const response = await apiClient.get(`/analytics/performance?period=${period}`);
      return response.data;
    },

    getRecruitment: async (period) => {
      const response = await apiClient.get(`/analytics/recruitment?period=${period}`);
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