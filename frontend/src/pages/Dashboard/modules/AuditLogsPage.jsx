import React, { useState } from 'react';
import { Shield, Search, Filter, Download, Eye, AlertTriangle, User, Settings } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

const AuditLogsPage = () => {
  const { currentUser, isEmployer } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');

  const [auditLogs] = useState([
    {
      id: 1,
      timestamp: '2025-01-20T14:30:00',
      userId: 2,
      userName: 'Sophie Martin',
      userRole: 'hr_admin',
      action: 'employee.create',
      resource: 'Employee',
      resourceId: 'emp_001',
      details: 'Création employé: Alice Dupont',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 Chrome/120.0',
      severity: 'info',
      category: 'employee_management'
    },
    {
      id: 2,
      timestamp: '2025-01-20T13:15:00',
      userId: 1,
      userName: 'Marie Lefebvre',
      userRole: 'employer',
      action: 'salary.update',
      resource: 'Payroll',
      resourceId: 'pay_003',
      details: 'Modification salaire: Thomas Dubois (+5000€)',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 Safari/17.0',
      severity: 'high',
      category: 'payroll'
    },
    {
      id: 3,
      timestamp: '2025-01-20T12:45:00',
      userId: 3,
      userName: 'Thomas Dubois',
      userRole: 'manager',
      action: 'task.assign',
      resource: 'Task',
      resourceId: 'task_045',
      details: 'Attribution tâche: Refonte UI Dashboard',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 Firefox/121.0',
      severity: 'info',
      category: 'task_management'
    },
    {
      id: 4,
      timestamp: '2025-01-20T11:20:00',
      userId: 2,
      userName: 'Sophie Martin',
      userRole: 'hr_admin',
      action: 'login.failed',
      resource: 'Authentication',
      resourceId: null,
      details: 'Tentative de connexion échouée (3 essais)',
      ipAddress: '203.0.113.45',
      userAgent: 'Mozilla/5.0 Chrome/120.0',
      severity: 'warning',
      category: 'security'
    },
    {
      id: 5,
      timestamp: '2025-01-20T10:30:00',
      userId: 1,
      userName: 'Marie Lefebvre',
      userRole: 'employer',
      action: 'settings.update',
      resource: 'CompanySettings',
      resourceId: 'settings_001',
      details: 'Modification paramètres SMTP',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 Safari/17.0',
      severity: 'medium',
      category: 'system_config'
    },
    {
      id: 6,
      timestamp: '2025-01-20T09:15:00',
      userId: 4,
      userName: 'Pierre Moreau',
      userRole: 'manager',
      action: 'evaluation.create',
      resource: 'Evaluation',
      resourceId: 'eval_012',
      details: 'Création évaluation: Antoine Moreau',
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 Edge/120.0',
      severity: 'info',
      category: 'performance'
    },
    {
      id: 7,
      timestamp: '2025-01-19T16:45:00',
      userId: 2,
      userName: 'Sophie Martin',
      userRole: 'hr_admin',
      action: 'document.delete',
      resource: 'Document',
      resourceId: 'doc_089',
      details: 'Suppression document: Ancien contrat',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 Chrome/120.0',
      severity: 'high',
      category: 'document_management'
    },
    {
      id: 8,
      timestamp: '2025-01-19T15:30:00',
      userId: 1,
      userName: 'Marie Lefebvre',
      userRole: 'employer',
      action: 'user.role_change',
      resource: 'User',
      resourceId: 'user_005',
      details: 'Promotion: Lucas Martin → Manager',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 Safari/17.0',
      severity: 'high',
      category: 'user_management'
    }
  ]);

  if (!isEmployer()) {
    return (
      <div className="p-6 text-center">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès Employeur Requis</h2>
        <p className="text-gray-600">Les logs d'audit sont réservés à l'employeur.</p>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default: return <Eye className="w-4 h-4 text-blue-600" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'security': return <Shield className="w-4 h-4" />;
      case 'user_management': return <User className="w-4 h-4" />;
      case 'system_config': return <Settings className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || log.category === filterType;
    const matchesUser = filterUser === 'all' || log.userId.toString() === filterUser;
    
    return matchesSearch && matchesType && matchesUser;
  });

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'IP Address', 'Severity'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.userName,
        log.action,
        log.resource,
        `"${log.details}"`,
        log.ipAddress,
        log.severity
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const severityCounts = {
    high: auditLogs.filter(l => l.severity === 'high').length,
    medium: auditLogs.filter(l => l.severity === 'medium').length,
    warning: auditLogs.filter(l => l.severity === 'warning').length,
    info: auditLogs.filter(l => l.severity === 'info').length
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Logs d'Audit</h1>
        <p className="text-gray-600">Traçabilité complète des actions système</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="font-semibold text-gray-900">Critique</h3>
          </div>
          <p className="text-2xl font-bold text-red-600">{severityCounts.high}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Avertissement</h3>
          </div>
          <p className="text-2xl font-bold text-orange-600">{severityCounts.warning}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <h3 className="font-semibold text-gray-900">Moyen</h3>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{severityCounts.medium}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Info</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">{severityCounts.info}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans les logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="security">Sécurité</option>
              <option value="user_management">Gestion utilisateurs</option>
              <option value="payroll">Paie</option>
              <option value="employee_management">Gestion employés</option>
              <option value="system_config">Configuration</option>
            </select>
            
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous utilisateurs</option>
              <option value="1">Marie Lefebvre</option>
              <option value="2">Sophie Martin</option>
              <option value="3">Thomas Dubois</option>
              <option value="4">Pierre Moreau</option>
            </select>
          </div>
          
          <button
            onClick={exportLogs}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Timestamp</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Utilisateur</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Action</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Détails</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">IP</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Sévérité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {new Date(log.timestamp).toLocaleString('fr-FR')}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-xs">
                          {log.userName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{log.userName}</p>
                        <p className="text-xs text-gray-500">{log.userRole}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(log.category)}
                      <span className="text-sm font-medium text-gray-900">{log.action}</span>
                    </div>
                    <p className="text-xs text-gray-500">{log.resource}</p>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 max-w-xs">
                    <p className="truncate" title={log.details}>{log.details}</p>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 font-mono">
                    {log.ipAddress}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(log.severity)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                        {log.severity === 'high' ? 'Critique' :
                         log.severity === 'medium' ? 'Moyen' :
                         log.severity === 'warning' ? 'Attention' : 'Info'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun log trouvé avec ces critères</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage;