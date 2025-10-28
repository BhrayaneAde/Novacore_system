import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { employeesService, hrService } from "../../services";
import { systemService } from "../../services/system";
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
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    // Étape 1: Template de contrat
    templateId: "",
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



  useEffect(() => {
    const loadData = async () => {
      try {
        const [employeesData, templatesData] = await Promise.all([
          employeesService.getAll(),
          systemService.contracts.getPredefinedTemplates()
        ]);
        setEmployees(employeesData.data || []);
        setTemplates(templatesData.data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setEmployees([]);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
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

        {/* Step 1: Template de contrat */}
        {step === 1 && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Choisissez un modèle de contrat</h2>
            {loading ? (
              <div className="text-center py-8">
                <p>Chargement des modèles...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <ContractTemplate
                    key={template.id}
                    template={template}
                    selected={formData.templateId === template.id}
                    onClick={() => {
                      setSelectedTemplate(template);
                      handleChange("templateId", template.id);
                      handleChange("contractType", template.type);
                    }}
                  />
                ))}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button onClick={handleNext} disabled={!formData.templateId}>
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
