import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Clock } from "lucide-react";

const TimeTracking = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Suivi du temps</h1>
        <Card>
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Système de pointage à implémenter</p>
            <Button>Pointer l'arrivée</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TimeTracking;
