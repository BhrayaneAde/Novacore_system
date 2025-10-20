import React, { useState } from "react";
import { useHRStore } from "../../../store/useHRStore";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Modal from "../../../components/ui/Modal";
import { UserPlus, Mail, Phone, Calendar } from "lucide-react";

const EmployeesPage = () => {
  const { employees, addEmployee } = useHRStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    phone: "",
    salary: "",
  });

  const handleAddEmployee = () => {
    addEmployee({
      ...newEmployee,
      status: "active",
      hireDate: new Date().toISOString().split("T")[0],
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    });
    setIsModalOpen(false);
    setNewEmployee({ name: "", email: "", role: "", department: "", phone: "", salary: "" });
  };

  const columns = [
    {
      header: "Employé",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt={row.name} className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-sm font-medium text-gray-900">{row.name}</p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Poste",
      accessor: "role",
      render: (row) => <span className="text-sm text-gray-900">{row.role}</span>,
    },
    {
      header: "Département",
      accessor: "department",
      render: (row) => <Badge variant="info">{row.department}</Badge>,
    },
    {
      header: "Statut",
      accessor: "status",
      render: (row) => (
        <Badge variant={row.status === "active" ? "success" : "warning"}>
          {row.status === "active" ? "Actif" : "En congé"}
        </Badge>
      ),
    },
    {
      header: "Date d'embauche",
      accessor: "hireDate",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.hireDate).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Voir détails
        </button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-2 tracking-tight">Gestion des employés</h1>
            <p className="text-gray-600">
              {employees.length} employé{employees.length > 1 ? "s" : ""} au total
            </p>
          </div>
          <Button icon={UserPlus} onClick={() => setIsModalOpen(true)}>
            Ajouter un employé
          </Button>
        </div>

        <Card>
          <Table columns={columns} data={employees} />
        </Card>
      </div>

      {/* Modal d'ajout d'employé */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un nouvel employé"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Jean Dupont"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="jean.dupont@novacore.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
            <input
              type="text"
              value={newEmployee.role}
              onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Développeur Full Stack"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
            <select
              value={newEmployee.department}
              onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un département</option>
              <option value="Développement">Développement</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Ventes">Ventes</option>
              <option value="Support">Support</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              value={newEmployee.phone}
              onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+33 6 12 34 56 78"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salaire annuel (€)</label>
            <input
              type="number"
              value={newEmployee.salary}
              onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="50000"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleAddEmployee} className="flex-1">
              Ajouter
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default EmployeesPage;
