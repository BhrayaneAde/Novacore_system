import React from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../../../components/ui/Badge";
import { Mail, Phone } from "lucide-react";

const EmployeeCard = ({ employee }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/app/employees/${employee.id}`)}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <img
          src={employee.avatar}
          alt={employee.name}
          className="w-16 h-16 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
            <Badge variant={employee.status === "active" ? "success" : "warning"}>
              {employee.status === "active" ? "Actif" : "En congé"}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-3">{employee.role}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              <span>{employee.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Phone className="w-4 h-4" />
              <span>{employee.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
