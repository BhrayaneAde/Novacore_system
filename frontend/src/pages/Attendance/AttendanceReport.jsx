import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";

const AttendanceReport = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Rapports de présence</h1>
        <Card>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Taux de présence moyen</p>
                <p className="text-2xl font-semibold text-gray-900">96.8%</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Jours travaillés</p>
                <p className="text-2xl font-semibold text-gray-900">4,523</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Absences</p>
                <p className="text-2xl font-semibold text-gray-900">147</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceReport;
