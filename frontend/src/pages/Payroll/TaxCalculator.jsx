import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Calculator } from "lucide-react";

const TaxCalculator = () => {
  const [salary, setSalary] = useState(50000);

  const calculateTaxes = (gross) => {
    const socialSecurity = gross * 0.22;
    const retirement = gross * 0.10;
    const unemployment = gross * 0.05;
    const other = gross * 0.03;
    const total = socialSecurity + retirement + unemployment + other;
    const net = gross - total;

    return { socialSecurity, retirement, unemployment, other, total, net };
  };

  const taxes = calculateTaxes(salary);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Calculateur d'impôts</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Salaire brut annuel">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant (€)
                </label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button icon={Calculator} className="w-full">
                Calculer
              </Button>
            </div>
          </Card>

          <Card title="Détail des cotisations">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sécurité sociale (22%)</span>
                <span className="font-medium text-gray-900">
                  {taxes.socialSecurity.toLocaleString("fr-FR")} €
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Retraite (10%)</span>
                <span className="font-medium text-gray-900">
                  {taxes.retirement.toLocaleString("fr-FR")} €
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Chômage (5%)</span>
                <span className="font-medium text-gray-900">
                  {taxes.unemployment.toLocaleString("fr-FR")} €
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Autres (3%)</span>
                <span className="font-medium text-gray-900">
                  {taxes.other.toLocaleString("fr-FR")} €
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Total cotisations</span>
                  <span className="font-semibold text-red-600">
                    -{taxes.total.toLocaleString("fr-FR")} €
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 bg-blue-50 p-4 rounded-lg -mx-6 -mb-6 mt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Salaire net</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {taxes.net.toLocaleString("fr-FR")} €
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TaxCalculator;
