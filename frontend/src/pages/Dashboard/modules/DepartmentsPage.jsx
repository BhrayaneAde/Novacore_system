import React, { useState, useEffect } from 'react';
import { Building2, Users, Plus, Edit, Trash2, Search, Filter, MoreVertical, UserPlus, Settings, BarChart3, TrendingUp, MapPin, Phone, Mail, Calendar, Target, Award, AlertCircle, CheckCircle } from 'lucide-react';
import { systemService } from '../../../services/system';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, analytics
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadDepartments();
    loadEmployees();
  }, []);

  const loadDepartments = async () => {
    try {
      const response = await systemService.settings.getDepartments?.() || { data: [] };
      const mockDepartments = [
        {
          id: 1,
          name: 'Ressources Humaines',
          code: 'RH',
          manager: 'Marie Dupont',
          managerId: 1,
          employees: 5,
          budget: 250000,
          location: 'Bâtiment A - 2ème étage',
          phone: '+221 33 123 45 67',
          email: 'rh@company.com',
          description: 'Gestion des ressources humaines, recrutement et formation',
          objectives: ['Recruter 10 nouveaux talents', 'Améliorer satisfaction employés'],
          performance: 92,
          status: 'active',
          createdAt: '2023-01-15',
          kpis: {
            satisfaction: 4.2,
            turnover: 8,
            productivity: 95,
            absenteeism: 3.2
          }
        },
        {
          id: 2,
          name: 'Développement',
          code: 'DEV',
          manager: 'Jean Martin',
          managerId: 2,
          employees: 12,
          budget: 800000,
          location: 'Bâtiment B - 1er étage',
          phone: '+221 33 123 45 68',
          email: 'dev@company.com',
          description: 'Développement logiciel et innovation technologique',
          objectives: ['Livrer 5 projets majeurs', 'Réduire bugs de 30%'],
          performance: 88,
          status: 'active',
          createdAt: '2023-02-01',
          kpis: {
            satisfaction: 4.5,
            turnover: 5,
            productivity: 98,
            absenteeism: 2.1
          }
        },
        {
          id: 3,
          name: 'Marketing',
          code: 'MKT',
          manager: 'Sophie Bernard',
          managerId: 3,
          employees: 8,
          budget: 450000,
          location: 'Bâtiment A - 3ème étage',
          phone: '+221 33 123 45 69',
          email: 'marketing@company.com',
          description: 'Marketing digital et communication',
          objectives: ['Augmenter leads de 40%', 'Lancer 3 campagnes'],
          performance: 85,
          status: 'active',
          createdAt: '2023-01-20',
          kpis: {
            satisfaction: 4.0,
            turnover: 12,
            productivity: 87,
            absenteeism: 4.5
          }
        },
        {
          id: 4,
          name: 'Finance',
          code: 'FIN',
          manager: 'Pierre Moreau',
          managerId: 4,
          employees: 6,
          budget: 300000,
          location: 'Bâtiment A - 1er étage',
          phone: '+221 33 123 45 70',
          email: 'finance@company.com',
          description: 'Gestion financière et comptabilité',
          objectives: ['Optimiser cash-flow', 'Automatiser reporting'],
          performance: 90,
          status: 'active',
          createdAt: '2023-01-10',
          kpis: {
            satisfaction: 3.8,
            turnover: 6,
            productivity: 92,
            absenteeism: 2.8
          }
        }
      ];
      setDepartments(mockDepartments);
      
      // Calculer les statistiques
      const totalEmployees = mockDepartments.reduce((sum, d) => sum + d.employees, 0);
      const totalBudget = mockDepartments.reduce((sum, d) => sum + d.budget, 0);
      const avgPerformance = mockDepartments.reduce((sum, d) => sum + d.performance, 0) / mockDepartments.length;
      const avgSatisfaction = mockDepartments.reduce((sum, d) => sum + d.kpis.satisfaction, 0) / mockDepartments.length;
      
      setStats({
        totalDepartments: mockDepartments.length,
        totalEmployees,
        totalBudget,
        avgPerformance: Math.round(avgPerformance),
        avgSatisfaction: avgSatisfaction.toFixed(1),
        activeDepartments: mockDepartments.filter(d => d.status === 'active').length
      });
    } catch (error) {
      console.error('Erreur chargement départements:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await systemService.employees.getAll();
      setEmployees(response.data?.employees || response.employees || []);
    } catch (error) {
      console.error('Erreur chargement employés:', error);
    }
  };

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || dept.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateDepartment = (formData) => {
    const newDept = {
      id: Date.now(),
      ...formData,
      employees: 0,
      performance: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      kpis: {
        satisfaction: 0,
        turnover: 0,
        productivity: 0,
        absenteeism: 0
      }
    };
    setDepartments([...departments, newDept]);
    setShowCreateModal(false);
  };

  const handleEditDepartment = (formData) => {
    setDepartments(departments.map(d => 
      d.id === editingDepartment.id ? { ...d, ...formData } : d
    ));
    setShowEditModal(false);
    setEditingDepartment(null);
  };

  const handleDeleteDepartment = (deptId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
      setDepartments(departments.filter(d => d.id !== deptId));
    }
  };

  const DepartmentModal = ({ isOpen, onClose, onSubmit, department = null, title }) => {
    const [formData, setFormData] = useState({
      name: department?.name || '',
      code: department?.code || '',
      manager: department?.manager || '',
      location: department?.location || '',
      phone: department?.phone || '',
      email: department?.email || '',
      description: department?.description || '',
      budget: department?.budget || 0
    });

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-6">{title}</h2>
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom du département</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Manager</label>
              <input
                type="text"
                value={formData.manager}
                onChange={(e) => setFormData({...formData, manager: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Localisation</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Budget annuel (F CFA)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {department ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Départements</h1>
            <p className="text-gray-600">Organisation et structure de l'entreprise</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white rounded-lg border px-3 py-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <Building2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <Users className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`p-1 rounded ${viewMode === 'analytics' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau département</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Départements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDepartments}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Performance Moyenne</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgPerformance}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Budget Total</p>
              <p className="text-2xl font-bold text-gray-900">{(stats.totalBudget / 1000000).toFixed(1)}M</p>
            </div>
            <Award className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un département..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredDepartments.length} département(s) trouvé(s)
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <div key={dept.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                    <p className="text-sm text-gray-500">{dept.code}</p>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Manager</span>
                  <span className="text-sm font-medium">{dept.manager}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Employés</span>
                  <span className="text-sm font-medium">{dept.employees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Performance</span>
                  <span className="text-sm font-medium text-green-600">{dept.performance}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Budget</span>
                  <span className="text-sm font-medium">{(dept.budget / 1000).toLocaleString()}K</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
                <MapPin className="w-3 h-3" />
                <span>{dept.location}</span>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${dept.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-xs text-gray-600 capitalize">{dept.status}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingDepartment(dept);
                      setShowEditModal(true);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDepartment(dept.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employés</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDepartments.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                        <div className="text-sm text-gray-500">{dept.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.manager}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.employees}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{dept.performance}%</div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: `${dept.performance}%`}}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(dept.budget / 1000).toLocaleString()}K F CFA</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      dept.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {dept.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingDepartment(dept);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(dept.id)}
                        className="text-red-600 hover:text-red-900"
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
      )}

      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Performance par Département</h3>
            <div className="space-y-4">
              {departments.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">{dept.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: `${dept.performance}%`}}></div>
                    </div>
                    <span className="text-sm font-medium w-12">{dept.performance}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">KPIs Moyens</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.avgSatisfaction}</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">7.8%</div>
                <div className="text-sm text-gray-600">Turnover</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">93%</div>
                <div className="text-sm text-gray-600">Productivité</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">3.1%</div>
                <div className="text-sm text-gray-600">Absentéisme</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <DepartmentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateDepartment}
        title="Créer un nouveau département"
      />
      
      <DepartmentModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingDepartment(null);
        }}
        onSubmit={handleEditDepartment}
        department={editingDepartment}
        title="Modifier le département"
      />
    </div>
  );
};

export default DepartmentsPage;