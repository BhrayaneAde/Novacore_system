import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const TaskFilters = ({ filters, onFiltersChange, tasksCount }) => {
  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: '',
      priority: '',
      category: '',
      assigned_to: '',
      overdue: false,
      search: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== false
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-medium text-gray-900">Filtres</h3>
          <span className="text-sm text-gray-500">
            ({tasksCount} tâche{tasksCount > 1 ? 's' : ''})
          </span>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <X className="w-4 h-4" />
            Effacer
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={filters.priority}
            onChange={(e) => updateFilter('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
          >
            <option value="">Toutes priorités</option>
            <option value="low">Basse</option>
            <option value="normal">Normale</option>
            <option value="high">Haute</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
          >
            <option value="">Toutes catégories</option>
            <option value="administrative">Administrative</option>
            <option value="technical">Technique</option>
            <option value="hr">RH</option>
            <option value="finance">Finance</option>
            <option value="marketing">Marketing</option>
            <option value="other">Autre</option>
          </select>
        </div>

        {/* Overdue Filter */}
        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.overdue}
              onChange={(e) => updateFilter('overdue', e.target.checked)}
              className="rounded border-gray-300 text-secondary-600 focus:ring-secondary-500"
            />
            <span className="text-sm text-gray-700">En retard</span>
          </label>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-blue-800 text-sm rounded-full">
              Recherche: "{filters.search}"
              <button
                onClick={() => updateFilter('search', '')}
                className="text-secondary-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-blue-800 text-sm rounded-full">
              Statut: {filters.status}
              <button
                onClick={() => updateFilter('status', '')}
                className="text-secondary-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.priority && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-blue-800 text-sm rounded-full">
              Priorité: {filters.priority}
              <button
                onClick={() => updateFilter('priority', '')}
                className="text-secondary-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-blue-800 text-sm rounded-full">
              Catégorie: {filters.category}
              <button
                onClick={() => updateFilter('category', '')}
                className="text-secondary-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.overdue && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
              En retard
              <button
                onClick={() => updateFilter('overdue', false)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;