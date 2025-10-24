import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { MessageSquare } from "lucide-react";

const FeedbackSystem = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Système de feedback 360°</h1>

        <Card>
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Feedback 360°</h3>
            <p className="text-gray-600 mb-6">
              Collectez des retours de la part des collègues, managers et subordonnés
            </p>
            <Button>Demander un feedback</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FeedbackSystem;
