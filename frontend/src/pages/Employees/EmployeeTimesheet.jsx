import React, { useState } from 'react';
import { Clock, Play, Pause, Calendar, Search, Filter, ChevronDown, Timer, TrendingUp, Target, BarChart3 } from 'lucide-react';

const EmployeeTimesheet = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('Cette semaine');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState('08:32:15');

  const timeStats = [
    { label: 'Heures aujourd\'hui', value: '8h32', change: '+12%', icon: Clock, color: 'blue' },
    { label: 'Cette semaine', value: '38h15', change: '+5%', icon: Calendar, color: 'green' },
    { label: 'Ce mois', value: '152h30', change: '+8%', icon: TrendingUp, color: 'purple' },
    { label: 'Heures supplémentaires', value: '12h45', change: '+15%', icon: Timer, color: 'orange' }
  ];

  const weeklyHours = [
    { 
      day: 'Lundi', 
      date: '23/12/2024', 
      startTime: '09:00', 
      endTime: '17:30', 
      breakTime: '1h00', 
      totalHours: '7h30', 
      project: 'Formation Excel', 
      status: 'Validé',
      overtime: '0h00'
    },
    { 
      day: 'Mardi', 
      date: '24/12/2024', 
      startTime: '09:15', 
      endTime: '13:15', 
      breakTime: '0h00', 
      totalHours: '4h00', 
      project: 'Réunion équipe', 
      status: 'Validé',
      overtime: '0h00'
    },
    { 
      day: 'Mercredi', 
      date: '25/12/2024', 
      startTime: '-', 
      endTime: '-', 
      breakTime: '-', 
      totalHours: '0h00', 
      project: 'Congé Noël', 
      status: 'Congé',
      overtime: '0h00'
    },
    { 
      day: 'Jeudi', 
      date: '26/12/2024', 
      startTime: '-', 
      endTime: '-', 
      breakTime: '-', 
      totalHours: '0h00', 
      project: 'Congé Noël', 
      status: 'Congé',
      overtime: '0h00'
    },
    { 
      day: 'Vendredi', 
      date: '27/12/2024', 
      startTime: '09:00', 
      endTime: '18:00', 
      breakTime: '1h00', 
      totalHours: '8h00', 
      project: 'Développement projet', 
      status: 'En cours',
      overtime: '0h30'
    }
  ];

  const monthlyProgress = {
    worked: 152.5,
    target: 160,
    percentage: 95.3
  };

  const filteredHours = weeklyHours.filter(entry => 
    entry.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Heures</h1>
        <p className="text-gray-600">Suivez votre temps de travail et consultez vos heures</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {timeStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-secondary-100' :
                stat.color === 'green' ? 'bg-green-100' :
                stat.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'
              }`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.color === 'blue' ? 'text-secondary-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                }`} />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Timer Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Pointage en temps réel</h2>
            <p className="text-gray-600">Démarrez ou arrêtez votre temps de travail</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 mb-1">{currentTime}</p>
              <p className="text-sm text-gray-500">Temps aujourd'hui</p>
            </div>
            <button 
              onClick={toggleTimer}
              className={`p-4 rounded-full transition-colors ${
                isTimerRunning 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Objectif mensuel</span>
            <span className="text-sm text-gray-600">{monthlyProgress.worked}h / {monthlyProgress.target}h</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${monthlyProgress.percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{monthlyProgress.percentage}% complété</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Feuille de temps</h2>
            <div className="relative">
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
              >
                <option>Cette semaine</option>
                <option>Semaine dernière</option>
                <option>Ce mois</option>
                <option>Mois dernier</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 text-sm"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Timesheet Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Jour</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Arrivée</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Départ</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Pause</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Total</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Heures sup.</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Projet</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredHours.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{entry.day}</p>
                      <p className="text-sm text-gray-500">{entry.date}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{entry.startTime}</td>
                  <td className="py-4 px-6 text-gray-900">{entry.endTime}</td>
                  <td className="py-4 px-6 text-gray-900">{entry.breakTime}</td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900">{entry.totalHours}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-medium ${
                      entry.overtime !== '0h00' ? 'text-orange-600' : 'text-gray-500'
                    }`}>
                      {entry.overtime}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">{entry.project}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      entry.status === 'Validé' ? 'bg-green-100 text-green-800' :
                      entry.status === 'En cours' ? 'bg-secondary-100 text-blue-800' :
                      entry.status === 'Congé' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Summary Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total de la période</span>
            <div className="flex items-center space-x-6">
              <span className="text-sm font-medium text-gray-900">
                Heures travaillées: <span className="font-bold">19h30</span>
              </span>
              <span className="text-sm font-medium text-gray-900">
                Heures supplémentaires: <span className="font-bold text-orange-600">0h30</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTimesheet;