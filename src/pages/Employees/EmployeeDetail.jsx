import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHRStore } from "../../store/useHRStore";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Edit, Mail, Phone, Calendar, MapPin, Briefcase, ArrowLeft } from "lucide-react";

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees } = useHRStore();
  
  const employee = employees.find((emp) => emp.id === parseInt(id));

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Employé non trouvé</h2>
          <Button onClick={() => navigate("/app/employees")} className="mt-4">
            Retour à la liste
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/app/employees")}>
              Retour
            </Button>
            <h1 className="text-3xl font-semibold tracking-tight">Profil de l'employé</h1>
          </div>
          <Button icon={Edit} onClick={() => navigate(`/app/employees/${id}/edit`)}>
            Modifier
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte principale */}
          <Card className="lg:col-span-2">
            <div className="flex items-start gap-6">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-24 h-24 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-semibold text-gray-900">{employee.name}</h2>
                  <Badge variant={employee.status === "active" ? "success" : "warning"}>
                    {employee.status === "active" ? "Actif" : "En congé"}
                  </Badge>
                </div>
                <p className="text-lg text-gray-600 mb-4">{employee.role}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Embauché le {new Date(employee.hireDate).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Carte statistiques */}
          <Card title="Statistiques">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Salaire annuel</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {employee.salary?.toLocaleString("fr-FR")} €
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Ancienneté</p>
                <p className="text-lg font-medium text-gray-900">
                  {Math.floor((new Date() - new Date(employee.hireDate)) / (365 * 24 * 60 * 60 * 1000))} ans
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Congés restants</p>
                <p className="text-lg font-medium text-gray-900">15 jours</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Onglets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Informations personnelles">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Date de naissance</p>
                <p className="text-sm text-gray-600">15 mars 1990</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Adresse</p>
                <p className="text-sm text-gray-600">123 Rue de Paris, 75001 Paris</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Numéro de sécurité sociale</p>
                <p className="text-sm text-gray-600">1 90 03 75 001 123 45</p>
              </div>
            </div>
          </Card>

          <Card title="Actions rapides">
            <div className="space-y-3">
              <Button variant="outline" className="w-full" onClick={() => navigate(`/app/employees/${id}/documents`)}>
                Voir les documents
              </Button>
              <Button variant="outline" className="w-full">
                Historique des congés
              </Button>
              <Button variant="outline" className="w-full">
                Évaluations de performance
              </Button>
              <Button variant="outline" className="w-full">
                Fiches de paie
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDetail;
