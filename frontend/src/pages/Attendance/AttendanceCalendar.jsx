import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const AttendanceCalendar = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Calendrier des présences</h1>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600">Calendrier interactif à implémenter</p>
            <p className="text-sm text-gray-500 mt-2">Utilisez une bibliothèque comme FullCalendar ou React Big Calendar</p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceCalendar;
