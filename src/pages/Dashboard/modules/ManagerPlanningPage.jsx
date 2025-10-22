import React, { useState } from 'react';
import { Calendar, Clock, Users, Plus, Edit, RotateCcw } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

const ManagerPlanningPage = () => {
  const { currentUser, isManager, isSeniorManager } = useAuthStore();
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  if (!isManager() && !isSeniorManager()) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Accès réservé aux managers</p>
      </div>
    );
  }

  const teamMembers = [
    { id: 1, name: 'Lucas Martin', role: 'Designer', avatar: 'LM' },
    { id: 2, name: 'Camille Dubois', role: 'Designer', avatar: 'CD' },
    { id: 3, name: 'Antoine Moreau', role: 'Commercial', avatar: 'AM' }
  ];

  const shifts = [
    { id: 1, employeeId: 1, day: 'Lundi', startTime: '09:00', endTime: '17:00', type: 'Bureau' },
    { id: 2, employeeId: 1, day: 'Mardi', startTime: '09:00', endTime: '17:00', type: 'Remote' },
    { id: 3, employeeId: 2, day: 'Lundi', startTime: '08:30', endTime: '16:30', type: 'Bureau' },
    { id: 4, employeeId: 3, day: 'Lundi', startTime: '10:00', endTime: '18:00', type: 'Terrain' }
  ];

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Planning d'Équipe</h1>
        <p className="text-gray-600">Gérez les horaires et rotations de votre équipe</p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouveau créneau
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Rotation auto
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="text-gray-900 font-medium">Semaine du 20-26 Jan 2025</span>
        </div>
      </div>

      {/* Planning Grid */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-6 bg-gray-50">
          <div className="p-4 font-semibold text-gray-900">Employé</div>
          {days.map(day => (
            <div key={day} className="p-4 font-semibold text-gray-900 text-center">{day}</div>
          ))}
        </div>
        
        {teamMembers.map(member => (
          <div key={member.id} className="grid grid-cols-6 border-t border-gray-100">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">{member.avatar}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            </div>
            
            {days.map(day => {
              const shift = shifts.find(s => s.employeeId === member.id && s.day === day);
              return (
                <div key={day} className="p-4 border-l border-gray-100">
                  {shift ? (
                    <div className={`p-3 rounded-lg text-sm ${
                      shift.type === 'Bureau' ? 'bg-blue-50 text-blue-800' :
                      shift.type === 'Remote' ? 'bg-green-50 text-green-800' :
                      'bg-orange-50 text-orange-800'
                    }`}>
                      <div className="font-medium">{shift.startTime} - {shift.endTime}</div>
                      <div className="text-xs mt-1">{shift.type}</div>
                    </div>
                  ) : (
                    <div className="p-3 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-400 text-sm cursor-pointer hover:border-blue-300">
                      + Ajouter
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Heures planifiées</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">120h</p>
          <p className="text-sm text-gray-600">Cette semaine</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Présents</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">{teamMembers.length}</p>
          <p className="text-sm text-gray-600">Employés actifs</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Edit className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Modifications</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">3</p>
          <p className="text-sm text-gray-600">Cette semaine</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerPlanningPage;