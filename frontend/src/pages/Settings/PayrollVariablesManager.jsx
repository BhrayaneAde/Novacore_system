import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Save, X, ArrowUp, ArrowDown, Settings } from 'lucide-react';
import VariableStats from '../../components/payroll/VariableStats';
import VariableFilters from '../../components/payroll/VariableFilters';
import api from '../../services/api';

const PayrollVariablesManager = () => {
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [variableTypes, setVariableTypes] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [newVariable, setNewVariable] = useState({
    code: '',
    name: '',
    variable_type: 'FIXE',
    calculation_method: 'fixed',
    fixed_amount: '',
    percentage_rate: '',
    formula: '',
    description: '',
    is_active: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadVariables();
    loadVariableTypes();
    loadTemplates();
  }, []);

  const loadVariables = async () => {
    try {
      const response = await api.get('/payroll-config/variables');
      setVariables(response.data.variables || []);
    } catch (error) {
      console.error('Erreur chargement variables:', error);
      setVariables([]);
    } finally {
      setLoading(false);
    }
  };

  const loadVariableTypes = async () => {
    try {
      const response = await api.get('/payroll-config/variable-types');
      setVariableTypes(response.data);
    } catch (error) {
      console.error('Erreur chargement types:', error);
      setVariableTypes({ variable_types: [], calculation_methods: [] });
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await api.get('/payroll-config/variables/templates');
      setTemplates(response.data.templates || []);
    } catch (error) {
      console.error('Erreur chargement templates:', error);
      setTemplates([]);
    }
  };

  const handleAddVariable = async () => {
    try {
      const response = await api.post('/payroll-config/variables', {
        ...newVariable,
        fixed_amount: newVariable.fixed_amount ? parseFloat(newVariable.fixed_amount) : null,
        percentage_rate: newVariable.percentage_rate ? parseFloat(newVariable.percentage_rate) : null,
        display_order: variables.length
      });
      
      setVariables([...variables, response.data]);
      setNewVariable({
        code: '', name: '', variable_type: 'FIXE', calculation_method: 'fixed',
        fixed_amount: '', percentage_rate: '', formula: '', description: '', is_active: true
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur création variable:', error);
      if (error.response?.status === 401) {
        alert('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/login';
      } else {
        alert('Erreur lors de la création de la variable: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const handleUpdateVariable = async (id, updates) => {
    try {
      const response = await api.put(`/payroll-config/variables/${id}`, updates);
      setVariables(variables.map(v => v.id === id ? response.data : v));
      setEditingId(null);
    } catch (error) {
      console.error('Erreur mise à jour variable:', error);
    }
  };

  const handleToggleVariable = async (id) => {
    try {
      const response = await api.post(`/payroll-config/variables/${id}/toggle`);
      setVariables(variables.map(v => 
        v.id === id ? { ...v, is_active: response.data.variable.is_active } : v
      ));
    } catch (error) {
      console.error('Erreur toggle variable:', error);
    }
  };

  const handleDeleteVariable = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette variable ?')) return;

    try {
      await api.delete(`/payroll-config/variables/${id}`);
      setVariables(variables.filter(v => v.id !== id));
    } catch (error) {
      console.error('Erreur suppression variable:', error);
    }
  };

  const moveVariable = async (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= variables.length) return;

    const newVariables = [...variables];
    [newVariables[index], newVariables[newIndex]] = [newVariables[newIndex], newVariables[index]];
    
    const reorderedItems = newVariables.map((item, idx) => ({
      ...item,
      display_order: idx
    }));

    setVariables(reorderedItems);

    try {
      await api.put('/payroll-config/variables/reorder', {
        variable_orders: reorderedItems.map(item => ({
          id: item.id,
          display_order: item.display_order
        }))
      });
    } catch (error) {
      console.error('Erreur réorganisation:', error);
    }
  };

  const addFromTemplate = async (template) => {
    try {
      const response = await api.post('/payroll-config/variables', {
        ...template,
        display_order: variables.length
      });
      setVariables([...variables, response.data]);
    } catch (error) {
      console.error('Erreur ajout template:', error);
      if (error.response?.status === 401) {
        alert('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/login';
      } else {
        alert('Erreur lors de l\'ajout du template: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const filteredVariables = useMemo(() => {
    return variables.filter(variable => {
      const matchesSearch = variable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           variable.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (variable.description && variable.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = !typeFilter || variable.variable_type === typeFilter;
      
      const matchesStatus = !statusFilter || 
                           (statusFilter === 'active' && variable.is_active) ||
                           (statusFilter === 'inactive' && !variable.is_active) ||
                           (statusFilter === 'mandatory' && variable.is_mandatory);
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [variables, searchTerm, typeFilter, statusFilter]);

  const VariableCard = ({ variable, index }) => {
    const [editData, setEditData] = useState(variable);
    const isEditing = editingId === variable.id;

    return (
      <div className={`bg-white rounded-2xl border-2 p-6 mb-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
        variable.is_active 
          ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' 
          : 'border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50'
      } ${isEditing ? 'ring-2 ring-blue-500 border-blue-300' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex flex-col space-y-1 bg-white rounded-lg p-2 shadow-sm">
              <button
                onClick={() => moveVariable(index, 'up')}
                disabled={index === 0}
                className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-30 hover:bg-blue-50 rounded-md transition-all"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveVariable(index, 'down')}
                disabled={index === variables.length - 1}
                className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-30 hover:bg-blue-50 rounded-md transition-all"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
                
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={editData.code}
                      onChange={(e) => setEditData({...editData, code: e.target.value})}
                      className="px-3 py-2 border rounded-lg text-sm"
                      placeholder="Code"
                    />
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="px-3 py-2 border rounded-lg text-sm"
                      placeholder="Nom"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={editData.variable_type}
                      onChange={(e) => setEditData({...editData, variable_type: e.target.value})}
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      {variableTypes.variable_types?.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <select
                      value={editData.calculation_method}
                      onChange={(e) => setEditData({...editData, calculation_method: e.target.value})}
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      {variableTypes.calculation_methods?.map(method => (
                        <option key={method.value} value={method.value}>{method.label}</option>
                      ))}
                    </select>
                    {editData.calculation_method === 'fixed' && (
                      <input
                        type="number"
                        value={editData.fixed_amount || ''}
                        onChange={(e) => setEditData({...editData, fixed_amount: e.target.value})}
                        className="px-3 py-2 border rounded-lg text-sm"
                        placeholder="Montant"
                      />
                    )}
                    {editData.calculation_method === 'percentage' && (
                      <input
                        type="number"
                        step="0.1"
                        value={editData.percentage_rate || ''}
                        onChange={(e) => setEditData({...editData, percentage_rate: e.target.value})}
                        className="px-3 py-2 border rounded-lg text-sm"
                        placeholder="Pourcentage"
                      />
                    )}
                  </div>
                  <textarea
                    value={editData.description || ''}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Description"
                    rows="2"
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{variable.name}</h3>
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-full">
                      {variable.code}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      variable.variable_type === 'FIXE' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                      variable.variable_type === 'PRIME' ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white' :
                      variable.variable_type === 'INDEMNITE' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                      variable.variable_type === 'RETENUE' ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white' :
                      variable.variable_type === 'COTISATION' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' :
                      'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
                    }`}>
                      {variable.variable_type}
                    </span>
                    {variable.is_mandatory && (
                      <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium rounded-full">
                        Obligatoire
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3 leading-relaxed">{variable.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-gray-700 font-medium">Méthode:</span>
                      <span className="text-gray-600">{variable.calculation_method}</span>
                    </div>
                    {variable.fixed_amount && (
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-gray-700 font-medium">Montant:</span>
                        <span className="text-green-600 font-semibold">{variable.fixed_amount.toLocaleString()} XOF</span>
                      </div>
                    )}
                    {variable.percentage_rate && (
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span className="text-gray-700 font-medium">Taux:</span>
                        <span className="text-purple-600 font-semibold">{variable.percentage_rate}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => handleUpdateVariable(variable.id, editData)}
                  className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="p-3 bg-gradient-to-r from-gray-500 to-slate-500 text-white rounded-xl hover:from-gray-600 hover:to-slate-600 shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleToggleVariable(variable.id)}
                  className={`p-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 ${
                    variable.is_active 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600' 
                      : 'bg-gradient-to-r from-gray-400 to-slate-400 text-white hover:from-gray-500 hover:to-slate-500'
                  }`}
                  disabled={variable.is_mandatory && variable.is_active}
                >
                  {variable.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
                <button
                  onClick={() => {setEditingId(variable.id); setEditData(variable);}}
                  className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                {!variable.is_mandatory && (
                  <button
                    onClick={() => handleDeleteVariable(variable.id)}
                    className="p-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header avec gradient */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mr-4">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Variables de Paie
                  </h1>
                  <p className="text-gray-500 mt-1">Configurez et gérez vos variables de paie en toute simplicité</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 flex items-center shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouvelle Variable
              </button>
            </div>
          </div>
        </div>

      <VariableStats variables={variables} />

      <VariableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        variableTypes={variableTypes}
      />

        {templates.length > 0 && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3"></div>
              Templates de variables
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {templates.map(template => {
                const exists = variables.some(v => v.code === template.code);
                return (
                  <button
                    key={template.code}
                    onClick={() => !exists && addFromTemplate(template)}
                    disabled={exists}
                    className={`p-4 text-left border rounded-xl transition-all duration-200 transform hover:scale-105 shadow-sm ${
                      exists 
                        ? 'bg-green-50 border-green-200 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-gray-50 to-slate-50 hover:from-blue-50 hover:to-indigo-50 border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-900">{template.name}</div>
                      {exists && <div className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">✓</div>}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">{template.code}</div>
                    <div className="text-xs text-gray-400">{template.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Créer une nouvelle variable
                  </h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Code de la variable</label>
                    <input
                      type="text"
                      value={newVariable.code}
                      onChange={(e) => setNewVariable({...newVariable, code: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Ex: PRIME_PERF"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nom de la variable</label>
                    <input
                      type="text"
                      value={newVariable.name}
                      onChange={(e) => setNewVariable({...newVariable, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Ex: Prime de performance"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Type de variable</label>
                    <select
                      value={newVariable.variable_type}
                      onChange={(e) => setNewVariable({...newVariable, variable_type: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {variableTypes.variable_types?.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Méthode de calcul</label>
                    <select
                      value={newVariable.calculation_method}
                      onChange={(e) => setNewVariable({...newVariable, calculation_method: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {variableTypes.calculation_methods?.map(method => (
                        <option key={method.value} value={method.value}>{method.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {(newVariable.calculation_method === 'fixed' || newVariable.calculation_method === 'percentage') && (
                  <div className="mb-6">
                    {newVariable.calculation_method === 'fixed' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Montant (XOF)</label>
                        <input
                          type="number"
                          value={newVariable.fixed_amount}
                          onChange={(e) => setNewVariable({...newVariable, fixed_amount: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="50000"
                        />
                      </div>
                    )}
                    {newVariable.calculation_method === 'percentage' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Pourcentage (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={newVariable.percentage_rate}
                          onChange={(e) => setNewVariable({...newVariable, percentage_rate: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="10.5"
                        />
                      </div>
                    )}
                  </div>
                )}
                
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newVariable.description}
                    onChange={(e) => setNewVariable({...newVariable, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Description de la variable de paie..."
                    rows="3"
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddVariable}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Créer la variable
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {variables.length > 0 && (
        <div>
          {filteredVariables.length > 0 ? (
            filteredVariables.map((variable, index) => {
              const originalIndex = variables.findIndex(v => v.id === variable.id);
              return (
                <VariableCard key={variable.id} variable={variable} index={originalIndex} />
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Aucune variable ne correspond à votre recherche</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('');
                  setStatusFilter('');
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                Effacer les filtres
              </button>
            </div>
          )}
        </div>
      )}

        {variables.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Settings className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucune variable configurée</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Utilisez les templates ci-dessus ou créez vos propres variables de paie</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Créer une variable
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollVariablesManager;