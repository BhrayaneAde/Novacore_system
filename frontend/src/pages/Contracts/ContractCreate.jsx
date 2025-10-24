import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { employeesService, hrService } from "../../services";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { FileText, User, Calendar, CheckCircle } from "lucide-react";

// Import des composants
import ContractTemplate from "./components/ContractTemplate";
import EmployeeSelector from "./components/EmployeeSelector";
import ContractForm from "./components/ContractForm";
import ProgressSteps from "./components/ProgressSteps";
import ContractSummary from "./components/ContractSummary";

const ContractCreate = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    // Étape 1: Type de contrat
    contractType: "",
    
    // Étape 2: Employé
    employeeId: "",
    employeeName: "",
    
    // Étape 3: Détails du contrat
    position: "",
    department: "",
    startDate: "",
    endDate: "",
    salary: "",
    workingHours: "35",
    trialPeriod: "",
    
    // Étape 4: Informations complémentaires
    workplace: "",
    benefits: [],
    specificClauses: "",
  });

  const contractTemplates = [
    {
      type: "CDI",
      name: "Contrat à Durée Indéterminée",
      description: "Contrat permanent sans date de fin",
      icon: "📄",
      color: "bg-green-50 border-green-200 hover:border-green-400",
      popular: true
    },
    {
      type: "CDD",
      name: "Contrat à Durée Déterminée",
      description: "Contrat temporaire avec date de fin",
      icon: "📅",
      color: "bg-blue-50 border-blue-200 hover:border-blue-400",
      popular: true
    },
    {
      type: "STAGE",
      name: "Convention de Stage",
      description: "Stage étudiant avec convention tripartite",
      icon: "🎓",
      color: "bg-purple-50 border-purple-200 hover:border-purple-400",
    },
    {
      type: "ALTERNANCE",
      name: "Contrat d'Alternance",
      description: "Apprentissage ou professionnalisation",
      icon: "🎯",
      color: "bg-orange-50 border-orange-200 hover:border-orange-400",
    },
    {
      type: "INTERIM",
      name: "Contrat d'Intérim",
      description: "Mission temporaire via agence",
      icon: "⚡",
      color: "bg-yellow-50 border-yellow-200 hover:border-yellow-400",
    },
    {
      type: "FREELANCE",
      name: "Contrat Freelance",
      description: "Prestation de service indépendant",
      icon: "💼",
      color: "bg-indigo-50 border-indigo-200 hover:border-indigo-400",
    },
  ];

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

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      const contract = await hrService.contracts.create(formData);
      navigate("/app/contracts/preview", { state: { contractData: contract } });
    } catch (error) {
      console.error('Erreur lors de la création du contrat:', error);
    }
  };

  const steps = [
    { num: 1, label: "Type", icon: FileText },
    { num: 2, label: "Employé", icon: User },
    { num: 3, label: "Détails", icon: Calendar },
    { num: 4, label: "Finalisation", icon: CheckCircle },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2 tracking-tight">Créer un Nouveau Contrat</h1>
          <p className="text-gray-600">Générez automatiquement un contrat personnalisé</p>
        </div>

        {/* Progress Steps */}
        <Card>
          <ProgressSteps steps={steps} currentStep={step} />
        </Card>

        {/* Step 1: Type de contrat */}
        {step === 1 && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Choisissez un type de contrat</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {contractTemplates.map((template) => (
                <ContractTemplate
                  key={template.type}
                  type={template.type}
                  name={template.name}
                  description={template.description}
                  icon={template.icon}
                  selected={formData.contractType === template.type}
                  onClick={() => handleChange("contractType", template.type)}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleNext} disabled={!formData.contractType}>
                Suivant
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Sélection employé */}
        {step === 2 && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Sélectionnez un employé</h2>
            {loading ? (
              <div className="text-center py-8">
                <p>Chargement des employés...</p>
              </div>
            ) : (
              <EmployeeSelector
                employees={employees}
                selectedId={formData.employeeId}
                onSelect={(employee) => {
                  handleChange("employeeId", employee.id);
                  handleChange("employeeName", `${employee.first_name} ${employee.last_name}`);
                }}
              />
            )}
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>
                Précédent
              </Button>
              <Button onClick={handleNext} disabled={!formData.employeeId}>
                Suivant
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Détails du contrat */}
        {step === 3 && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Détails du contrat</h2>
            <ContractForm
              formData={formData}
              onChange={handleChange}
              contractType={formData.contractType}
            />
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>
                Précédent
              </Button>
              <Button onClick={handleNext}>
                Suivant
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Finalisation */}
        {step === 4 && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
            <ContractSummary contractData={formData} />
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>
                Précédent
              </Button>
              <Button onClick={handleSubmit}>
                Générer le Contrat
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ContractCreate;
