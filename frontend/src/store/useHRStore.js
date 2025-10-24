import { create } from "zustand";
import { 
  employeesService, 
  usersService, 
  hrService, 
  leavesService, 
  performanceService,
  tasksService 
} from "../services";

export const useHRStore = create((set, get) => ({
  // 👥 Employés
  employees: [],
  
  // 🤝 Partage de documents
  sharedDocuments: [],
  shareNotifications: [],
  
  // 🏢 Multi-tenant
  companies: [],
  users: [],
  departments: [],
  leaveRequests: [],
  payrollRecords: [],
  performanceReviews: [],
  jobOpenings: [],
  candidates: [],
  attendanceRecords: [],
  
  // État de chargement
  loading: false,
  
  // Initialisation des données
  initializeData: async () => {
    set({ loading: true });
    try {
      const [employeesRes, usersRes, departmentsRes, leavesRes] = await Promise.all([
        employeesService.getAll().catch(() => ({ data: [] })),
        usersService.getAll().catch(() => ({ data: [] })),
        hrService.departments.getAll().catch(() => ({ data: [] })),
        leavesService.getAll().catch(() => ({ data: [] }))
      ]);
      
      set({
        employees: employeesRes.data || [],
        users: usersRes.data || [],
        departments: departmentsRes.data || [],
        leaveRequests: leavesRes.data || [],
        loading: false
      });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      set({ loading: false });
    }
  },
  addEmployee: async (employeeData) => {
    try {
      const newEmployee = await employeesService.create(employeeData);
      set((state) => ({
        employees: [...state.employees, newEmployee]
      }));
      return { success: true, employee: newEmployee };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Erreur lors de l\'ajout' };
    }
  },
  updateEmployee: async (id, updates) => {
    try {
      const updatedEmployee = await employeesService.update(id, updates);
      set((state) => ({
        employees: state.employees.map((emp) =>
          emp.id === id ? updatedEmployee : emp
        )
      }));
      return { success: true, employee: updatedEmployee };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Erreur lors de la mise à jour' };
    }
  },
  deleteEmployee: async (id) => {
    try {
      await employeesService.delete(id);
      set((state) => ({
        employees: state.employees.filter((emp) => emp.id !== id)
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Erreur lors de la suppression' };
    }
  },
  
  // 📄 Gestion des documents
  addEmployeeDocument: (employeeId, document) =>
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === employeeId 
          ? { 
              ...emp, 
              documents: [...(emp.documents || []), { 
                ...document, 
                id: Date.now(),
                uploadDate: new Date().toISOString().split('T')[0]
              }]
            }
          : emp
      ),
    })),
  removeEmployeeDocument: (employeeId, documentId) =>
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === employeeId 
          ? { 
              ...emp, 
              documents: emp.documents?.filter(doc => doc.id !== documentId) || []
            }
          : emp
      ),
    })),
  
  // 📊 Validation et recherche
  validateEmployeeEmail: (email, excludeId = null) => {
    const { employees } = get();
    return !employees.some(emp => emp.email === email && emp.id !== excludeId);
  },
  
  searchEmployees: (query) => {
    const { employees } = get();
    if (!query) return employees;
    
    const searchTerm = query.toLowerCase();
    return employees.filter(emp => 
      `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm) ||
      emp.email?.toLowerCase().includes(searchTerm) ||
      emp.position?.toLowerCase().includes(searchTerm) ||
      emp.department?.name?.toLowerCase().includes(searchTerm)
    );
  },

  // 📅 Présences et congés
  addLeaveRequest: async (requestData) => {
    try {
      const newRequest = await leavesService.create(requestData);
      set((state) => ({
        leaveRequests: [...state.leaveRequests, newRequest]
      }));
      return { success: true, request: newRequest };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Erreur lors de la demande' };
    }
  },
  
  updateLeaveRequest: async (id, updates) => {
    try {
      const updatedRequest = await leavesService.update(id, updates);
      set((state) => ({
        leaveRequests: state.leaveRequests.map((req) =>
          req.id === id ? updatedRequest : req
        )
      }));
      return { success: true, request: updatedRequest };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Erreur lors de la mise à jour' };
    }
  },

  // 💰 Paie
  addPayrollRecord: async (recordData) => {
    try {
      // À implémenter selon l'API de paie
      const newRecord = { ...recordData, id: Date.now() };
      set((state) => ({
        payrollRecords: [...state.payrollRecords, newRecord]
      }));
      return { success: true, record: newRecord };
    } catch (error) {
      return { success: false, error: 'Erreur lors de l\'ajout du record de paie' };
    }
  },
  
  updatePayrollRecord: async (id, updates) => {
    try {
      set((state) => ({
        payrollRecords: state.payrollRecords.map((rec) =>
          rec.id === id ? { ...rec, ...updates } : rec
        )
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }
  },

  // 🎯 Performance
  addPerformanceReview: async (reviewData) => {
    try {
      const newReview = await performanceService.create(reviewData);
      set((state) => ({
        performanceReviews: [...state.performanceReviews, newReview]
      }));
      return { success: true, review: newReview };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Erreur lors de l\'ajout' };
    }
  },
  
  updatePerformanceReview: async (id, updates) => {
    try {
      const updatedReview = await performanceService.update(id, updates);
      set((state) => ({
        performanceReviews: state.performanceReviews.map((rev) =>
          rev.id === id ? updatedReview : rev
        )
      }));
      return { success: true, review: updatedReview };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Erreur lors de la mise à jour' };
    }
  },

  // 👔 Recrutement
  addJobOpening: async (jobData) => {
    try {
      const newJob = { ...jobData, id: Date.now() };
      set((state) => ({
        jobOpenings: [...state.jobOpenings, newJob]
      }));
      return { success: true, job: newJob };
    } catch (error) {
      return { success: false, error: 'Erreur lors de l\'ajout' };
    }
  },
  
  updateJobOpening: async (id, updates) => {
    try {
      set((state) => ({
        jobOpenings: state.jobOpenings.map((job) =>
          job.id === id ? { ...job, ...updates } : job
        )
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }
  },
  
  addCandidate: async (candidateData) => {
    try {
      const newCandidate = { ...candidateData, id: Date.now() };
      set((state) => ({
        candidates: [...state.candidates, newCandidate]
      }));
      return { success: true, candidate: newCandidate };
    } catch (error) {
      return { success: false, error: 'Erreur lors de l\'ajout' };
    }
  },
  
  updateCandidate: async (id, updates) => {
    try {
      set((state) => ({
        candidates: state.candidates.map((cand) =>
          cand.id === id ? { ...cand, ...updates } : cand
        )
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }
  },

  // 🏢 Départements
  loadDepartments: async () => {
    try {
      const response = await hrService.departments.getAll();
      set({ departments: response.data || [] });
      return { success: true, departments: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Erreur lors du chargement' };
    }
  },

  // 🌙 Dark Mode
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  // 🔍 Filtres et recherche
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // 📈 Statistiques
  getEmployeeStats: () => {
    const { employees } = get();
      
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === 'active').length;
    const onLeaveEmployees = employees.filter(emp => emp.status === 'on_leave').length;
    
    const departmentStats = employees.reduce((acc, emp) => {
      const deptName = emp.department?.name || 'Non assigné';
      acc[deptName] = (acc[deptName] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total: totalEmployees,
      active: activeEmployees,
      onLeave: onLeaveEmployees,
      byDepartment: departmentStats
    };
  },
  
  // Filtrage des employés
  getActiveEmployees: () => {
    const { employees } = get();
    return employees.filter(emp => emp.status === 'active');
  },
  
  // Gestion des utilisateurs
  addUser: async (userData) => {
    try {
      const newUser = await usersService.create(userData);
      set((state) => ({
        users: [...state.users, newUser]
      }));
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Erreur lors de l\'ajout' };
    }
  },
    
  updateUser: async (userId, updates) => {
    try {
      const updatedUser = await usersService.update(userId, updates);
      set((state) => ({
        users: state.users.map(user =>
          user.id === userId ? updatedUser : user
        )
      }));
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Erreur lors de la mise à jour' };
    }
  },
    
  deactivateUser: async (userId) => {
    try {
      await usersService.deactivate(userId);
      set((state) => ({
        users: state.users.map(user =>
          user.id === userId ? { ...user, is_active: false } : user
        )
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Erreur lors de la désactivation' };
    }
  },
  
  // 🤝 Actions de partage de documents
  shareDocument: (documentId, ownerId, sharedWithIds, permissions, options = {}) =>
    set((state) => {
      const newShare = {
        id: Date.now(),
        documentId,
        ownerId,
        sharedWithIds,
        permissions,
        shareDate: new Date().toISOString().split('T')[0],
        expiryDate: options.expiryDate,
        message: options.message || '',
        isActive: true,
        accessLog: [],
        comments: []
      };
      
      const owner = state.employees.find(e => e.id === ownerId);
      const notifications = sharedWithIds.map(empId => ({
        id: Date.now() + empId,
        employeeId: empId,
        type: 'document_shared',
        title: 'Document partagé avec vous',
        message: `${owner?.name} a partagé un document avec vous`,
        shareId: newShare.id,
        date: new Date().toISOString(),
        read: false
      }));
      
      return {
        sharedDocuments: [...state.sharedDocuments, newShare],
        shareNotifications: [...state.shareNotifications, ...notifications]
      };
    }),
    
  revokeShare: (shareId) =>
    set((state) => ({
      sharedDocuments: state.sharedDocuments.map(share =>
        share.id === shareId ? { ...share, isActive: false } : share
      )
    })),
    
  getSharedWithMe: (employeeId) => {
    const { sharedDocuments, employees } = get();
    return sharedDocuments
      .filter(share => share.sharedWithIds.includes(employeeId) && share.isActive)
      .map(share => {
        const owner = employees.find(emp => emp.id === share.ownerId);
        const document = owner?.documents?.find(doc => doc.id === share.documentId);
        return { ...share, owner, document };
      });
  },
  
  getSharedByMe: (employeeId) => {
    const { sharedDocuments, employees } = get();
    return sharedDocuments
      .filter(share => share.ownerId === employeeId && share.isActive)
      .map(share => {
        const document = employees.find(emp => emp.id === employeeId)?.documents?.find(doc => doc.id === share.documentId);
        const sharedWith = share.sharedWithIds.map(id => employees.find(emp => emp.id === id));
        return { ...share, document, sharedWith };
      });
  },
  
  logDocumentAccess: (shareId, employeeId, action) =>
    set((state) => ({
      sharedDocuments: state.sharedDocuments.map(share =>
        share.id === shareId
          ? {
              ...share,
              accessLog: [...share.accessLog, {
                employeeId,
                action,
                date: new Date().toISOString()
              }]
            }
          : share
      )
    })),
    
  addShareComment: (shareId, employeeId, message) =>
    set((state) => {
      const employee = state.employees.find(emp => emp.id === employeeId);
      return {
        sharedDocuments: state.sharedDocuments.map(share =>
          share.id === shareId
            ? {
                ...share,
                comments: [...share.comments, {
                  id: Date.now(),
                  employeeId,
                  employeeName: employee?.name || 'Inconnu',
                  message,
                  date: new Date().toISOString()
                }]
              }
            : share
        )
      };
    }),
    
  markNotificationAsRead: (notificationId) =>
    set((state) => ({
      shareNotifications: state.shareNotifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    })),
}));
