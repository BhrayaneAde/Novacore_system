import React from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../../../components/ui/Badge";
import { DollarSign } from "lucide-react";

const PayslipCard = ({ payslip }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/app/payroll/payslips/${payslip.id}`)}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{payslip.employeeName}</h3>
            <p className="text-sm text-gray-600">{payslip.month}</p>
          </div>
        </div>
        <Badge variant={payslip.status === "processed" ? "success" : "warning"}>
          {payslip.status === "processed" ? "Traité" : "En attente"}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Salaire brut</span>
          <span className="font-medium text-gray-900">
            {payslip.baseSalary.toLocaleString("fr-FR")} €
          </span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
          <span className="font-medium text-gray-900">Net à payer</span>
          <span className="font-bold text-blue-600">
            {payslip.netSalary.toLocaleString("fr-FR")} €
          </span>
        </div>
      </div>
    </div>
  );
};

export default PayslipCard;
