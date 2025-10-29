import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { employeesService } from "../../services";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { ArrowLeft, Clock, User, DollarSign, Building, Calendar, FileText } from "lucide-react";

const EmployeeHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [employeeData, historyData] = await Promise.all([
          employeesService.getById(parseInt(id)),
          employeesService.getHistory(parseInt(id))
        ]);
        setEmployee(employeeData);
        setHistory(historyData || []);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p>Chargement...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Employé non trouvé</h2>
          <Button onClick={() => navigate("/app/employees")}>
            Retour à la liste
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Ajouter l'événement d'embauche automatiquement
  const allEvents = [
    ...history,
    {
      id: 'hire',
      action: 'hire',
      date: employee.hire_date,
      modifiedBy: 'Système',
      reason: `Embauche en tant que ${employee.position}`
    }
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const getEventIcon = (action) => {
    switch (action) {
      case "salary_change":
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case "role_change":
        return <User className="w-5 h-5 text-secondary-600" />;
      case "department_change":
        return <Building className="w-5 h-5 text-purple-600" />;
      case "hire":
        return <Calendar className="w-5 h-5 text-green-600" />;
      case "document_added":
        return <FileText className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEventTitle = (action) => {
    switch (action) {
      case "salary_change":
        return "Modification de salaire";
      case "role_change":
        return "Changement de poste";
      case "department_change":
        return "Changement de département";
      case "hire":
        return "Embauche";
      case "document_added":
        return "Document ajouté";
      default:
        return "Modification";
    }
  };

  const getEventDescription = (event) => {
    switch (event.action) {
      case "salary_change":
        return `Salaire modifié de ${event.oldValue}€ à ${event.newValue}€`;
      case "role_change":
        return `Poste modifié de "${event.oldValue}" à "${event.newValue}"`;
      case "department_change":
        return `Département modifié de "${event.oldValue}" à "${event.newValue}"`;
      case "hire":
        return event.reason;
      default:
        return event.reason || 'Modification effectuée';
    }
  };

  const getEventBadgeVariant = (action) => {
    switch (action) {
      case "salary_change":
        return "success";
      case "role_change":
        return "info";
      case "department_change":
        return "warning";
      case "hire":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(`/app/employees/${id}`)}>
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Historique</h1>
            <p className="text-gray-600">{employee.first_name} {employee.last_name}</p>
          </div>
        </div>

        <Card title={`Historique des modifications (${allEvents.length})`}>
          {allEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun historique disponible</p>
            </div>
          ) : (
            <div className="space-y-6">
              {allEvents.map((event, index) => (
                <div key={event.id || index} className="relative">
                  {/* Ligne de connexion */}
                  {index < allEvents.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {getEventIcon(event.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{getEventTitle(event.action)}</h3>
                        <Badge variant={getEventBadgeVariant(event.action)} size="sm">
                          {new Date(event.date).toLocaleDateString("fr-FR")}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{getEventDescription(event)}</p>
                      <p className="text-sm text-gray-500">Par {event.modifiedBy}</p>
                      {event.reason && event.action !== 'hire' && (
                        <p className="text-sm text-gray-500 mt-1">Raison: {event.reason}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeHistory;