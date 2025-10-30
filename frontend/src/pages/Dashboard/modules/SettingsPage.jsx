import React, { useState, useEffect } from "react";
import { Bell, User, Building, Save, Shield, Mail, Send, Upload, Edit, Trash2 } from "lucide-react";
import Loader from '../../../components/ui/Loader';
import { systemService } from "../../../services";
import Button from "../../../components/ui/Button";
import Toast from "../../../components/ui/Toast";
import { useToast } from "../../../components/ui/useToast";

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [departments, setDepartments] = useState([]);
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
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
    enabled: false,
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    user: '',
    pass: '',
    fromName: 'NovaCore RH',
    fromEmail: '',
    testEmail: ''
  });
  
  const [testStatus, setTestStatus] = useState(null);
  


  // Palettes de couleurs prédéfinies
  const colorPalettes = [
    { name: "Bleu", primary: "#3B82F6", secondary: "#1E40AF", accent: "#06B6D4" },
    { name: "Violet", primary: "#8B5CF6", secondary: "#7C3AED", accent: "#A855F7" },
    { name: "Vert", primary: "#10B981", secondary: "#059669", accent: "#34D399" },
    { name: "Rouge", primary: "#EF4444", secondary: "#DC2626", accent: "#F87171" },
    { name: "Orange", primary: "#F59E0B", secondary: "#D97706", accent: "#FBBF24" },
    { name: "Rose", primary: "#EC4899", secondary: "#DB2777", accent: "#F472B6" },
    { name: "Indigo", primary: "#6366F1", secondary: "#4F46E5", accent: "#818CF8" },
    { name: "Teal", primary: "#14B8A6", secondary: "#0D9488", accent: "#5EEAD4" }
  ];

  useEffect(() => {
    loadSettings();
    loadDepartments();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // Charger la configuration SMTP
      try {
        const smtpResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/email/smtp-config`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        
        if (smtpResponse.ok) {
          const smtpData = await smtpResponse.json();
          setSmtp({
            enabled: smtpData.enabled || false,
            host: smtpData.host || 'smtp.gmail.com',
            port: smtpData.port || 587,
            secure: smtpData.secure || true,
            user: smtpData.user || '',
            pass: smtpData.password === '***' ? '' : smtpData.password || '',
            fromName: smtpData.fromName || 'NovaCore RH',
            fromEmail: smtpData.fromEmail || '',
            testEmail: smtpData.testEmail || ''
          });
        }
      } catch (error) {
        console.error('Erreur chargement SMTP:', error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/departments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      } else {
        showError('Erreur lors du chargement des départements');
      }
    } catch (error) {
      console.error('Erreur chargement départements:', error);
      showError('Erreur lors du chargement des départements');
    }
  };
  
  // Simulation du theme store
  const [darkMode, setDarkMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState('#1E40AF');
  const [companyName, setCompanyName] = useState('NovaCore');
  const [logoUrl, setLogoUrl] = useState(localStorage.getItem('companyLogo') || '');
  const [fontFamily, setFontFamily] = useState('Inter');
  const updateTheme = () => {};

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleAddDepartment = async () => {
    if (newDeptName.trim()) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/departments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({ name: newDeptName.trim() })
        });
        
        if (response.ok) {
          const newDept = await response.json();
          setDepartments([...departments, newDept]);
          setNewDeptName('');
          setShowDeptForm(false);
          showSuccess('Département ajouté avec succès !');
        } else {
          showError('Erreur lors de l\'ajout du département');
        }
      } catch (error) {
        console.error('Erreur ajout département:', error);
        showError('Erreur lors de l\'ajout du département');
      }
    }
  };

  const handleEditDepartment = async (dept) => {
    const newName = prompt('Nouveau nom du département:', dept.name);
    if (newName && newName.trim()) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/departments/${dept.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({ name: newName.trim() })
        });
        
        if (response.ok) {
          setDepartments(departments.map(d => 
            d.id === dept.id ? { ...d, name: newName.trim() } : d
          ));
          showSuccess('Département modifié avec succès !');
        } else {
          showError('Erreur lors de la modification du département');
        }
      } catch (error) {
        console.error('Erreur modification département:', error);
        showError('Erreur lors de la modification du département');
      }
    }
  };

  const handleDeleteDepartment = async (deptId) => {
    if (confirm('Voulez-vous vraiment supprimer ce département ?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/departments/${deptId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        
        if (response.ok) {
          setDepartments(departments.filter(d => d.id !== deptId));
          showSuccess('Département supprimé avec succès !');
        } else {
          showError('Erreur lors de la suppression du département');
        }
      } catch (error) {
        console.error('Erreur suppression département:', error);
        showError('Erreur lors de la suppression du département');
      }
    }
  };

  const saveSmtpSettings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/email/smtp-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          enabled: smtp.enabled,
          host: smtp.host,
          port: smtp.port,
          secure: smtp.secure,
          user: smtp.user,
          password: smtp.pass,
          fromName: smtp.fromName,
          fromEmail: smtp.fromEmail,
          testEmail: smtp.testEmail
        })
      });
      
      if (response.ok) {
        showSuccess('Configuration email sauvegardée avec succès !');
        if (smtp.enabled && smtp.host && smtp.user && smtp.pass) {
          localStorage.setItem('smtpConfigured', 'true');
        }
      } else {
        showError('Erreur lors de la sauvegarde de la configuration email');
      }
    } catch (error) {
      console.error('Erreur sauvegarde SMTP:', error);
      showError('Erreur lors de la sauvegarde de la configuration email');
    }
  };

  const saveSettings = async () => {
    try {
      updateTheme();
      showSuccess('Paramètres sauvegardés avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showError('Erreur lors de la sauvegarde des paramètres');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader size={24} />
        <span className="ml-2 text-gray-600">Chargement des paramètres...</span>
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Paramètres</h1>
        <p className="text-sm text-gray-600">Gérez les préférences de votre application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Gestion des Départements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
              <Building className="w-4 h-4 text-secondary-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Départements</h3>
              <p className="text-xs text-gray-600">Structure organisationnelle</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-700">Actifs: {departments.length}</span>
            </div>
            
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {departments.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                  <div>
                    <span className="font-medium text-gray-900">{dept.name}</span>
                    <span className="text-gray-500 ml-1">({dept.employee_count || 0})</span>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEditDepartment(dept)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleDeleteDepartment(dept.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {showDeptForm ? (
              <div className="space-y-2 p-3 bg-blue-50 rounded">
                <input
                  type="text"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="Nom du département"
                  className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-secondary-500"
                />
                <div className="flex gap-1">
                  <button 
                    onClick={handleAddDepartment}
                    className="px-2 py-1 text-white rounded text-xs"
                    style={{
                      backgroundColor: '#055169',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#023342'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#055169'}
                    title="Confirmer"
                  >
                    ✓
                  </button>
                  <button 
                    onClick={() => {
                      setShowDeptForm(false);
                      setNewDeptName('');
                    }}
                    className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-xs"
                    title="Annuler"
                  >
                    ✗
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowDeptForm(true)}
                className="w-full px-3 py-2 text-white rounded text-xs font-medium"
                style={{
                  backgroundColor: '#055169',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#023342'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#055169'}
              >
                + Département
              </button>
            )}
          </div>
        </div>

        {/* Validation des Nominations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Nominations</h3>
              <p className="text-xs text-gray-600">Valider les propositions</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-700">En attente</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">2</span>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              <div className="p-3 border border-orange-200 rounded bg-orange-50">
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-900">Lucas Bernard → Manager Design</p>
                  <p className="text-xs text-gray-600">Sophie Martin • 2j</p>
                </div>
                <div className="flex gap-1">
                  <button className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                    ✓
                  </button>
                  <button className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                    ✗
                  </button>
                  <button className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                    👁️
                  </button>
                </div>
              </div>
              
              <div className="p-3 border border-orange-200 rounded bg-orange-50">
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-900">Camille Durand → Manager Marketing</p>
                  <p className="text-xs text-gray-600">Emma Rousseau • 1j</p>
                </div>
                <div className="flex gap-1">
                  <button className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                    ✓
                  </button>
                  <button className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                    ✗
                  </button>
                  <button className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                    👁️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Audit</h3>
              <p className="text-xs text-gray-600">Actions critiques</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-700">Récentes</span>
              <button className="text-xs text-purple-600 hover:text-purple-700">Tout voir</button>
            </div>
            
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {[
                { action: 'Création employé', user: 'Sophie M.', time: '2h', type: 'create' },
                { action: 'Modif. salaire', user: 'Marie L.', time: '4h', type: 'update' },
                { action: 'Suppr. document', user: 'Thomas D.', time: '1j', type: 'delete' },
                { action: 'Connexion admin', user: 'Marie L.', time: '1j', type: 'login' },
                { action: 'Export données', user: 'Sophie M.', time: '2j', type: 'export' }
              ].map((log, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      log.type === 'create' ? 'bg-green-500' :
                      log.type === 'update' ? 'bg-secondary-500' :
                      log.type === 'delete' ? 'bg-red-500' :
                      log.type === 'login' ? 'bg-primary-500' : 'bg-purple-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{log.action}</p>
                      <p className="text-gray-500">{log.user}</p>
                    </div>
                  </div>
                  <span className="text-gray-500">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>



        {/* Logo Entreprise */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Logo</h3>
              <p className="text-xs text-gray-600">Logo de l'entreprise</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Logo entreprise</label>
              <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                {logoUrl ? (
                  <div className="space-y-2">
                    <img src={logoUrl} alt="Logo" className="h-12 mx-auto" />
                    <button 
                      onClick={() => {
                        setLogoUrl('');
                        localStorage.removeItem('companyLogo');
                      }}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const logoData = e.target.result;
                            setLogoUrl(logoData);
                            localStorage.setItem('companyLogo', logoData);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label 
                      htmlFor="logo-upload"
                      className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
                    >
                      Télécharger un logo
                    </label>
                    <p className="text-xs text-gray-500">PNG, JPG jusqu'à 2MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Configuration SMTP */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 lg:col-span-3">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Email SMTP</h3>
              <p className="text-xs text-gray-600">Notifications automatiques</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="text-xs font-medium text-gray-900">Emails automatiques</p>
              </div>
              <button
                onClick={() => setSmtp({...smtp, enabled: !smtp.enabled})}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  smtp.enabled ? "bg-indigo-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    smtp.enabled ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            
            {smtp.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Serveur</label>
                  <input
                    type="text"
                    value={smtp.host}
                    readOnly
                    className="w-full px-2 py-2 border border-gray-200 rounded bg-gray-100 text-gray-600 cursor-not-allowed text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Port</label>
                  <input
                    type="number"
                    value={smtp.port}
                    readOnly
                    className="w-full px-2 py-2 border border-gray-200 rounded bg-gray-100 text-gray-600 cursor-not-allowed text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="text"
                    value={smtp.user}
                    onChange={(e) => setSmtp({...smtp, user: e.target.value})}
                    placeholder="email@gmail.com"
                    className="w-full px-2 py-2 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Mot de passe app</label>
                  <input
                    type="password"
                    value={smtp.pass}
                    onChange={(e) => setSmtp({...smtp, pass: e.target.value})}
                    placeholder="abcd efgh ijkl mnop"
                    className="w-full px-2 py-2 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ <a href="https://myaccount.google.com/apppasswords" target="_blank" className="text-indigo-600 hover:underline">Créer mot de passe app</a>
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Test email</label>
                  <div className="flex gap-1">
                    <input
                      type="email"
                      value={smtp.testEmail}
                      onChange={(e) => setSmtp({...smtp, testEmail: e.target.value})}
                      placeholder="test@exemple.com"
                      className="flex-1 px-2 py-2 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      onClick={async () => {
                        if (!smtp.user || !smtp.pass || !smtp.testEmail) {
                          showError('Remplir tous les champs');
                          return;
                        }
                        
                        setTestStatus('sending');
                        try {
                          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/email/test-email`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              host: smtp.host,
                              port: smtp.port,
                              user: smtp.user,
                              pass: smtp.pass,
                              testEmail: smtp.testEmail
                            })
                          });
                          
                          if (response.ok) {
                            setTestStatus('success');
                          } else {
                            setTestStatus('error');
                          }
                        } catch (error) {
                          setTestStatus('error');
                        }
                      }}
                      disabled={testStatus === 'sending'}
                      className="px-2 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 text-xs"
                    >
                      {testStatus === 'sending' ? '...' : '📧'}
                    </button>
                  </div>
                  {testStatus === 'success' && (
                    <p className="text-xs text-green-600 mt-1">✅ Test réussi</p>
                  )}
                  {testStatus === 'error' && (
                    <p className="text-xs text-red-600 mt-1">❌ Erreur test</p>
                  )}
                </div>
              </div>
            )}
            
            {smtp.enabled && (
              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={saveSmtpSettings}
                  className="w-full px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs flex items-center justify-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  Sauvegarder SMTP
                </button>
              </div>
            )}
          </div>
        </div>







        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-600">Préférences</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {Object.entries({
              email: 'Email',
              push: 'Push',
              leaveRequests: 'Congés',
              newEmployees: 'Nouveaux',
              payroll: 'Paie'
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <p className="text-xs font-medium text-gray-900">{label}</p>
                <button
                  onClick={() => handleNotificationChange(key)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    notifications[key] ? "bg-yellow-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      notifications[key] ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Profil Utilisateur */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Profil</h3>
              <p className="text-xs text-gray-600">Infos personnelles</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-2 py-2 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="w-full px-2 py-2 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Rôle</label>
              <input
                type="text"
                value={profile.role}
                readOnly
                className="w-full px-2 py-2 border border-gray-200 rounded bg-gray-50 text-gray-500 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={saveSettings}
          className="px-4 py-2 text-sm font-semibold flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Sauvegarder</span>
        </Button>
      </div>

      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default SettingsPage;