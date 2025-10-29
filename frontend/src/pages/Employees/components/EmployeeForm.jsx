import React from "react";

const EmployeeForm = ({ formData, onChange, onSubmit, submitLabel = "Enregistrer" }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom complet *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            placeholder="Jean Dupont"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            placeholder="jean.dupont@novacore.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poste *
          </label>
          <input
            type="text"
            name="role"
            value={formData.role || ""}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            placeholder="Développeur Full Stack"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Département *
          </label>
          <select
            name="department"
            value={formData.department || ""}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
          >
            <option value="">Sélectionner un département</option>
            <option value="Développement">Développement</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Ventes">Ventes</option>
            <option value="Support">Support</option>
            <option value="Ressources Humaines">Ressources Humaines</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            placeholder="+33 6 12 34 56 78"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salaire annuel (€) *
          </label>
          <input
            type="number"
            name="salary"
            value={formData.salary || ""}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            placeholder="50000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date d'embauche *
          </label>
          <input
            type="date"
            name="hireDate"
            value={formData.hireDate || ""}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            name="status"
            value={formData.status || "active"}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
          >
            <option value="active">Actif</option>
            <option value="on_leave">En congé</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors font-medium"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default EmployeeForm;
