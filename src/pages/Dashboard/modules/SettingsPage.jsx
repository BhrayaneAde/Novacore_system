import React, { useState } from "react";
import { Moon, Sun, Bell, Lock, User, Building, Save, Shield, Mail, Server, Send, Calendar, Clock, ShieldCheck, Palette, Upload } from "lucide-react";
import { smtpConfig, leavePolicy, workSchedule, securityConfig, appearanceConfig, colorPalettes } from "../../../data/mockData";
import { useThemeStore } from "../../../store/useThemeStore";
import ThemedButton from "../../../components/ThemedButton";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    leaveRequests: true,
    newEmployees: true,
    payroll: false,
  });
  
  const [profile, setProfile] = useState({
    name: 'Marie Dubois',
    email: 'marie.dubois@techcorp.com',
    role: 'RH Manager'
  });
  
  const [company, setCompany] = useState({
    name: 'TechCorp',
    sector: 'Technologie',
    employees: 247
  });
  
  const [smtp, setSmtp] = useState({
    enabled: smtpConfig.enabled,
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    user: smtpConfig.auth.user,
    pass: smtpConfig.auth.pass,
    fromName: smtpConfig.from.name,
    fromEmail: smtpConfig.from.email,
    testEmail: smtpConfig.testEmail
  });
  
  const [testStatus, setTestStatus] = useState(null);
  
  const [leave, setLeave] = useState({
    annualDays: leavePolicy.annualLeave.daysPerYear,
    carryOverDays: leavePolicy.annualLeave.carryOverDays,
    sickDays: leavePolicy.sickLeave.daysPerYear,
    requiresManagerApproval: leavePolicy.approvalWorkflow.requiresManagerApproval,
    advanceNotice: leavePolicy.approvalWorkflow.advanceNotice
  });
  
  const [schedule, setSchedule] = useState({
    hoursPerWeek: workSchedule.standardHours.hoursPerWeek,
    flexTimeEnabled: workSchedule.flexTime.enabled,
    coreStart: workSchedule.flexTime.coreHours.start,
    coreEnd: workSchedule.flexTime.coreHours.end,
    remoteEnabled: workSchedule.remoteWork.enabled,
    maxRemoteDays: workSchedule.remoteWork.maxDaysPerWeek
  });
  
  const [security, setSecurity] = useState({
    minPasswordLength: securityConfig.passwordPolicy.minLength,
    requireUppercase: securityConfig.passwordPolicy.requireUppercase,
    twoFactorEnabled: securityConfig.twoFactorAuth.enabled,
    sessionTimeout: securityConfig.sessionManagement.timeoutMinutes,
    auditLogEnabled: securityConfig.auditLog.enabled
  });
  
  const { 
    darkMode, primaryColor, secondaryColor, companyName, logoUrl, fontFamily,
    setDarkMode, setPrimaryColor, setSecondaryColor, setCompanyName, setLogoUrl, setFontFamily, updateTheme
  } = useThemeStore();


  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
        <p className="text-gray-600">Gérez les préférences de votre application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Apparence & Branding */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Apparence & Branding</h3>
              <p className="text-sm text-gray-600">Personnalisez l'interface avec votre identité</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-gray-600" />}
                <div>
                  <p className="text-sm font-medium text-gray-900">Mode sombre</p>
                  <p className="text-xs text-gray-500">Activer le thème sombre pour l'interface</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? "bg-pink-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Logo de l'entreprise</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {logoUrl ? (
                    <div className="space-y-3">
                      <img src={logoUrl} alt="Logo" className="h-12 mx-auto" />
                      <button className="text-sm text-red-600 hover:text-red-700">Supprimer</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                      <div>
                        <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">Télécharger un logo</button>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 2MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de l'entreprise</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Palette de couleurs</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {colorPalettes.map((palette) => (
                  <button
                    key={palette.name}
                    onClick={() => {
                      setPrimaryColor(palette.primary);
                      setSecondaryColor(palette.secondary);
                    }}
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      primaryColor === palette.primary
                        ? "border-pink-500 ring-2 ring-pink-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: palette.primary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: palette.secondary }}
                      />
                    </div>
                    <p className="text-xs font-medium text-gray-700">{palette.name}</p>
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Couleur personnalisée</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-12 border border-gray-200 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Police</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Poppins">Poppins</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Aperçu</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button 
                    style={{ backgroundColor: primaryColor }}
                    className="px-4 py-2 text-white rounded-lg text-sm font-medium"
                  >
                    Bouton principal
                  </button>
                  <button 
                    style={{ backgroundColor: secondaryColor }}
                    className="px-4 py-2 text-white rounded-lg text-sm font-medium"
                  >
                    Bouton secondaire
                  </button>
                </div>
                <div className="text-sm text-gray-600" style={{ fontFamily: fontFamily }}>
                  Texte avec la police {fontFamily}
                </div>
              </div>
            </div>
            
            <ThemedButton className="w-full px-4 py-3 rounded-lg flex items-center justify-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Appliquer l'apparence</span>
            </ThemedButton>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-600">Gérez vos alertes</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600" />
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

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
        </div>

        {/* Profil */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Profil utilisateur</h3>
              <p className="text-sm text-gray-600">Informations personnelles</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Poste</label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => setProfile({...profile, role: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <ThemedButton className="w-full px-4 py-3 rounded-lg flex items-center justify-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Mettre à jour le profil</span>
            </ThemedButton>
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>
              <p className="text-sm text-gray-600">Protégez votre compte</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe actuel</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nouveau mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmer le mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors">
              <Lock className="w-4 h-4" />
              <span>Changer le mot de passe</span>
            </button>
          </div>
        </div>

        {/* Entreprise */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Informations entreprise</h3>
              <p className="text-sm text-gray-600">Détails de l'organisation</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de l'entreprise</label>
              <input
                type="text"
                value={company.name}
                onChange={(e) => setCompany({...company, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Secteur</label>
              <select 
                value={company.sector}
                onChange={(e) => setCompany({...company, sector: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option>Technologie</option>
                <option>Finance</option>
                <option>Santé</option>
                <option>Éducation</option>
                <option>Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre d'employés</label>
              <input
                type="number"
                value={company.employees}
                onChange={(e) => setCompany({...company, employees: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors">
              <Save className="w-4 h-4" />
              <span>Sauvegarder</span>
            </button>
          </div>
        </div>

        {/* Politique de congés */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Politique de congés</h3>
              <p className="text-sm text-gray-600">Gestion des congés et absences</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Congés annuels (jours)</label>
                <input
                  type="number"
                  value={leave.annualDays}
                  onChange={(e) => setLeave({...leave, annualDays: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Report maximum (jours)</label>
                <input
                  type="number"
                  value={leave.carryOverDays}
                  onChange={(e) => setLeave({...leave, carryOverDays: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Congés maladie (jours)</label>
                <input
                  type="number"
                  value={leave.sickDays}
                  onChange={(e) => setLeave({...leave, sickDays: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Préavis minimum (jours)</label>
                <input
                  type="number"
                  value={leave.advanceNotice}
                  onChange={(e) => setLeave({...leave, advanceNotice: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Approbation manager requise</p>
                <p className="text-xs text-gray-500">Les demandes doivent être approuvées</p>
              </div>
              <button
                onClick={() => setLeave({...leave, requiresManagerApproval: !leave.requiresManagerApproval})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  leave.requiresManagerApproval ? "bg-teal-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    leave.requiresManagerApproval ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            
            <button className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors">
              <Save className="w-4 h-4" />
              <span>Sauvegarder la politique</span>
            </button>
          </div>
        </div>

        {/* Horaires de travail */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Horaires de travail</h3>
              <p className="text-sm text-gray-600">Configuration des temps de travail</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Heures par semaine</label>
              <input
                type="number"
                value={schedule.hoursPerWeek}
                onChange={(e) => setSchedule({...schedule, hoursPerWeek: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Horaires flexibles</p>
                <p className="text-xs text-gray-500">Permettre la flexibilité des horaires</p>
              </div>
              <button
                onClick={() => setSchedule({...schedule, flexTimeEnabled: !schedule.flexTimeEnabled})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  schedule.flexTimeEnabled ? "bg-cyan-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    schedule.flexTimeEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            
            {schedule.flexTimeEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Début heures fixes</label>
                  <input
                    type="time"
                    value={schedule.coreStart}
                    onChange={(e) => setSchedule({...schedule, coreStart: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fin heures fixes</label>
                  <input
                    type="time"
                    value={schedule.coreEnd}
                    onChange={(e) => setSchedule({...schedule, coreEnd: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Télétravail autorisé</p>
                <p className="text-xs text-gray-500">Permettre le travail à distance</p>
              </div>
              <button
                onClick={() => setSchedule({...schedule, remoteEnabled: !schedule.remoteEnabled})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  schedule.remoteEnabled ? "bg-cyan-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    schedule.remoteEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            
            {schedule.remoteEnabled && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Jours télétravail max/semaine</label>
                <input
                  type="number"
                  value={schedule.maxRemoteDays}
                  onChange={(e) => setSchedule({...schedule, maxRemoteDays: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            )}
            
            <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors">
              <Save className="w-4 h-4" />
              <span>Sauvegarder les horaires</span>
            </button>
          </div>
        </div>

        {/* Sécurité & Authentification */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sécurité & Authentification</h3>
              <p className="text-sm text-gray-600">Politiques de sécurité avancées</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Longueur mot de passe min</label>
                <input
                  type="number"
                  value={security.minPasswordLength}
                  onChange={(e) => setSecurity({...security, minPasswordLength: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Timeout session (min)</label>
                <input
                  type="number"
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity({...security, sessionTimeout: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Majuscules obligatoires</p>
                <p className="text-xs text-gray-500">Exiger des majuscules dans les mots de passe</p>
              </div>
              <button
                onClick={() => setSecurity({...security, requireUppercase: !security.requireUppercase})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  security.requireUppercase ? "bg-purple-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    security.requireUppercase ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Authentification à 2 facteurs</p>
                <p className="text-xs text-gray-500">Sécurité renforcée pour les connexions</p>
              </div>
              <button
                onClick={() => setSecurity({...security, twoFactorEnabled: !security.twoFactorEnabled})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  security.twoFactorEnabled ? "bg-purple-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    security.twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Journal d'audit</p>
                <p className="text-xs text-gray-500">Enregistrer toutes les actions utilisateurs</p>
              </div>
              <button
                onClick={() => setSecurity({...security, auditLogEnabled: !security.auditLogEnabled})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  security.auditLogEnabled ? "bg-purple-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    security.auditLogEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors">
              <Save className="w-4 h-4" />
              <span>Sauvegarder la sécurité</span>
            </button>
          </div>
        </div>

        {/* Configuration SMTP */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Configuration SMTP</h3>
              <p className="text-sm text-gray-600">Paramètres d'envoi d'emails automatiques</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Activation SMTP */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Activer l'envoi d'emails</p>
                <p className="text-xs text-gray-500">Notifications automatiques par email</p>
              </div>
              <button
                onClick={() => setSmtp({...smtp, enabled: !smtp.enabled})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  smtp.enabled ? "bg-indigo-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    smtp.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            
            {smtp.enabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Serveur SMTP</label>
                    <input
                      type="text"
                      value={smtp.host}
                      onChange={(e) => setSmtp({...smtp, host: e.target.value})}
                      placeholder="smtp.gmail.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Port</label>
                    <input
                      type="number"
                      value={smtp.port}
                      onChange={(e) => setSmtp({...smtp, port: parseInt(e.target.value)})}
                      placeholder="587"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={smtp.secure}
                      onChange={(e) => setSmtp({...smtp, secure: e.target.checked})}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Connexion sécurisée (SSL/TLS)</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nom d'utilisateur</label>
                    <input
                      type="text"
                      value={smtp.user}
                      onChange={(e) => setSmtp({...smtp, user: e.target.value})}
                      placeholder="votre-email@gmail.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
                    <input
                      type="password"
                      value={smtp.pass}
                      onChange={(e) => setSmtp({...smtp, pass: e.target.value})}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nom expéditeur</label>
                    <input
                      type="text"
                      value={smtp.fromName}
                      onChange={(e) => setSmtp({...smtp, fromName: e.target.value})}
                      placeholder="NovaCore RH"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email expéditeur</label>
                    <input
                      type="email"
                      value={smtp.fromEmail}
                      onChange={(e) => setSmtp({...smtp, fromEmail: e.target.value})}
                      placeholder="noreply@votre-entreprise.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email de test</label>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={smtp.testEmail}
                      onChange={(e) => setSmtp({...smtp, testEmail: e.target.value})}
                      placeholder="test@exemple.com"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => {
                        setTestStatus('sending');
                        setTimeout(() => setTestStatus('success'), 2000);
                      }}
                      disabled={!smtp.testEmail || testStatus === 'sending'}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {testStatus === 'sending' ? 'Envoi...' : 'Tester'}
                    </button>
                  </div>
                  {testStatus === 'success' && (
                    <p className="text-sm text-green-600 mt-2">✓ Email de test envoyé avec succès</p>
                  )}
                  {testStatus === 'error' && (
                    <p className="text-sm text-red-600 mt-2">✗ Erreur lors de l'envoi</p>
                  )}
                </div>
                
                <ThemedButton className="w-full px-4 py-3 rounded-lg flex items-center justify-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder la configuration SMTP</span>
                </ThemedButton>
              </>
            )}
          </div>
        </div>
        
        {/* Alertes spécifiques */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Alertes spécifiques</h3>
              <p className="text-sm text-gray-600">Choisissez vos notifications</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { key: "leaveRequests", label: "Demandes de congés", checked: notifications.leaveRequests },
              { key: "newEmployees", label: "Nouveaux employés", checked: notifications.newEmployees },
              { key: "payroll", label: "Traitement de la paie", checked: notifications.payroll },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
