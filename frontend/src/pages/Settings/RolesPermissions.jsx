import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ArrowLeft, Shield, Check, X } from "lucide-react";

const RolesPermissions = () => {
  const navigate = useNavigate();

  const roles = [
    {
      name: "Admin",
      description: "Accès complet à toutes les fonctionnalités",
      permissions: {
        employees: { read: true, create: true, update: true, delete: true },
        attendance: { read: true, create: true, update: true, delete: true },
        payroll: { read: true, create: true, update: true, delete: true },
        performance: { read: true, create: true, update: true, delete: true },
        recruitment: { read: true, create: true, update: true, delete: true },
        settings: { read: true, create: true, update: true, delete: true },
      },
    },
    {
      name: "Manager",
      description: "Gestion d'équipe et validation",
      permissions: {
        employees: { read: true, create: false, update: true, delete: false },
        attendance: { read: true, create: true, update: true, delete: false },
        payroll: { read: true, create: false, update: false, delete: false },
        performance: { read: true, create: true, update: true, delete: false },
        recruitment: { read: true, create: true, update: true, delete: false },
        settings: { read: false, create: false, update: false, delete: false },
      },
    },
    {
      name: "Employé",
      description: "Accès limité aux fonctionnalités de base",
      permissions: {
        employees: { read: true, create: false, update: false, delete: false },
        attendance: { read: true, create: true, update: false, delete: false },
        payroll: { read: true, create: false, update: false, delete: false },
        performance: { read: true, create: false, update: false, delete: false },
        recruitment: { read: false, create: false, update: false, delete: false },
        settings: { read: false, create: false, update: false, delete: false },
      },
    },
  ];

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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Rôles & Permissions</h1>
          </div>
        </div>

        {roles.map((role, roleIndex) => (
          <Card key={roleIndex} title={role.name} subtitle={role.description}>
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
