import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const CandidateTracking = () => {
  const pipeline = [
    { stage: "Présélection", count: 12, color: "bg-gray-100" },
    { stage: "Entretien RH", count: 5, color: "bg-blue-100" },
    { stage: "Entretien technique", count: 3, color: "bg-purple-100" },
    { stage: "Offre", count: 1, color: "bg-green-100" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Suivi des candidatures</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {pipeline.map((stage, index) => (
            <Card key={index} className={stage.color}>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-2">{stage.count}</p>
                <p className="text-sm font-medium text-gray-700">{stage.stage}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card title="Candidats en cours">
          <div className="space-y-3">
            {["Alice Dupont", "Marc Lambert", "Julie Petit"].map((name, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <span className="font-medium text-gray-900">{name}</span>
                <Badge variant="info">Entretien</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CandidateTracking;
