import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { TrendingUp, User, DollarSign, Calendar, FileText } from "lucide-react";

const ContractPromotion = () => {
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [amendmentType, setAmendmentType] = useState("");
  const [formData, setFormData] = useState({
    newPosition: "",
    newSalary: "",
    newDepartment: "",
    effectiveDate: "",
    reason: "",
    additionalClauses: "",
  });

  const employees = [
    { 
      id: 1, 
      name: "Jean Dupont", 
      currentPosition: "Développeur Junior",
      currentSalary: "2500€",
      department: "IT", 
      contractType: "CDI",
      avatar: "https://i.pravatar.cc/150?img=1" 
    },
    { 
      id: 2, 
      name: "Marie Martin", 
      currentPosition: "Chargée RH",
      currentSalary: "2800€",
      department: "RH", 
      contractType: "CDI",
      avatar: "https://i.pravatar.cc/150?img=2" 
    },
  ];

  const amendmentTypes = [
    {
      type: "PROMOTION",
      name: "Promotion",
      description: "Changement de poste avec augmentation",
      icon: "🚀",
      color: "bg-green-50 border-green-200"
    },
    {
      type: "SALARY_INCREASE",
      name: "Augmentation de salaire",
      description: "Révision salariale sans changement de poste",
      icon: "💰",
      color: "bg-blue-50 border-blue-200"
    },
    {
      type: "TRANSFER",
      name: "Mutation / Transfert",
      description: "Changement de département ou lieu",
      icon: "🔄",
      color: "bg-purple-50 border-purple-200"
    },
    {
      type: "HOURS_CHANGE",
      name: "Modification des horaires",
      description: "Temps partiel, temps plein, etc.",
      icon: "⏰",
      color: "bg-orange-50 border-orange-200"
    },
  ];

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    const amendmentData = {
      employee: selectedEmployee,
      type: amendmentType,
      ...formData
    };
    console.log("Génération de l'avenant:", amendmentData);
    navigate("/app/contracts/preview", { state: { amendmentData } });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2 tracking-tight">Promotion / Avenant au Contrat</h1>
          <p className="text-gray-600">Créez un avenant pour modifier un contrat existant</p>
        </div>

        {/* Sélection de l'employé */}
        {!selectedEmployee && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Sélectionnez un employé</h2>
            <div className="space-y-3">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => setSelectedEmployee(employee)}
                  className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer transition-all hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                      <p className="text-sm text-gray-600">{employee.currentPosition}</p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-xs bg-secondary-100 text-blue-700 px-2 py-1 rounded">
                          {employee.contractType}
                        </span>
                        <span className="text-xs text-gray-600">{employee.department}</span>
                        <span className="text-xs text-gray-600">{employee.currentSalary}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Type d'avenant */}
        {selectedEmployee && !amendmentType && (
          <Card>
            <div className="mb-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedEmployee(null)}
              >
                ← Changer d'employé
              </Button>
            </div>
            <h2 className="text-xl font-semibold mb-4">Type de modification</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {amendmentTypes.map((type) => (
                <div
                  key={type.type}
                  onClick={() => setAmendmentType(type.type)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-blue-400 ${type.color}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{type.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Formulaire de modification */}
        {selectedEmployee && amendmentType && (
          <Card>
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedEmployee.name}</h3>
                <p className="text-sm text-gray-600">{selectedEmployee.currentPosition}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setAmendmentType("")}
              >
                ← Changer le type
              </Button>
            </div>

            <div className="space-y-4">
              {(amendmentType === "PROMOTION" || amendmentType === "TRANSFER") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau poste
                  </label>
                  <input
                    type="text"
                    value={formData.newPosition}
                    onChange={(e) => handleChange("newPosition", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    placeholder="Ex: Développeur Senior"
                  />
                </div>
              )}

              {(amendmentType === "PROMOTION" || amendmentType === "SALARY_INCREASE") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau salaire brut mensuel (€)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.newSalary}
                      onChange={(e) => handleChange("newSalary", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      placeholder="3500"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">
                      Actuel: {selectedEmployee.currentSalary}
                    </span>
                  </div>
                </div>
              )}

              {amendmentType === "TRANSFER" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau département
                  </label>
                  <select
                    value={formData.newDepartment}
                    onChange={(e) => handleChange("newDepartment", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="IT">IT</option>
                    <option value="RH">Ressources Humaines</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'effet
                </label>
                <input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => handleChange("effectiveDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motif de la modification
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => handleChange("reason", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  placeholder="Ex: Reconnaissance des compétences acquises et des résultats obtenus..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clauses additionnelles (optionnel)
                </label>
                <textarea
                  value={formData.additionalClauses}
                  onChange={(e) => handleChange("additionalClauses", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  placeholder="Ajoutez des clauses spécifiques si nécessaire..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => navigate("/app/contracts")}>
                Annuler
              </Button>
              <Button onClick={handleSubmit}>
                Générer l'Avenant
              </Button>
            </div>
          </Card>
        )}

        {/* Info Box */}
        <Card className="bg-purple-50 border-purple-200">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-900 mb-1">Avenant automatique</h4>
              <p className="text-sm text-purple-700">
                L'avenant sera généré automatiquement en reprenant les informations du contrat original 
                et en y intégrant les modifications spécifiées.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ContractPromotion;
