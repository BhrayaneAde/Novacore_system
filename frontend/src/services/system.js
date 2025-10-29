import apiClient from '../api/client';

// Cache simple pour éviter les appels répétés
let employeesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 30000; // 30 secondes

const getCachedEmployees = async () => {
  const now = Date.now();
  if (employeesCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return employeesCache;
  }
  
  const response = await apiClient.get('/employees/employees');
  employeesCache = response;
  cacheTimestamp = now;
  return response;
};

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

  // Settings Management
  settings: {
    getRoles: () => apiClient.get('/settings/roles'),
    createRole: (data) => apiClient.post('/settings/roles', data),
    updateRole: (id, data) => apiClient.put(`/settings/roles/${id}`, data),
    deleteRole: (id) => apiClient.delete(`/settings/roles/${id}`),
    getCompanySettings: () => apiClient.get('/settings/company'),
    updateCompanySettings: (data) => apiClient.put('/settings/company', data),
    getSecuritySettings: () => apiClient.get('/settings/security'),
    updateSecuritySettings: (data) => apiClient.put('/settings/security', data),
    getIntegrations: () => apiClient.get('/settings/integrations'),
    createIntegration: (data) => apiClient.post('/settings/integrations', data),
    updateIntegration: (id, data) => apiClient.put(`/settings/integrations/${id}`, data),
    deleteIntegration: (id) => apiClient.delete(`/settings/integrations/${id}`),
    getNotificationSettings: () => apiClient.get('/settings/notifications'),
    updateNotificationSettings: (data) => apiClient.put('/settings/notifications', data)
  },

  // Employees service
  employees: {
    getAll: () => getCachedEmployees(),
    getById: (id) => apiClient.get(`/employees/employees/${id}`),
    create: (data) => apiClient.post('/employees/employees', data),
    update: (id, data) => apiClient.put(`/employees/employees/${id}`, data),
    delete: (id) => apiClient.delete(`/employees/employees/${id}`)
  },

  // Manager nominations
  manager: {
    getAll: async () => {
      try {
        const response = await getCachedEmployees();
        const employees = response.data?.employees || response.employees || [];
        // Filter employees with "Manager" in their role
        const managers = employees.filter(emp => emp.role && emp.role.toLowerCase().includes('manager'));
        console.log('Final managers to return:', managers);
        return { data: managers };
      } catch (error) {
        console.error('Error fetching managers:', error);
        return { data: [] };
      }
    },
    getPendingNominations: () => apiClient.get('/manager/nominations/pending'),
    getNominations: () => apiClient.get('/manager/nominations'),
    createNomination: (data) => apiClient.post('/manager/nominations', data),
    updateNomination: (id, data) => apiClient.put(`/manager/nominations/${id}`, data)
  },

  // WebSocket service
  websocket: {
    connect: () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.warn('No auth token for WebSocket');
          return null;
        }
        const wsUrl = `ws://localhost:8000/ws?token=${token}`;
        const ws = new WebSocket(wsUrl);
        ws.onerror = (error) => console.warn('WebSocket error:', error);
        return ws;
      } catch (error) {
        console.warn('WebSocket connection failed:', error);
        return null;
      }
    }
  }
};

// Additional services for compatibility
export const usersService = {
  getAll: () => apiClient.get('/users')
};

export const employeesService = {
  getAll: () => systemService.employees.getAll(),
  getById: (id) => systemService.employees.getById(id),
  create: (data) => systemService.employees.create(data),
  update: (id, data) => systemService.employees.update(id, data),
  delete: (id) => systemService.employees.delete(id),
  getTeamMembers: (managerId) => {
    // Return employees from the same department as the manager
    return systemService.employees.getAll().then(response => {
      const employees = response.employees || response.data?.employees || [];
      const manager = employees.find(emp => emp.id === managerId);
      if (!manager) return { data: [] };
      const teamMembers = employees.filter(emp => 
        emp.department_id === manager.department_id && emp.id !== managerId
      );
      return { data: teamMembers };
    });
  }
};

export const hrService = {
  departments: {
    getAll: () => apiClient.get('/settings/departments')
  }
};

export const tasksService = {
  getAll: () => apiClient.get('/tasks'),
  getAnalytics: () => Promise.resolve({
    data: {
      total: 24,
      completed: 18,
      inProgress: 4,
      pending: 2,
      completionRate: 75,
      avgCompletionTime: 3.2
    }
  }),
  create: (data) => apiClient.post('/tasks', data),
  update: (id, data) => apiClient.put(`/tasks/${id}`, data),
  delete: (id) => apiClient.delete(`/tasks/${id}`)
};

export default systemService;