import { create } from "zustand";
import {
  employees as initialEmployees,
  attendanceRecords as initialAttendance,
  leaveRequests as initialLeaveRequests,
  payrollRecords as initialPayroll,
  performanceReviews as initialPerformance,
  jobOpenings as initialJobOpenings,
  candidates as initialCandidates,
  departments as initialDepartments,
  documentTypes,
  employeeHistory,
  sharedDocuments as initialSharedDocuments,
  shareNotifications as initialShareNotifications,
  shareGroups,
  companies,
  users,
  roles,
} from "../data/mockData";

export const useHRStore = create((set, get) => ({
  // 👥 Employés
  employees: initialEmployees,
  
  // 🤝 Partage de documents
  sharedDocuments: initialSharedDocuments,
  shareNotifications: initialShareNotifications,
  
  // 🏢 Multi-tenant
  companies: companies,
  users: users,
  roles: roles,
  addEmployee: (employee) =>
    set((state) => ({
      employees: [...state.employees, { 
        ...employee, 
        id: Date.now(),
        documents: employee.documents || [],
        companyId: employee.companyId // Assurer l'appartenance à l'entreprise
      }],
    })),
  updateEmployee: (id, updates) =>
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id ? { ...emp, ...updates } : emp
      ),
    })),
  deleteEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((emp) => emp.id !== id),
    })),
  
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
      emp.name.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm) ||
      emp.role.toLowerCase().includes(searchTerm) ||
      emp.department.toLowerCase().includes(searchTerm)
    );
  },

  // 📅 Présences et congés
  attendanceRecords: initialAttendance,
  leaveRequests: initialLeaveRequests,
  addLeaveRequest: (request) =>
    set((state) => ({
      leaveRequests: [...state.leaveRequests, { ...request, id: Date.now() }],
    })),
  updateLeaveRequest: (id, updates) =>
    set((state) => ({
      leaveRequests: state.leaveRequests.map((req) =>
        req.id === id ? { ...req, ...updates } : req
      ),
    })),

  // 💰 Paie
  payrollRecords: initialPayroll,
  addPayrollRecord: (record) =>
    set((state) => ({
      payrollRecords: [...state.payrollRecords, { ...record, id: Date.now() }],
    })),
  updatePayrollRecord: (id, updates) =>
    set((state) => ({
      payrollRecords: state.payrollRecords.map((rec) =>
        rec.id === id ? { ...rec, ...updates } : rec
      ),
    })),

  // 🎯 Performance
  performanceReviews: initialPerformance,
  addPerformanceReview: (review) =>
    set((state) => ({
      performanceReviews: [
        ...state.performanceReviews,
        { ...review, id: Date.now() },
      ],
    })),
  updatePerformanceReview: (id, updates) =>
    set((state) => ({
      performanceReviews: state.performanceReviews.map((rev) =>
        rev.id === id ? { ...rev, ...updates } : rev
      ),
    })),

  // 👔 Recrutement
  jobOpenings: initialJobOpenings,
  candidates: initialCandidates,
  addJobOpening: (job) =>
    set((state) => ({
      jobOpenings: [...state.jobOpenings, { ...job, id: Date.now() }],
    })),
  updateJobOpening: (id, updates) =>
    set((state) => ({
      jobOpenings: state.jobOpenings.map((job) =>
        job.id === id ? { ...job, ...updates } : job
      ),
    })),
  addCandidate: (candidate) =>
    set((state) => ({
      candidates: [...state.candidates, { ...candidate, id: Date.now() }],
    })),
  updateCandidate: (id, updates) =>
    set((state) => ({
      candidates: state.candidates.map((cand) =>
        cand.id === id ? { ...cand, ...updates } : cand
      ),
    })),

  // 🏢 Départements
  departments: initialDepartments,

  // 🌙 Dark Mode
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  // 🔍 Filtres et recherche
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // 📈 Statistiques (filtrées par entreprise)
  getEmployeeStats: (companyId = null) => {
    const { employees } = get();
    const filteredEmployees = companyId 
      ? employees.filter(emp => emp.companyId === companyId)
      : employees;
      
    const totalEmployees = filteredEmployees.length;
    const activeEmployees = filteredEmployees.filter(emp => emp.status === 'active').length;
    const onLeaveEmployees = filteredEmployees.filter(emp => emp.status === 'on_leave').length;
    
    const departmentStats = filteredEmployees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total: totalEmployees,
      active: activeEmployees,
      onLeave: onLeaveEmployees,
      byDepartment: departmentStats
    };
  },
  
  // Filtrage des employés par entreprise
  getCompanyEmployees: (companyId) => {
    const { employees } = get();
    return employees.filter(emp => emp.companyId === companyId);
  },
  
  // Gestion des utilisateurs
  addUser: (userData) =>
    set((state) => ({
      users: [...state.users, { ...userData, id: Date.now() }]
    })),
    
  updateUser: (userId, updates) =>
    set((state) => ({
      users: state.users.map(user =>
        user.id === userId ? { ...user, ...updates } : user
      )
    })),
    
  deactivateUser: (userId) =>
    set((state) => ({
      users: state.users.map(user =>
        user.id === userId ? { ...user, isActive: false } : user
      )
    })),
  
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
