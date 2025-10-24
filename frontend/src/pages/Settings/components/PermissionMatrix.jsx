import React from "react";
import { Check, X } from "lucide-react";

const PermissionMatrix = ({ permissions, modules, actions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Module
            </th>
            {actions.map((action) => (
              <th key={action.key} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                {action.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {modules.map((module) => (
            <tr key={module.key}>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {module.label}
              </td>
              {actions.map((action) => (
                <td key={action.key} className="px-4 py-3 text-center">
                  {permissions[module.key]?.[action.key] ? (
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-gray-300 mx-auto" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionMatrix;
