import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { hrService } from "../../services";

const JobOpeningEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [jobOpening, setJobOpening] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    employment_type: "",
    description: "",
    requirements: "",
    salary_min: "",
    salary_max: "",
    status: ""
  });

  useEffect(() => {
    loadJobOpening();
  }, [id]);

  const loadJobOpening = async () => {
    try {
      setLoading(true);
      const data = await hrService.recruitment.getJobOpening(id);
      setJobOpening(data);
      setFormData({
        title: data.title || "",
        department: data.department || "",
        location: data.location || "",
        employment_type: data.employment_type || "",
        description: data.description || "",
        requirements: data.requirements || "",
        salary_min: data.salary_min || "",
        salary_max: data.salary_max || "",
        status: data.status || ""
      });
    } catch (error) {
      console.error("Erreur lors du chargement de l'offre:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await hrService.recruitment.updateJobOpening(id, formData);
      navigate("/recruitment");
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading && !jobOpening) return <div>Chargement...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">Modifier l'offre d'emploi</h1>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre du poste</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Département</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Localisation</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type d'emploi</label>
                <select name="employment_type" value={formData.employment_type} onChange={handleChange} className="w-full p-2 border rounded" required>
                  <option value="">Sélectionner</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Stage">Stage</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salaire minimum</label>
                <input type="number" name="salary_min" value={formData.salary_min} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salaire maximum</label>
                <input type="number" name="salary_max" value={formData.salary_max} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Exigences</label>
              <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows="4" className="w-full p-2 border rounded" required />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Modification..." : "Modifier"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/recruitment")}>
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default JobOpeningEdit;