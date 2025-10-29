import { create } from "zustand";
import { authService, usersService } from "../services";

export const useAuthStore = create((set, get) => ({
  // État d'authentification
  currentUser: null,
  currentCompany: null,
  isAuthenticated: false,
  isLoading: false,

  // Actions d'authentification
  login: async (email, password) => {
    set({ isLoading: true });
    
    try {
      // Appel API réel
      const response = await authService.login(email, password);
      
      // Récupérer les infos utilisateur
      const user = await authService.getCurrentUser();
      let company = null;
      
      try {
        company = await usersService.companies.getMe();
      } catch (companyError) {
        company = { id: 1, name: 'NovaCore', plan: 'premium' };
      }
      
      set({
        currentUser: user,
        currentCompany: company,
        isAuthenticated: true,
        isLoading: false
      });
      
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        error: error.response?.data?.detail || "Email ou mot de passe incorrect" 
      };
    }
  },

  logout: () => {
    authService.logout();
    
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
    
    // Employeur a tous les droits
    if (currentUser.role === 'employer') return true;
    
    // Permissions par rôle
    const rolePermissions = {
      hr_admin: ['users.manage', 'employees.manage', 'leaves.manage'],
      manager: ['team.manage', 'leaves.approve', 'tasks.assign'],
      employee: ['profile.view', 'leaves.request', 'tasks.view']
    };
    
    return rolePermissions[currentUser.role]?.includes(permission) || false;
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
  inviteUser: async (userData) => {
    const { currentUser } = get();
    
    if (!get().hasPermission('users.manage')) {
      return { success: false, error: "Permission refusée" };
    }

    try {
      const result = await usersService.inviteUser(userData);
      return { success: true, user: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || "Erreur lors de l'invitation" 
      };
    }
  },

  // Initialisation depuis le localStorage
  initializeAuth: async () => {
    if (authService.isAuthenticated()) {
      try {
        const user = await authService.getCurrentUser();
        let company = null;
        
        // Essayer de récupérer les infos de l'entreprise
        try {
          company = await usersService.companies.getMe();
        } catch (companyError) {
          console.warn('Impossible de récupérer les infos de l\'entreprise:', companyError);
          // Fallback avec des données par défaut
          company = {
            id: 1,
            name: 'NovaCore',
            plan: 'premium',
            max_employees: 100
          };
        }
        
        set({
          currentUser: user,
          currentCompany: company,
          isAuthenticated: true
        });
      } catch (error) {
        console.error('Erreur d\'initialisation auth:', error);
        // Token invalide, déconnexion
        authService.logout();
        set({
          currentUser: null,
          currentCompany: null,
          isAuthenticated: false
        });
      }
    } else {
      // Pas de token, s'assurer que l'état est correct
      set({
        currentUser: null,
        currentCompany: null,
        isAuthenticated: false
      });
    }
  },

  // Statistiques de l'entreprise
  getCompanyStats: async () => {
    const { currentCompany } = get();
    if (!currentCompany) return null;

    try {
      const users = await usersService.getAll();
      const employees = await usersService.getAll(); // À adapter selon l'API
      
      return {
        totalEmployees: employees.data?.length || 0,
        totalUsers: users.data?.length || 0,
        activeUsers: users.data?.filter(u => u.is_active).length || 0,
        plan: currentCompany.plan,
        maxEmployees: currentCompany.max_employees
      };
    } catch (error) {
      return null;
    }
  }
}));