import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Plus, Gift } from "lucide-react";

const BenefitsManagement = () => {
  const benefits = [
    { id: 1, name: "Tickets restaurant", value: "9€/jour", employees: 247 },
    { id: 2, name: "Mutuelle santé", value: "100%", employees: 247 },
    { id: 3, name: "Transport", value: "50%", employees: 180 },
    { id: 4, name: "Télétravail", value: "2.5€/jour", employees: 150 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Gestion des avantages</h1>
          <Button icon={Plus}>Ajouter un avantage</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit) => (
            <Card key={benefit.id}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                  <Gift className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{benefit.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">Valeur: {benefit.value}</p>
                  <p className="text-sm text-gray-500">{benefit.employees} bénéficiaires</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BenefitsManagement;
