// Permissions par défaut pour l'employeur
export const getDefaultPermissions = (userRole) => {
  const defaultPermissions = {
    employer: {
      dashboard: { read: true, write: true },
      employees: { read: true, write: true, delete: true },
      users: { read: true, write: true, delete: true },
      departments: { read: true, write: true, delete: true },
      tasks: { read: true, write: true, delete: true },
      payroll: { read: true, write: true, delete: true },
      reports: { read: true, write: true },
      settings: { read: true, write: true },
      integrations: { read: true, write: true },
      analytics: { read: true, write: true },
      workflows: { read: true, write: true, delete: true },
      contracts: { read: true, write: true, delete: true },
      recruitment: { read: true, write: true, delete: true },
      performance: { read: true, write: true },
      assets: { read: true, write: true, delete: true },
      notifications: { read: true, write: true }
    },
    hr_admin: {
      dashboard: { read: true, write: true },
      employees: { read: true, write: true, delete: true },
      users: { read: true, write: true },
      departments: { read: true, write: true },
      tasks: { read: true, write: true },
      payroll: { read: true, write: true },
      reports: { read: true, write: true },
      settings: { read: true, write: false },
      integrations: { read: true, write: false },
      analytics: { read: true, write: true },
      workflows: { read: true, write: true },
      contracts: { read: true, write: true },
      recruitment: { read: true, write: true },
      performance: { read: true, write: true },
      assets: { read: true, write: true },
      notifications: { read: true, write: true }
    }
  };

  return defaultPermissions[userRole] || defaultPermissions.employer;
};

export const hasPermission = (userPermissions, module, action = 'read') => {
  if (!userPermissions || typeof userPermissions !== 'object') {
    return false;
  }
  
  return userPermissions[module]?.[action] || false;
};