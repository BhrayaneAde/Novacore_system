import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Shield, AlertTriangle } from 'lucide-react';

const PermissionGuard = ({ 
  permission, 
  permissions = [], 
  role,
  roles = [],
  requireAll = false,
  fallback = null,
  children 
}) => {
  const { hasPermission, hasAnyPermission, hasRole, currentUser } = useAuthStore();

  // Vérification des permissions
  if (permission && !hasPermission(permission)) {
    return fallback || <AccessDenied />;
  }

  if (permissions.length > 0) {
    const hasAccess = requireAll 
      ? permissions.every(p => hasPermission(p))
      : hasAnyPermission(permissions);
    
    if (!hasAccess) {
      return fallback || <AccessDenied />;
    }
  }

  // Vérification des rôles
  if (role && !hasRole(role)) {
    return fallback || <AccessDenied />;
  }

  if (roles.length > 0) {
    const hasRoleAccess = roles.some(r => hasRole(r));
    if (!hasRoleAccess) {
      return fallback || <AccessDenied />;
    }
  }

  return children;
};

const AccessDenied = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <Shield className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Accès refusé</h3>
    <p className="text-gray-600 text-center max-w-md">
      Vous n'avez pas les permissions nécessaires pour accéder à cette section.
    </p>
    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-yellow-800">
        Contactez votre administrateur pour obtenir les accès nécessaires.
      </p>
    </div>
  </div>
);

export default PermissionGuard;