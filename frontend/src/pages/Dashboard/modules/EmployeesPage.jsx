import React, { useState, useEffect } from "react";
import { employeesService } from "../../../services";
import { UserPlus, Mail, Phone, Calendar, Search, Filter, MoreVertical, Edit, Trash2 } from "lucide-react";
import Loader from "../../../components/ui/Loader";
import EmployeeForm from "../../../components/forms/EmployeeForm";

const EmployeesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeesData = await employeesService.getAll();
        setEmployees(employeesData.data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des employés:', error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);
  
  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.first_name} ${emp.last_name}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
           (selectedDepartment === 'all' || emp.department === selectedDepartment);
  });

  const handleSave = async (formData) => {
    try {
      if (selectedEmployee) {
        // Modifier
        const updatedEmployees = employees.map(emp => 
          emp.id === selectedEmployee.id ? { ...emp, ...formData } : emp
        );
        setEmployees(updatedEmployees);
      } else {
        // Ajouter
        const newEmployee = {
          id: Date.now(),
          ...formData
        };
        setEmployees([...employees, newEmployee]);
      }
      setShowForm(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };



  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <Loader />
      </div>
    );
  }

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
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-secondary-600" />
            </div>
            <span className="text-2xl font-bold text-secondary-600">{employees.length}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Total employés</h3>
          <p className="text-sm text-gray-600">Tous départements</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">{employees.filter(e => e.is_active).length}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Employés actifs</h3>
          <p className="text-sm text-gray-600">En poste</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-orange-600">{employees.filter(e => !e.is_active).length}</span>
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
            <button 
              onClick={() => {
                setSelectedEmployee(null);
                setShowForm(true);
              }}
              className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
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
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 text-sm"
              />
            </div>
            <select 
              value={selectedDepartment} 
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 text-sm"
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
                      <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {employee.first_name?.[0]}{employee.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{employee.first_name} {employee.last_name}</p>
                        <p className="text-sm text-gray-500">{employee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{employee.position}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-blue-800">
                      {employee.department}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      employee.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {employee.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(employee.hire_date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900">
                      {employee.salary?.toLocaleString('fr-FR') || 'N/A'} €
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setShowForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(employee.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EmployeeForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedEmployee(null);
        }}
        onSave={handleSave}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default EmployeesPage;
