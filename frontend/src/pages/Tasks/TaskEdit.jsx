import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { tasksService } from "../../services";

const TaskEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: "",
    priority: "",
    status: "",
    due_date: "",
    category: "",
    estimated_hours: ""
  });

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const data = await tasksService.getById(id);
      setTask(data);
      setFormData({
        title: data.title || "",
        description: data.description || "",
        assigned_to: data.assigned_to || "",
        priority: data.priority || "",
        status: data.status || "",
        due_date: data.due_date || "",
        category: data.category || "",
        estimated_hours: data.estimated_hours || ""
      });
    } catch (error) {
      console.error("Erreur lors du chargement de la tâche:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await tasksService.update(id, formData);
      navigate("/tasks");
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading && !task) return <div>Chargement...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">Modifier la tâche</h1>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Titre</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full p-2 border rounded" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Priorité</label>
                <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2 border rounded" required>
                  <option value="">Sélectionner</option>
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded" required>
                  <option value="">Sélectionner</option>
                  <option value="todo">À faire</option>
                  <option value="in_progress">En cours</option>
                  <option value="review">En révision</option>
                  <option value="completed">Terminée</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date d'échéance</label>
                <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Heures estimées</label>
              <input type="number" name="estimated_hours" value={formData.estimated_hours} onChange={handleChange} min="0" step="0.5" className="w-full p-2 border rounded" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Modification..." : "Modifier"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/tasks")}>
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TaskEdit;