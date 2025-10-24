import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import PermissionGuard from "../../components/auth/PermissionGuard";
import { UserPlus, Mail, Shield, MoreVertical, Edit, Trash2, Send, CheckCircle } from "lucide-react";
import { usersService, emailService, USER_ROLES } from "../../services";

const UserManagement = () => {
  const { currentCompany, hasPermission } = useAuthStore();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "employee",
    departmentId: null,
    jobTitle: "",
    salary: null,
    managerId: null
  });
  
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    loadUsers();
    loadPendingInvitations();
    loadDepartments();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await usersService.getAll();
      setUsers(response.data);
      
      // Charger les managers (users avec rôle manager ou hr_admin)
      const managerUsers = response.data.filter(u => 
        ['manager', 'hr_admin', 'employer'].includes(u.role)
      );
      setManagers(managerUsers);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    }
  };
  
  const loadDepartments = async () => {
    try {
      const response = await usersService.companies.getDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error('Erreur chargement départements:', error);
    }
  };

  const loadPendingInvitations = async () => {
    try {
      const response = await usersService.getPendingInvitations();
      setPendingInvitations(response.data);
    } catch (error) {
      console.error('Erreur chargement invitations:', error);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await usersService.inviteUser({
        email: inviteForm.email,
        first_name: inviteForm.firstName,
        last_name: inviteForm.lastName,
        role: inviteForm.role,
        department_id: inviteForm.departmentId,
        job_title: inviteForm.jobTitle,
        salary: inviteForm.salary,
        manager_id: inviteForm.managerId
      });
      
      await loadPendingInvitations();
      setShowInviteModal(false);
      setInviteForm({ 
        email: "", firstName: "", lastName: "", role: "employee",
        departmentId: null, jobTitle: "", salary: null, managerId: null 
      });
    } catch (error) {
      console.error('Erreur invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  const resendInvitation = async (invitationId) => {
    try {
      await usersService.resendInvitation(invitationId);
    } catch (error) {
      console.error('Erreur renvoi invitation:', error);
    }
  };

  const cancelInvitation = async (invitationId) => {
    try {
      await usersService.cancelInvitation(invitationId);
      await loadPendingInvitations();
    } catch (error) {
      console.error('Erreur annulation invitation:', error);
    }
  };

  const getRoleBadgeVariant = (role) => {
    const roleColors = {
      employer: "purple",
      hr_admin: "blue", 
      hr_user: "green",
      manager: "orange",
      employee: "gray"
    };
    return roleColors[role] || "gray";
  };

  const formatLastLogin = (dateString) => {
    if (!dateString) return "Jamais connecté";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR") + " à " + date.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Gestion des utilisateurs</h1>
            <p className="text-gray-600">{users.length} utilisateurs dans {currentCompany?.name}</p>
          </div>
          
          <PermissionGuard permission="users.manage">
            <Button icon={UserPlus} onClick={() => setShowInviteModal(true)}>
              Inviter un utilisateur
            </Button>
          </PermissionGuard>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(roles).map(([roleKey, roleData]) => {
            const count = companyUsers.filter(u => u.role === roleKey).length;
            return (
              <Card key={roleKey} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{roleData.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                  <div className={`w-12 h-12 bg-${roleData.color}-50 rounded-lg flex items-center justify-center`}>
                    <Shield className={`w-6 h-6 text-${roleData.color}-600`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Invitations en attente */}
        {pendingInvitations.length > 0 && (
          <Card title="Invitations en attente">
            <div className="space-y-4">
              {pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-4 border border-orange-200 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Mail className="w-8 h-8 text-orange-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {invitation.firstName} {invitation.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{invitation.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      invitation.email_status === 'sent' ? 'info' :
                      invitation.email_status === 'opened' ? 'warning' :
                      invitation.email_status === 'accepted' ? 'success' :
                      invitation.email_status === 'failed' ? 'error' : 'gray'
                    }>
                      {invitation.email_status === 'sent' && 'Email envoyé'}
                      {invitation.email_status === 'opened' && 'Email ouvert'}
                      {invitation.email_status === 'accepted' && 'Employé actif'}
                      {invitation.email_status === 'failed' && 'Échec envoi'}
                      {invitation.email_status === 'pending' && 'En attente'}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      icon={Send}
                      onClick={() => resendInvitation(invitation.id)}
                    >
                      Renvoyer
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      icon={Trash2}
                      className="text-red-600"
                      onClick={() => cancelInvitation(invitation.id)}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Liste des utilisateurs */}
        <Card title="Utilisateurs">
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      Dernière connexion: {formatLastLogin(user.lastLogin)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {roles[user.role]?.name}
                  </Badge>
                  
                  <Badge variant={user.isActive ? "success" : "warning"}>
                    {user.isActive ? "Actif" : "Inactif"}
                  </Badge>
                  
                  <PermissionGuard permission="users.manage">
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" icon={Edit}>
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm" icon={Trash2} className="text-red-600">
                        Supprimer
                      </Button>
                    </div>
                  </PermissionGuard>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Modal d'invitation */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Inviter un utilisateur</h3>
              </div>
              
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="utilisateur@exemple.com"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteForm.firstName}
                      onChange={(e) => setInviteForm({...inviteForm, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteForm.lastName}
                      onChange={(e) => setInviteForm({...inviteForm, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rôle *
                  </label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="employee">Employé</option>
                    <option value="manager">Manager</option>
                    <option value="hr_admin">RH Admin</option>
                  </select>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Email automatique</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    L'utilisateur recevra un email avec un lien pour créer son mot de passe et accéder à NovaCore.
                  </p>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button type="submit" icon={Mail} className="flex-1" disabled={loading}>
                    {loading ? 'Envoi...' : 'Envoyer l\'invitation'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;