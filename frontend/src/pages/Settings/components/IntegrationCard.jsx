import React from "react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";

const IntegrationCard = ({ integration, onConnect, onDisconnect }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${integration.color}`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{integration.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
              <p className="text-sm text-gray-600">{integration.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Badge variant={integration.status === "connected" ? "success" : "default"}>
            {integration.status === "connected" ? "Connecté" : "Non connecté"}
          </Badge>
          <Button
            variant={integration.status === "connected" ? "outline" : "primary"}
            size="sm"
            onClick={() =>
              integration.status === "connected"
                ? onDisconnect?.(integration)
                : onConnect?.(integration)
            }
          >
            {integration.status === "connected" ? "Déconnecter" : "Connecter"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationCard;
