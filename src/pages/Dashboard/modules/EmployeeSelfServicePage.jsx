import React, { useState } from 'react';
import { User, Edit, Save, Clock, Target, Star, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

const EmployeeSelfServicePage = () => {
  const { currentUser, isEmployee } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la Paix, 75001 Paris',
    emergencyContact: 'Marie Dupont - 06 98 76 54 32',
    bankAccount: 'FR76 1234 5678 9012 3456 789'
  });

  if (!isEmployee()) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Accès réservé aux employés</p>
      </div>
    );
  }

  const handleSave = () => {
    setIsEditing(false);
    // Sauvegarder les données
  };

  const timeEntries = [
    { date: '2025-01-20', project: 'Projet Alpha', hours: 8, status: 'approved' },
    { date: '2025-01-19', project: 'Formation React', hours: 4, status: 'pending' },
    { date: '2025-01-18', project: 'Projet Beta', hours: 7.5, status: 'approved' }
  ];

  const goals = [
    { id: 1, title: 'Maîtriser React Hooks', progress: 75, deadline: '2025-03-01' },
    { id: 2, title: 'Certification AWS', progress: 30, deadline: '2025-06-01' },
    { id: 3, title: 'Améliorer communication', progress: 60, deadline: '2025-04-15' }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Espace Personnel</h1>
        <p className="text-gray-600">Gérez vos informations et suivez votre progression</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations personnelles */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              {isEditing ? 'Sauvegarder' : 'Modifier'}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg">{formData.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              {isEditing ? (
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg">{formData.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact d'urgence</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg">{formData.emergencyContact}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RIB</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg font-mono text-sm">{formData.bankAccount}</p>
              )}
            </div>
          </div>
        </div>

        {/* Suivi du temps */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Suivi du temps</h2>
          </div>

          <div className="space-y-3">
            {timeEntries.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{entry.project}</p>
                  <p className="text-sm text-gray-600">{entry.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{entry.hours}h</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    entry.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {entry.status === 'approved' ? 'Approuvé' : 'En attente'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Ajouter des heures
          </button>
        </div>

        {/* Objectifs personnels */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Mes Objectifs</h2>
          </div>

          <div className="space-y-4">
            {goals.map(goal => (
              <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{goal.title}</h3>
                  <span className="text-sm text-gray-600">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">Échéance: {goal.deadline}</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Nouvel objectif
          </button>
        </div>

        {/* Feedback 360° */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Feedback 360°</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-2">Évaluer votre manager</h3>
              <p className="text-sm text-purple-700 mb-3">Donnez votre feedback anonyme sur le management</p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                Commencer l'évaluation
              </button>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Évaluer vos collègues</h3>
              <p className="text-sm text-blue-700 mb-3">Feedback sur la collaboration en équipe</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Donner un feedback
              </button>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">Auto-évaluation</h3>
              <p className="text-sm text-green-700 mb-3">Réflexion sur vos performances</p>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                S'auto-évaluer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSelfServicePage;