import React, { useState } from "react";
import { UserPlus, Mail, Phone, Calendar, Search, Filter, MoreVertical } from "lucide-react";

const EmployeesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  
  const employees = [
    {
      id: 1,
      name: "Marie Dubois",
      email: "marie.dubois@techcorp.com",
      role: "Développeuse Senior",
      department: "Développement",
      status: "active",
      hireDate: "2022-03-15",
      salary: 65000,
      phone: "+33 6 12 34 56 78"
    },
    {
      id: 2,
      name: "Thomas Martin",
      email: "thomas.martin@techcorp.com",
      role: "Chef de Projet",
      department: "Management",
      status: "active",
      hireDate: "2021-09-01",
      salary: 75000,
      phone: "+33 6 23 45 67 89"
    },
    {
      id: 3,
      name: "Sophie Laurent",
      email: "sophie.laurent@techcorp.com",
      role: "Designer UX/UI",
      department: "Design",
      status: "active",
      hireDate: "2023-01-10",
      salary: 55000,
      phone: "+33 6 34 56 78 90"
    },
    {
      id: 4,
      name: "Pierre Moreau",
      email: "pierre.moreau@techcorp.com",
      role: "Responsable Marketing",
      department: "Marketing",
      status: "leave",
      hireDate: "2020-11-20",
      salary: 68000,
      phone: "+33 6 45 67 89 01"
    }
  ];
  
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedDepartment === 'all' || emp.department === selectedDepartment)
  );



  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des employés</h1>
        <p className="text-gray-600">{employees.length} employés au total</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-blue-600">{employees.length}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Total employés</h3>
          <p className="text-sm text-gray-600">Tous départements</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">{employees.filter(e => e.status === 'active').length}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Employés actifs</h3>
          <p className="text-sm text-gray-600">En poste</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-orange-600">{employees.filter(e => e.status === 'leave').length}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">En congé</h3>
          <p className="text-sm text-gray-600">Temporairement</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-purple-600">4</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Départements</h3>
          <p className="text-sm text-gray-600">Actifs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Liste des employés</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <UserPlus className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <select 
              value={selectedDepartment} 
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">Tous les départements</option>
              <option value="Développement">Développement</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Management">Management</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Employé</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Poste</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Département</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Statut</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date d'embauche</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Salaire</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{employee.role}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {employee.department}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {employee.status === 'active' ? 'Actif' : 'En congé'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(employee.hireDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900">
                      {employee.salary.toLocaleString('fr-FR')} €
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
