import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { usersService } from "../../services";

const UserCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "",
    department: "",
    position: "",
    phone: "",
    is_active: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await usersService.create(formData);
      navigate("/settings/users");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">Créer un utilisateur</h1>
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
                <label className="block text-sm font-medium mb-1">Rôle</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded" required>
                  <option value="">Sélectionner un rôle</option>
                  <option value="employer">Employeur</option>
                  <option value="hr">RH</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Département</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Poste</label>
                <input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="mr-2" />
                <label className="text-sm font-medium">Compte actif</label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Création..." : "Créer"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/settings/users")}>
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserCreate;