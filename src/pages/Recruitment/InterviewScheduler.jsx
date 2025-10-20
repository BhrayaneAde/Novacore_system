import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Calendar, Plus } from "lucide-react";

const InterviewScheduler = () => {
  const interviews = [
    { id: 1, candidate: "Alice Dupont", date: "2025-10-25", time: "10:00", interviewer: "Marie Dubois" },
    { id: 2, candidate: "Marc Lambert", date: "2025-10-26", time: "14:00", interviewer: "Sophie Martin" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Planification des entretiens</h1>
          <Button icon={Plus}>Planifier un entretien</Button>
        </div>

        <Card>
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{interview.candidate}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(interview.date).toLocaleDateString("fr-FR")} à {interview.time}
                    </p>
                    <p className="text-sm text-gray-500">Avec {interview.interviewer}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Modifier</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InterviewScheduler;
