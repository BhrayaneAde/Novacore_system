import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useHRStore } from "../../store/useHRStore";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import SearchInput from "../../components/ui/SearchInput";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import { UserPlus, Search, Filter, X, Download, Trash2, Edit, Eye } from "lucide-react";
import Loader from "../../components/ui/Loader";

const EmployeesList = () => {
  const navigate = useNavigate();
  const { employees, deleteEmployee, getEmployeeStats } = useHRStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, employee: null });
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  
  const stats = getEmployeeStats();

  // Filtrage et tri des employés
  const filteredEmployees = useMemo(() => {
    let filtered = employees.filter(emp => {
      const matchesSearch = searchQuery === "" || 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "" || emp.status === statusFilter;
      const matchesDepartment = departmentFilter === "" || emp.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });

    // Tri
    if (sortField) {
      filtered.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (sortField === 'hireDate') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [employees, searchQuery, statusFilter, departmentFilter, sortField, sortDirection]);

  const departments = [...new Set(employees.map(emp => emp.department))];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setDepartmentFilter("");
    setSortField("");
    setSortDirection("asc");
  };
  
  const handleDelete = (employee) => {
    setDeleteDialog({ isOpen: true, employee });
  };
  
  const confirmDelete = () => {
    if (deleteDialog.employee) {
      deleteEmployee(deleteDialog.employee.id);
      setDeleteDialog({ isOpen: false, employee: null });
    }
  };
  
  const exportToCSV = () => {
    const headers = ['Nom', 'Email', 'Poste', 'Département', 'Salaire', 'Date d\'embauche', 'Statut'];
    const csvData = filteredEmployees.map(emp => [
      emp.name,
      emp.email,
      emp.role,
      emp.department,
      emp.salary,
      emp.hireDate,
      emp.status === 'active' ? 'Actif' : 'En congé'
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `employes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const columns = [
    {
      header: "Employé",
      accessor: "name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar 
            src={row.avatar} 
            name={row.name} 
            size="md"
          />
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
      sortable: true,
      render: (row) => <span className="text-sm text-gray-900">{row.role}</span>,
    },
    {
      header: "Département",
      accessor: "department",
      sortable: true,
      render: (row) => <StatusBadge variant="info">{row.department}</StatusBadge>,
    },
    {
      header: "Date d'embauche",
      accessor: "hireDate",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.hireDate).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      header: "Statut",
      accessor: "status",
      sortable: true,
      render: (row) => (
        <StatusBadge status={row.status === "active" ? "active" : "pending"}>
          {row.status === "active" ? "Actif" : "En congé"}
        </StatusBadge>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/app/employees/${row.id}`)}
            className="p-1 text-secondary-600 hover:text-secondary-700"
            title="Voir détails"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/app/employees/${row.id}/edit`)}
            className="p-1 text-green-600 hover:text-green-700"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1 text-red-600 hover:text-red-700"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-2 tracking-tight">Employés</h1>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span>{filteredEmployees.length} sur {employees.length} employés</span>
              <span className="text-green-600">{stats.active} actifs</span>
              <span className="text-orange-600">{stats.onLeave} en congé</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" icon={Download} onClick={exportToCSV}>
              Exporter CSV
            </Button>
            <Button icon={UserPlus} onClick={() => navigate("/app/employees/new")}>
              Ajouter un employé
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Filtres et recherche</h3>
              {(searchQuery || statusFilter || departmentFilter) && (
                <Button variant="outline" size="sm" icon={X} onClick={clearFilters}>
                  Effacer les filtres
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recherche
                </label>
                <SearchInput
                  placeholder="Nom, email, poste..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="on_leave">En congé</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Département
                </label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                >
                  <option value="">Tous les départements</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trier par
                </label>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                >
                  <option value="">Aucun tri</option>
                  <option value="name">Nom</option>
                  <option value="role">Poste</option>
                  <option value="department">Département</option>
                  <option value="hireDate">Date d'embauche</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <Table 
            columns={columns} 
            data={filteredEmployees} 
            onRowClick={(row) => navigate(`/app/employees/${row.id}`)} 
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        </Card>
        
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, employee: null })}
          onConfirm={confirmDelete}
          title="Supprimer l'employé"
          message={`Êtes-vous sûr de vouloir supprimer ${deleteDialog.employee?.name} ? Cette action est irréversible.`}
          confirmText="Supprimer"
          type="danger"
        />
      </div>
    </DashboardLayout>
  );
};

export default EmployeesList;
