import React, { useState, useEffect } from 'react';
import { X, User, Calendar, Clock, Tag, AlertCircle } from 'lucide-react';
import { employeesService } from '../../../services';

const TaskForm = ({ task = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    priority: 'normal',
    category: 'administrative',
    estimated_hours: '',
    due_date: '',
    tags: '',
    department_id: ''
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadEmployees();
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        assigned_to: task.assigned_to || '',
        priority: task.priority || 'normal',
        category: task.category || 'administrative',
        estimated_hours: task.estimated_hours || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        tags: task.tags ? task.tags.join(', ') : '',
        department_id: task.department_id || ''
      });
    }
  }, [task]);

  const loadEmployees = async () => {
    try {
      const response = await employeesService.getAll();
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Erreur chargement employés:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    
    if (!formData.assigned_to) {
      newErrors.assigned_to = 'Veuillez assigner la tâche à quelqu\'un';
    }
    
    if (!formData.due_date) {
      newErrors.due_date = 'La date d\'échéance est requise';
    } else {
      const dueDate = new Date(formData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.due_date = 'La date d\'échéance ne peut pas être dans le passé';
      }
    }
    
    if (formData.estimated_hours && (isNaN(formData.estimated_hours) || formData.estimated_hours <= 0)) {
      newErrors.estimated_hours = 'Les heures estimées doivent être un nombre positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const taskData = {
        ...formData,
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        assigned_to: parseInt(formData.assigned_to)
      };

      await onSubmit(taskData);
    } catch (error) {
      console.error('Erreur soumission:', error);
      setErrors({ submit: 'Erreur lors de la sauvegarde' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {task ? 'Modifier la tâche' : 'Nouvelle tâche'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la tâche *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Entrez le titre de la tâche"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Décrivez la tâche en détail"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Assignment and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Assigner à *
              </label>
              <select
                value={formData.assigned_to}
                onChange={(e) => handleChange('assigned_to', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.assigned_to ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner un employé</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name} - {employee.position}
                  </option>
                ))}
              </select>
              {errors.assigned_to && (
                <p className="mt-1 text-sm text-red-600">{errors.assigned_to}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Priorité
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">🟢 Basse</option>
                <option value="normal">🟡 Normale</option>
                <option value="high">🟠 Haute</option>
                <option value="urgent">🔴 Urgente</option>
              </select>
            </div>
          </div>

          {/* Category and Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="administrative">Administrative</option>
                <option value="technical">Technique</option>
                <option value="hr">RH</option>
                <option value="finance">Finance</option>
                <option value="marketing">Marketing</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Heures estimées
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={formData.estimated_hours}
                onChange={(e) => handleChange('estimated_hours', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.estimated_hours ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="8"
              />
              {errors.estimated_hours && (
                <p className="mt-1 text-sm text-red-600">{errors.estimated_hours}</p>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date d'échéance *
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => handleChange('due_date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.due_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.due_date && (
              <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Tags (séparés par des virgules)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="urgent, design, client"
            />
            <p className="mt-1 text-sm text-gray-500">
              Exemple: urgent, design, client
            </p>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sauvegarde...' : (task ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;