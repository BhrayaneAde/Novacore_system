import React from "react";
import { Check } from "lucide-react";

const EmployeeSelector = ({ employees, selectedId, onSelect }) => {
  return (
    <div className="space-y-3">
      {employees.map((employee) => (
        <div
          key={employee.id}
          onClick={() => onSelect(employee)}
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            selectedId === employee.id
              ? "border-blue-500 bg-blue-50 shadow-md"
              : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center gap-4">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{employee.name}</h3>
              <p className="text-sm text-gray-600">{employee.department}</p>
              {employee.currentPosition && (
                <p className="text-xs text-gray-500 mt-1">{employee.currentPosition}</p>
              )}
            </div>
            {selectedId === employee.id && (
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeSelector;
