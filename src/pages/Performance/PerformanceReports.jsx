import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import { TrendingUp, Award, Target } from "lucide-react";

const PerformanceReports = () => {
  const stats = [
    { label: "Note moyenne", value: "4.3/5", icon: Award, color: "bg-purple-50 text-purple-600" },
    { label: "Objectifs atteints", value: "87%", icon: Target, color: "bg-green-50 text-green-600" },
    { label: "Progression", value: "+12%", icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Rapports de performance</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card title="Tendances mensuelles">
          <div className="h-64 flex items-center justify-center text-gray-500">
            Graphique de tendances à implémenter
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PerformanceReports;
