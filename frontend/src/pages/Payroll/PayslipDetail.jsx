import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHRStore } from "../../store/useHRStore";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { ArrowLeft, Download, Send } from "lucide-react";

const PayslipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { payrollRecords } = useHRStore();
  
  const payslip = payrollRecords.find((record) => record.id === parseInt(id));

  if (!payslip) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Fiche de paie non trouvée</h2>
          <Button onClick={() => navigate("/app/payroll")} className="mt-4">
            Retour
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/app/payroll")}>
              Retour
            </Button>
            <h1 className="text-3xl font-semibold tracking-tight">Fiche de paie</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" icon={Download}>
              Télécharger PDF
            </Button>
            {payslip.status === "pending" && (
              <Button icon={Send}>Envoyer à l'employé</Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{payslip.employeeName}</h2>
                  <p className="text-sm text-gray-600">{payslip.month}</p>
                </div>
                <Badge variant={payslip.status === "processed" ? "success" : "warning"}>
                  {payslip.status === "processed" ? "Traité" : "En attente"}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Rémunération brute</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Salaire de base</span>
                    <span className="font-medium text-gray-900">
                      {payslip.baseSalary.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bonus et primes</span>
                    <span className="font-medium text-green-600">
                      +{payslip.bonus.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="font-medium text-gray-900">Total brut</span>
                    <span className="font-semibold text-gray-900">
                      {(payslip.baseSalary + payslip.bonus).toLocaleString("fr-FR")} €
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Cotisations et déductions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sécurité sociale</span>
                    <span className="text-red-600">-{(payslip.deductions * 0.4).toLocaleString("fr-FR")} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Retraite</span>
                    <span className="text-red-600">-{(payslip.deductions * 0.3).toLocaleString("fr-FR")} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Assurance chômage</span>
                    <span className="text-red-600">-{(payslip.deductions * 0.2).toLocaleString("fr-FR")} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Autres cotisations</span>
                    <span className="text-red-600">-{(payslip.deductions * 0.1).toLocaleString("fr-FR")} €</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="font-medium text-gray-900">Total déductions</span>
                    <span className="font-semibold text-red-600">
                      -{payslip.deductions.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Net à payer</span>
                  <span className="text-2xl font-bold text-secondary-600">
                    {payslip.netSalary.toLocaleString("fr-FR")} €
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Informations">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mode de paiement</p>
                <p className="text-sm font-medium text-gray-900">Virement bancaire</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Date de paiement</p>
                <p className="text-sm font-medium text-gray-900">30 octobre 2025</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Période travaillée</p>
                <p className="text-sm font-medium text-gray-900">1-31 octobre 2025</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Heures travaillées</p>
                <p className="text-sm font-medium text-gray-900">151.67 heures</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PayslipDetail;
