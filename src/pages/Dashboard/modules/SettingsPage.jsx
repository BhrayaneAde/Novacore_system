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
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
        <p className="text-gray-600">Gérez les préférences de votre application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gestion des Départements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Départements</h3>
              <p className="text-sm text-gray-600">Gérer la structure organisationnelle</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Départements actifs</span>
              <span className="text-sm text-gray-500">5 départements</span>
            </div>
            
            <div className="space-y-2">
              {['Développement', 'Design', 'Marketing', 'Ventes', 'Support'].map((dept) => (
                <div key={dept} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">{dept}</span>
                  <div className="flex gap-2">
                    <button className="text-xs text-blue-600 hover:text-blue-700">Modifier</button>
                    <button className="text-xs text-red-600 hover:text-red-700">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              Ajouter un département
            </button>
          </div>
        </div>

        {/* Validation des Nominations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Nominations Managers</h3>
              <p className="text-sm text-gray-600">Valider les propositions de nomination</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Nominations en attente</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">2 en attente</span>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">Lucas Bernard → Manager Design</p>
                    <p className="text-sm text-gray-600">Proposé par: Sophie Martin (HR)</p>
                    <p className="text-xs text-gray-500">Il y a 2 jours</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                    Approuver
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                    Rejeter
                  </button>
                  <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                    Voir détails
                  </button>
                </div>
              </div>
              
              <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">Camille Durand → Manager Marketing</p>
                    <p className="text-sm text-gray-600">Proposé par: Emma Rousseau (Senior Manager)</p>
                    <p className="text-xs text-gray-500">Il y a 1 jour</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                    Approuver
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                    Rejeter
                  </button>
                  <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                    Voir détails
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Audit & Sécurité</h3>
              <p className="text-sm text-gray-600">Historique des actions critiques</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Actions récentes</span>
              <button className="text-sm text-purple-600 hover:text-purple-700">Voir tout l'historique</button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[
                { action: 'Création employé', user: 'Sophie Martin', time: 'Il y a 2h', type: 'create' },
                { action: 'Modification salaire', user: 'Marie Lefebvre', time: 'Il y a 4h', type: 'update' },
                { action: 'Suppression document', user: 'Thomas Dubois', time: 'Il y a 1j', type: 'delete' },
                { action: 'Connexion admin', user: 'Marie Lefebvre', time: 'Il y a 1j', type: 'login' },
                { action: 'Export données', user: 'Sophie Martin', time: 'Il y a 2j', type: 'export' }
              ].map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      log.type === 'create' ? 'bg-green-500' :
                      log.type === 'update' ? 'bg-blue-500' :
                      log.type === 'delete' ? 'bg-red-500' :
                      log.type === 'login' ? 'bg-yellow-500' : 'bg-purple-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.action}</p>
                      <p className="text-xs text-gray-500">par {log.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Backup & Export */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sauvegarde & Export</h3>
              <p className="text-sm text-gray-600">Gérer les données de l'entreprise</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Sauvegarde automatique</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Dernière sauvegarde</span>
                  <span className="text-sm text-green-600">Aujourd'hui 03:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Fréquence</span>
                  <select className="text-sm border border-gray-200 rounded px-2 py-1">
                    <option>Quotidienne</option>
                    <option>Hebdomadaire</option>
                    <option>Mensuelle</option>
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Rétention</span>
                  <span className="text-sm text-gray-600">30 jours</span>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                Créer sauvegarde manuelle
              </button>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Export des données</h4>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-left">
                  📊 Exporter tous les employés (CSV)
                </button>
                <button className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-left">
                  💰 Exporter données paie (Excel)
                </button>
                <button className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-left">
                  📈 Exporter rapports RH (PDF)
                </button>
                <button className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-left">
                  🔒 Export complet (JSON)
                </button>
              </div>
              <div className="text-xs text-gray-500 p-3 bg-yellow-50 rounded-lg">
                ⚠️ Les exports contiennent des données sensibles. Assurez-vous de les stocker en sécurité.
              </div>
            </div>
          </div>
        </div>

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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration SMTP */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Configuration Email</h3>
              <p className="text-sm text-gray-600">Paramètres SMTP pour les notifications automatiques</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Activer les emails automatiques</p>
                <p className="text-xs text-gray-500">Notifications, rappels et confirmations</p>
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nom d'utilisateur</label>
                  <input
                    type="text"
                    value={smtp.user}
                    onChange={(e) => setSmtp({...smtp, user: e.target.value})}
                    placeholder="votre-email@entreprise.com"
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email de test</label>
                  <div className="flex gap-2">
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
                      disabled={testStatus === 'sending'}
                      className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {testStatus === 'sending' ? 'Envoi...' : 'Test'}
                    </button>
                  </div>
                  {testStatus === 'success' && (
                    <p className="text-sm text-green-600 mt-2">✅ Email de test envoyé avec succès</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Politique de Congés */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Politique de Congés</h3>
              <p className="text-sm text-gray-600">Règles et limites des congés</p>
            </div>
          </div>
          
          <div className="space-y-4">
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
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Congés maladie (jours)</label>
              <input
                type="number"
                value={leave.sickDays}
                onChange={(e) => setLeave({...leave, sickDays: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Approbation manager requise</p>
                <p className="text-xs text-gray-500">Les congés doivent être approuvés</p>
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
          </div>
        </div>

        {/* Horaires de Travail */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Horaires de Travail</h3>
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
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  schedule.flexTimeEnabled ? "bg-amber-600" : "bg-gray-200"
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Début heures fixes</label>
                  <input
                    type="time"
                    value={schedule.coreStart}
                    onChange={(e) => setSchedule({...schedule, coreStart: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fin heures fixes</label>
                  <input
                    type="time"
                    value={schedule.coreEnd}
                    onChange={(e) => setSchedule({...schedule, coreEnd: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  schedule.remoteEnabled ? "bg-amber-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    schedule.remoteEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Sécurité & Authentification */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sécurité & Authentification</h3>
              <p className="text-sm text-gray-600">Politiques de sécurité et accès</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Politique des mots de passe</h4>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Longueur minimale</label>
                <input
                  type="number"
                  value={security.minPasswordLength}
                  onChange={(e) => setSecurity({...security, minPasswordLength: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Majuscules requises</p>
                  <p className="text-xs text-gray-500">Au moins une majuscule</p>
                </div>
                <button
                  onClick={() => setSecurity({...security, requireUppercase: !security.requireUppercase})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    security.requireUppercase ? "bg-red-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      security.requireUppercase ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Sessions & Accès</h4>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Timeout session (minutes)</label>
                <input
                  type="number"
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity({...security, sessionTimeout: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Double authentification</p>
                  <p className="text-xs text-gray-500">Sécurité renforcée</p>
                </div>
                <button
                  onClick={() => setSecurity({...security, twoFactorEnabled: !security.twoFactorEnabled})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    security.twoFactorEnabled ? "bg-red-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      security.twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-600">Préférences de notification</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {Object.entries({
              email: 'Notifications par email',
              push: 'Notifications push',
              leaveRequests: 'Demandes de congés',
              newEmployees: 'Nouveaux employés',
              payroll: 'Paie et salaires'
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                </div>
                <button
                  onClick={() => handleNotificationChange(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications[key] ? "bg-yellow-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications[key] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Profil Utilisateur */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Profil Utilisateur</h3>
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
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rôle</label>
              <input
                type="text"
                value={profile.role}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <ThemedButton
          onClick={() => {
            updateTheme();
            alert('Paramètres sauvegardés avec succès !');
          }}
          className="px-6 py-3 font-semibold flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>Sauvegarder les paramètres</span>
        </ThemedButton>
      </div>
    </div>
  );
};

export default SettingsPage;