import { create } from "zustand";
import { users, companies, roles } from "../data/mockData";

export const useAuthStore = create((set, get) => ({
  // État d'authentification
  currentUser: null,
  currentCompany: null,
  isAuthenticated: false,
  isLoading: false,

  // Actions d'authentification
  login: async (email, password) => {
    set({ isLoading: true });
    
    // Simulation d'API - En production: appel API réel
    const user = users.find(u => u.email === email && u.isActive);
    
    if (user) {
      const company = companies.find(c => c.id === user.companyId);
      
      localStorage.setItem('authToken', 'mock_jwt_token');
      localStorage.setItem('userId', user.id.toString());
      
      set({
        currentUser: user,
        currentCompany: company,
        isAuthenticated: true,
        isLoading: false
      });
      
      return { success: true };
    }
    
    set({ isLoading: false });
    return { success: false, error: "Email ou mot de passe incorrect" };
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    
    set({
      currentUser: null,
      currentCompany: null,
      isAuthenticated: false
    });
  },

  // Vérification des permissions
  hasPermission: (permission) => {
    const { currentUser } = get();
    if (!currentUser) return false;
    
    const userRole = roles[currentUser.role];
    if (!userRole) return false;
    
    // Employeur a tous les droits
    if (userRole.permissions.includes("*")) return true;
    
    // Vérification permission spécifique
    return userRole.permissions.includes(permission);
  },

  hasAnyPermission: (permissions) => {
    return permissions.some(permission => get().hasPermission(permission));
  },

  // Vérification des rôles
  hasRole: (role) => {
    const { currentUser } = get();
    return currentUser?.role === role;
  },

  isEmployer: () => get().hasRole('employer'),
  isHRAdmin: () => get().hasRole('hr_admin'),
  isHRUser: () => get().hasRole('hr_user'),
  isManager: () => get().hasRole('manager'),
  isEmployee: () => get().hasRole('employee'),

  // Gestion des utilisateurs (pour employeurs/RH)
  inviteUser: (userData) => {
    const { currentUser, currentCompany } = get();
    
    if (!get().hasPermission('users.manage')) {
      return { success: false, error: "Permission refusée" };
    }

    // Simulation d'invitation
    const newUser = {
      id: Date.now(),
      ...userData,
      companyId: currentCompany.id,
      isActive: false, // En attente d'activation
      createdDate: new Date().toISOString(),
      invitedBy: currentUser.id
    };

    // En production: envoi d'email d'invitation
    console.log('Invitation envoyée à:', userData.email);
    
    return { success: true, user: newUser };
  },

  // Initialisation depuis le localStorage
  initializeAuth: () => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      const user = users.find(u => u.id === parseInt(userId));
      if (user) {
        const company = companies.find(c => c.id === user.companyId);
        set({
          currentUser: user,
          currentCompany: company,
          isAuthenticated: true
        });
      }
    }
  },

  // Filtrage des données par entreprise
  getCompanyEmployees: () => {
    const { currentCompany } = get();
    if (!currentCompany) return [];
    
    const { employees } = require('./useHRStore').useHRStore.getState();
    return employees.filter(emp => emp.companyId === currentCompany.id);
  },

  // Statistiques de l'entreprise
  getCompanyStats: () => {
    const { currentCompany } = get();
    if (!currentCompany) return null;

    const companyEmployees = get().getCompanyEmployees();
    const companyUsers = users.filter(u => u.companyId === currentCompany.id);
    
    return {
      totalEmployees: companyEmployees.length,
      totalUsers: companyUsers.length,
      activeUsers: companyUsers.filter(u => u.isActive).length,
      plan: currentCompany.plan,
      maxEmployees: currentCompany.maxEmployees
    };
  }
}));