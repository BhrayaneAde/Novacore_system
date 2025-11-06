import React, { useState, useEffect } from 'react';
import { User, Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';

const AdvancedEmployeeSetup = ({ employee, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    // Informations fiscales
    marital_status: '',
    children_count: 0,
    tax_status: '',
    
    // Informations professionnelles
    seniority_years: 0,
    grade: '',
    level: '',
    
    // Variables personnalisées
    custom_allowances: [],
    custom_deductions: []
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        marital_status: employee.marital_status || '',
        children_count: employee.children_count || 0,
        tax_status: employee.tax_status || '',
        seniority_years: employee.seniority_years || 0,
        grade: employee.grade || '',
        level: employee.level || '',
        custom_allowances: employee.custom_allowances || [],
        custom_deductions: employee.custom_deductions || []
      });
    }
  }, [employee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.put(`/employees/${employee.id}`, formData);
      onSave();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCustomItem = (type) => {
    const newItem = { code: '', name: '', amount: 0 };
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], newItem]
    }));
  };

  const removeCustomItem = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const updateCustomItem = (type, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Paramétrage avancé</h1>
              <p className="text-gray-600">{employee?.name}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations fiscales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Situation fiscale</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut matrimonial
              </label>
              <select
                value={formData.marital_status}
                onChange={(e) => setFormData(prev => ({ ...prev, marital_status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="célibataire">Célibataire</option>
                <option value="marié">Marié(e)</option>
                <option value="divorcé">Divorcé(e)</option>
                <option value="veuf">Veuf/Veuve</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre d'enfants
              </label>
              <input
                type="number"
                min="0"
                value={formData.children_count}
                onChange={(e) => setFormData(prev => ({ ...prev, children_count: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut fiscal
              </label>
              <select
                value={formData.tax_status}
                onChange={(e) => setFormData(prev => ({ ...prev, tax_status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="normal">Normal</option>
                <option value="exonéré">Exonéré</option>
                <option value="réduit">Taux réduit</option>
              </select>
            </div>
          </div>
        </div>

        {/* Informations professionnelles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations professionnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ancienneté (années)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.seniority_years}
                onChange={(e) => setFormData(prev => ({ ...prev, seniority_years: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Cadre, Agent de maîtrise..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Échelon/Niveau
              </label>
              <input
                type="text"
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Niveau 1, Échelon A..."
              />
            </div>
          </div>
        </div>

        {/* Primes personnalisées */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Primes personnalisées</h3>
            <button
              type="button"
              onClick={() => addCustomItem('custom_allowances')}
              className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
          </div>
          {formData.custom_allowances.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="Code"
                value={item.code}
                onChange={(e) => updateCustomItem('custom_allowances', index, 'code', e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Nom de la prime"
                value={item.name}
                onChange={(e) => updateCustomItem('custom_allowances', index, 'name', e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Montant"
                value={item.amount}
                onChange={(e) => updateCustomItem('custom_allowances', index, 'amount', parseFloat(e.target.value) || 0)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeCustomItem('custom_allowances', index)}
                className="flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Retenues personnalisées */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Retenues personnalisées</h3>
            <button
              type="button"
              onClick={() => addCustomItem('custom_deductions')}
              className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
          </div>
          {formData.custom_deductions.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="Code"
                value={item.code}
                onChange={(e) => updateCustomItem('custom_deductions', index, 'code', e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Nom de la retenue"
                value={item.name}
                onChange={(e) => updateCustomItem('custom_deductions', index, 'name', e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Montant"
                value={item.amount}
                onChange={(e) => updateCustomItem('custom_deductions', index, 'amount', parseFloat(e.target.value) || 0)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeCustomItem('custom_deductions', index)}
                className="flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedEmployeeSetup;