import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ArrowLeft, Bell, Save } from "lucide-react";

const NotificationSettings = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    email: {
      newEmployee: true,
      leaveRequest: true,
      payrollProcessed: false,
      performanceReview: true,
      newApplication: true,
    },
    push: {
      newEmployee: false,
      leaveRequest: true,
      payrollProcessed: false,
      performanceReview: false,
      newApplication: true,
    },
    slack: {
      newEmployee: true,
      leaveRequest: true,
      payrollProcessed: true,
      performanceReview: false,
      newApplication: true,
    },
  });

  const notificationTypes = [
    { key: "newEmployee", label: "Nouvel employé" },
    { key: "leaveRequest", label: "Demande de congé" },
    { key: "payrollProcessed", label: "Paie traitée" },
    { key: "performanceReview", label: "Évaluation de performance" },
    { key: "newApplication", label: "Nouvelle candidature" },
  ];

  const channels = [
    { key: "email", label: "Email" },
    { key: "push", label: "Push" },
    { key: "slack", label: "Slack" },
  ];

  const handleToggle = (channel, type) => {
    setNotifications({
      ...notifications,
      [channel]: {
        ...notifications[channel],
        [type]: !notifications[channel][type],
      },
    });
  };

  const handleSave = () => {
    alert("Préférences de notifications sauvegardées !");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/app/settings")}>
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type de notification
                  </th>
                  {channels.map((channel) => (
                    <th key={channel.key} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      {channel.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {notificationTypes.map((type) => (
                  <tr key={type.key}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {type.label}
                    </td>
                    {channels.map((channel) => (
                      <td key={channel.key} className="px-6 py-4 text-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[channel.key][type.key]}
                            onChange={() => handleToggle(channel.key, type.key)}
                            className="w-5 h-5 text-secondary-600 border-gray-300 rounded focus:ring-secondary-500"
                          />
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
            <Button icon={Save} onClick={handleSave}>
              Enregistrer les préférences
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NotificationSettings;
