import React, { useState } from 'react';
import { Edit, Save, X, User, Mail, Phone, MapPin, Calendar, Briefcase, Building, Clock, Award, Camera, Shield, Bell, Key } from 'lucide-react';

const EmployeeProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // personal, professional, security, preferences
  const [profile, setProfile] = useState({
    // Informations personnelles
    name: 'Marie Dubois',
    email: 'marie.dubois@novacore.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la Paix, 75001 Paris',
    birthDate: '1990-05-15',
    emergencyContact: 'Pierre Dubois - +33 6 87 65 43 21',
    // Informations professionnelles
    position: 'Assistante Administrative',
    department: 'Administration',
    manager: 'Jean Martin',
    startDate: '2022-03-01',
    contract: 'CDI',
    salary: '35000',
    workLocation: 'Paris - Siège social',
    workSchedule: '9h00 - 17h30',
    // Compétences et certifications
    skills: ['Excel Avancé', 'Gestion administrative', 'Communication', 'Organisation'],
    certifications: ['Certification Excel', 'Formation sécurité'],
    languages: [{ name: 'Français', level: 'Natif' }, { name: 'Anglais', level: 'Intermédiaire' }],
    // Préférences
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    theme: 'light',
    language: 'fr'
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'personal', label: 'Informations personnelles', icon: User },
    { id: 'professional', label: 'Informations professionnelles', icon: Briefcase },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'preferences', label: 'Préférences', icon: Bell }
  ];

  const renderPersonalInfo = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Informations de contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email professionnel
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editedProfile.email}
                onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{profile.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Téléphone
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editedProfile.phone}
                onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{profile.phone}</p>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Adresse
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.address}
                onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{profile.address}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Date de naissance
            </label>
            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{new Date(profile.birthDate).toLocaleDateString('fr-FR')}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Contact d'urgence
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.emergencyContact}
                onChange={(e) => setEditedProfile({...editedProfile, emergencyContact: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{profile.emergencyContact}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Informations professionnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Poste
            </label>
            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{profile.position}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Building className="w-4 h-4" /> Département
            </label>
            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{profile.department}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" /> Manager
            </label>
            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{profile.manager}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Date d'embauche
            </label>
            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{new Date(profile.startDate).toLocaleDateString('fr-FR')}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Lieu de travail
            </label>
            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{profile.workLocation}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Horaires
            </label>
            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{profile.workSchedule}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Compétences et certifications</h3>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">Compétences</label>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-secondary-100 text-blue-800 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">Certifications</label>
            <div className="flex flex-wrap gap-2">
              {profile.certifications.map((cert, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                  <Award className="w-3 h-3" /> {cert}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">Langues</label>
            <div className="space-y-2">
              {profile.languages.map((lang, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-xl">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-sm text-gray-600">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Sécurité du compte</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Mot de passe</p>
                <p className="text-sm text-gray-600">Dernière modification il y a 3 mois</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors">
              Modifier
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
                <p className="text-sm text-gray-600">Sécurisez votre compte avec 2FA</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Activer
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notifications par email</p>
              <p className="text-sm text-gray-600">Recevez les notifications importantes par email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={profile.notifications.email} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notifications push</p>
              <p className="text-sm text-gray-600">Notifications dans le navigateur</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={profile.notifications.push} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
              <p className="text-gray-600 mt-1">Gérez vos informations personnelles et professionnelles</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-all"
              >
                <Edit className="w-5 h-5" />
                Modifier le profil
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all"
                >
                  <X className="w-5 h-5" />
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-all"
                >
                  <Save className="w-5 h-5" />
                  Sauvegarder
                </button>
              </div>
            )}
          </div>

          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h2>
                <p className="text-lg text-gray-600 mb-2">{profile.position}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" /> {profile.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Depuis {new Date(profile.startDate).toLocaleDateString('fr-FR')}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {profile.workLocation}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-secondary-500 text-secondary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
            <div className="p-8">
              {activeTab === 'personal' && renderPersonalInfo()}
              {activeTab === 'professional' && renderProfessionalInfo()}
              {activeTab === 'security' && renderSecuritySettings()}
              {activeTab === 'preferences' && renderPreferences()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;