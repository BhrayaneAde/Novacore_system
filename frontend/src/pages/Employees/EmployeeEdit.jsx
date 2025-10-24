import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { employeesService } from "../../services";

const EmployeeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    hire_date: "",
    salary: "",
    manager_id: ""
  });

  useEffect(() => {
    loadEmployee();
  }, [id]);

  const loadEmployee = async () => {
    try {
      setLoading(true);
      const data = await employeesService.getById(id);
      setEmployee(data);
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        position: data.position || "",
        department: data.department || "",
        hire_date: data.hire_date || "",
        salary: data.salary || "",
        manager_id: data.manager_id || ""
      });
    } catch (error) {
      console.error("Erreur lors du chargement de l'employé:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await employeesService.update(id, formData);
      navigate("/employees");
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading && !employee) return <div>Chargement...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">Modifier l'employé</h1>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Prénom</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Poste</label>
                <input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Département</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date d'embauche</label>
                <input type="date" name="hire_date" value={formData.hire_date} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salaire</label>
                <input type="number" name="salary" value={formData.salary} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Modification..." : "Modifier"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/employees")}>
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeEdit;