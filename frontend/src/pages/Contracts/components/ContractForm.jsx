import React from "react";

const ContractForm = ({ formData, onChange, contractType }) => {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="space-y-4">
      {/* Poste et Département */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poste <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => handleChange("position", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Développeur Full Stack"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Département <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.department}
            onChange={(e) => handleChange("department", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner...</option>
            <option value="IT">IT / Informatique</option>
            <option value="RH">Ressources Humaines</option>
            <option value="Finance">Finance / Comptabilité</option>
            <option value="Marketing">Marketing / Communication</option>
            <option value="Commercial">Commercial / Ventes</option>
            <option value="Production">Production</option>
            <option value="Logistique">Logistique</option>
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de début <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {(contractType === "CDD" || contractType === "STAGE" || contractType === "INTERIM") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de fin <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}
      </div>

      {/* Salaire et Heures */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {contractType === "STAGE" ? "Gratification mensuelle (€)" : "Salaire brut mensuel (€)"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.salary}
            onChange={(e) => handleChange("salary", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={contractType === "STAGE" ? "600" : "3000"}
            min="0"
            step="50"
            required
          />
          {contractType === "STAGE" && (
            <p className="text-xs text-gray-500 mt-1">
              Minimum légal: 4,35€/heure (2024)
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heures hebdomadaires <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.workingHours}
            onChange={(e) => handleChange("workingHours", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="48"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Temps plein: 35h | Temps partiel: 20h
          </p>
        </div>
      </div>

      {/* Période d'essai */}
      {(contractType === "CDI" || contractType === "CDD") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Période d'essai
          </label>
          <select
            value={formData.trialPeriod}
            onChange={(e) => handleChange("trialPeriod", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Aucune</option>
            <option value="1">1 mois</option>
            <option value="2">2 mois</option>
            <option value="3">3 mois</option>
            <option value="4">4 mois</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {contractType === "CDI" 
              ? "Max: 4 mois pour cadres, 3 mois pour agents de maîtrise, 2 mois pour employés"
              : "Max: 1 mois si CDD ≥ 6 mois"}
          </p>
        </div>
      )}

      {/* Lieu de travail */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lieu de travail <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.workplace}
          onChange={(e) => handleChange("workplace", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Paris, 75001 ou Télétravail"
          required
        />
      </div>

      {/* Clauses spécifiques (optionnel) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Clauses spécifiques (optionnel)
        </label>
        <textarea
          value={formData.specificClauses}
          onChange={(e) => handleChange("specificClauses", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Clause de mobilité, clause de non-concurrence, avantages particuliers..."
        />
      </div>
    </div>
  );
};

export default ContractForm;
