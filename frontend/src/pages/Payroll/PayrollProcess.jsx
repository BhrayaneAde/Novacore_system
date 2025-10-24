import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ArrowLeft, Play, CheckCircle } from "lucide-react";

const PayrollProcess = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, title: "Sélection de la période", completed: true },
    { id: 2, title: "Vérification des données", completed: false },
    { id: 3, title: "Calcul des salaires", completed: false },
    { id: 4, title: "Validation finale", completed: false },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/app/payroll")}>
            Retour
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight">Traiter la paie</h1>
        </div>

        <Card>
          <div className="space-y-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-between">
              {steps.map((s, index) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        s.completed || s.id === step
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {s.completed ? <CheckCircle className="w-5 h-5" /> : s.id}
                    </div>
                    <span className="text-sm font-medium text-gray-700 mt-2">{s.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 ${s.completed ? "bg-blue-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="py-8">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Sélectionner la période</h3>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Octobre 2025</option>
                    <option>Septembre 2025</option>
                    <option>Août 2025</option>
                  </select>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button variant="outline" className="flex-1">
                Annuler
              </Button>
              <Button icon={Play} className="flex-1" onClick={() => setStep(step + 1)}>
                Continuer
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PayrollProcess;
