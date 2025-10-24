import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { performanceService } from "../../services";

const ReviewEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: "",
    reviewer_id: "",
    period_start: "",
    period_end: "",
    overall_rating: "",
    goals_achievement: "",
    strengths: "",
    areas_for_improvement: "",
    development_plan: "",
    comments: ""
  });

  useEffect(() => {
    loadReview();
  }, [id]);

  const loadReview = async () => {
    try {
      setLoading(true);
      const data = await performanceService.getEvaluation(id);
      setReview(data);
      setFormData({
        employee_id: data.employee_id || "",
        reviewer_id: data.reviewer_id || "",
        period_start: data.period_start || "",
        period_end: data.period_end || "",
        overall_rating: data.overall_rating || "",
        goals_achievement: data.goals_achievement || "",
        strengths: data.strengths || "",
        areas_for_improvement: data.areas_for_improvement || "",
        development_plan: data.development_plan || "",
        comments: data.comments || ""
      });
    } catch (error) {
      console.error("Erreur lors du chargement de l'évaluation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await performanceService.updateEvaluation(id, formData);
      navigate("/performance");
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading && !review) return <div>Chargement...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">Modifier l'évaluation</h1>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Début de période</label>
                <input type="date" name="period_start" value={formData.period_start} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fin de période</label>
                <input type="date" name="period_end" value={formData.period_end} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Note globale</label>
                <select name="overall_rating" value={formData.overall_rating} onChange={handleChange} className="w-full p-2 border rounded" required>
                  <option value="">Sélectionner</option>
                  <option value="1">1 - Insuffisant</option>
                  <option value="2">2 - Partiellement satisfaisant</option>
                  <option value="3">3 - Satisfaisant</option>
                  <option value="4">4 - Bon</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Atteinte des objectifs (%)</label>
                <input type="number" name="goals_achievement" value={formData.goals_achievement} onChange={handleChange} min="0" max="100" className="w-full p-2 border rounded" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Points forts</label>
              <textarea name="strengths" value={formData.strengths} onChange={handleChange} rows="3" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Axes d'amélioration</label>
              <textarea name="areas_for_improvement" value={formData.areas_for_improvement} onChange={handleChange} rows="3" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Plan de développement</label>
              <textarea name="development_plan" value={formData.development_plan} onChange={handleChange} rows="3" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Commentaires</label>
              <textarea name="comments" value={formData.comments} onChange={handleChange} rows="3" className="w-full p-2 border rounded" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Modification..." : "Modifier"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/performance")}>
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReviewEdit;