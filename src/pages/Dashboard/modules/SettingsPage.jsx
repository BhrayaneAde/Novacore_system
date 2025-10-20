import React, { useState } from "react";
import { useHRStore } from "../../../store/useHRStore";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { Moon, Sun, Bell, Lock, User, Building } from "lucide-react";

const SettingsPage = () => {
  const { darkMode, toggleDarkMode } = useHRStore();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    leaveRequests: true,
    newEmployees: true,
    payroll: false,
  });

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2 tracking-tight">Paramètres</h1>
          <p className="text-gray-600">Gérez les préférences de votre application</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Apparence */}
          <Card title="Apparence" subtitle="Personnalisez l'interface">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <Moon className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Sun className="w-5 h-5 text-gray-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mode sombre</p>
                    <p className="text-xs text-gray-500">
                      Activer le thème sombre pour l'interface
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card title="Notifications" subtitle="Gérez vos alertes">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Notifications email</p>
                    <p className="text-xs text-gray-500">Recevoir des emails</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange("email")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.email ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.email ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Notifications push</p>
                    <p className="text-xs text-gray-500">Alertes dans le navigateur</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange("push")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.push ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.push ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Profil */}
          <Card title="Profil utilisateur" subtitle="Informations personnelles">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  defaultValue="Marie Dubois"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue="marie.dubois@novacore.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
                <input
                  type="text"
                  defaultValue="RH Manager"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button icon={User} className="w-full">
                Mettre à jour le profil
              </Button>
            </div>
          </Card>

          {/* Sécurité */}
          <Card title="Sécurité" subtitle="Protégez votre compte">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button icon={Lock} variant="danger" className="w-full">
                Changer le mot de passe
              </Button>
            </div>
          </Card>

          {/* Entreprise */}
          <Card title="Informations entreprise" subtitle="Détails de l'organisation">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  defaultValue="NovaCore"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secteur</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Technologie</option>
                  <option>Finance</option>
                  <option>Santé</option>
                  <option>Éducation</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre d'employés
                </label>
                <input
                  type="number"
                  defaultValue="247"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button icon={Building} className="w-full">
                Sauvegarder
              </Button>
            </div>
          </Card>

          {/* Alertes spécifiques */}
          <Card title="Alertes spécifiques" subtitle="Choisissez vos notifications">
            <div className="space-y-4">
              {[
                { key: "leaveRequests", label: "Demandes de congés", checked: notifications.leaveRequests },
                { key: "newEmployees", label: "Nouveaux employés", checked: notifications.newEmployees },
                { key: "payroll", label: "Traitement de la paie", checked: notifications.payroll },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <button
                    onClick={() => handleNotificationChange(item.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      item.checked ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        item.checked ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
