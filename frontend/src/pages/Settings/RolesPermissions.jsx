import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ArrowLeft, Shield, Check, X, Plus, Edit, Trash2 } from "lucide-react";
import Loader from '../../components/ui/Loader';
import { systemService } from "../../services/system";

const RolesPermissions = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await systemService.settings.getRoles();
      setRoles(response.data || []);
    } catch (error) {
      console.error('Error loading roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await systemService.settings.updateRole(editingRole.id, formData);
      } else {
        await systemService.settings.createRole(formData);
      }
      setShowCreateForm(false);
      setEditingRole(null);
      setFormData({ name: '', description: '', permissions: [] });
      loadRoles();
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) return;
    
    try {
      await systemService.settings.deleteRole(roleId);
      loadRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions || []
    });
    setShowCreateForm(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader size={24} />
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      </DashboardLayout>
    );
  }

  const modules = [
    { key: "employees", label: "Employés" },
    { key: "attendance", label: "Présence" },
    { key: "payroll", label: "Paie" },
    { key: "performance", label: "Performance" },
    { key: "recruitment", label: "Recrutement" },
    { key: "settings", label: "Paramètres" },
  ];

  const actions = [
    { key: "read", label: "Voir" },
    { key: "create", label: "Créer" },
    { key: "update", label: "Modifier" },
    { key: "delete", label: "Supprimer" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/app/settings")}>
            Retour
          </Button>
          <div className="flex items-center justify-between flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">Rôles & Permissions</h1>
            </div>
            <Button onClick={() => setShowCreateForm(true)} icon={Plus}>
              Nouveau Rôle
            </Button>
          </div>
        </div>

        {roles.map((role, roleIndex) => (
          <Card key={roleIndex}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                <p className="text-sm text-gray-600">{role.description}</p>
                <p className="text-xs text-gray-500 mt-1">{role.users_count || 0} utilisateur(s)</p>
              </div>
              {!role.is_system_role && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" icon={Edit} onClick={() => handleEditRole(role)}>
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" icon={Trash2} onClick={() => handleDeleteRole(role.id)}>
                    Supprimer
                  </Button>
                </div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Module
                    </th>
                    {actions.map((action) => (
                      <th key={action.key} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        {action.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {modules.map((module) => (
                    <tr key={module.key}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {module.label}
                      </td>
                      {actions.map((action) => (
                        <td key={action.key} className="px-4 py-3 text-center">
                          {role.permissions[module.key][action.key] ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default RolesPermissions;
