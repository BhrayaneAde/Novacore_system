import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import PermissionGuard from "../../components/auth/PermissionGuard";
import { UserPlus, Mail, Shield, MoreVertical, Edit, Trash2 } from "lucide-react";
import { users, roles } from "../../data/mockData";

const UserManagement = () => {
  const { currentCompany, hasPermission, inviteUser } = useAuthStore();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "employee"
  });

  const companyUsers = users.filter(user => user.companyId === currentCompany?.id);

  const handleInvite = (e) => {
    e.preventDefault();
    const result = inviteUser(inviteForm);
    
    if (result.success) {
      setShowInviteModal(false);
      setInviteForm({ email: "", firstName: "", lastName: "", role: "employee" });
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
            <p className="text-gray-600">{companyUsers.length} utilisateurs dans {currentCompany?.name}</p>
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

        {/* Liste des utilisateurs */}
        <Card title="Utilisateurs">
          <div className="space-y-4">
            {companyUsers.map((user) => (
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
                    {Object.entries(roles).map(([key, role]) => (
                      <option key={key} value={key}>{role.name}</option>
                    ))}
                  </select>
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
                  <Button type="submit" icon={Mail} className="flex-1">
                    Envoyer l'invitation
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