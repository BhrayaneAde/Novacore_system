import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const PayrollHistory = () => {
  const history = [
    { id: 1, month: "Octobre 2025", total: 133700, employees: 6, status: "processed" },
    { id: 2, month: "Septembre 2025", total: 130500, employees: 6, status: "processed" },
    { id: 3, month: "Août 2025", total: 128900, employees: 5, status: "processed" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Historique des paies</h1>

        <Card>
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.month}</h3>
                  <p className="text-sm text-gray-600">{item.employees} employés</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {item.total.toLocaleString("fr-FR")} €
                    </p>
                    <Badge variant="success">Traité</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PayrollHistory;
