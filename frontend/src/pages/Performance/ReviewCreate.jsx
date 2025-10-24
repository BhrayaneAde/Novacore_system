import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { performanceService, employeesService } from "../../services";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ArrowLeft, Save } from "lucide-react";

const ReviewCreate = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: "",
    period: "",
    overall_score: 3,
    feedback: "",
    goals: [],
    strengths: "",
    areas_for_improvement: "",
  });

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeesData = await employeesService.getAll();
        setEmployees(employeesData.data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des employés:', error);
      }
    };
    loadEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await performanceService.createEvaluation({
        employee_id: parseInt(formData.employee_id),
        period: formData.period,
        overall_score: parseFloat(formData.overall_score),
        feedback: formData.feedback,
        strengths: formData.strengths,
        areas_for_improvement: formData.areas_for_improvement,
        goals: formData.goals,
      });
      navigate("/app/performance");
    } catch (error) {
      console.error('Erreur lors de la création de l\'évaluation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/app/performance")}>
            Retour
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight">Nouvelle évaluation</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employé *
                </label>
                <select
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un employé</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name} - {emp.position}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Période *
                </label>
                <input
                  type="text"
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Q4 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (1-5) *
                </label>
                <input
                  type="number"
                  name="overall_score"
                  min="1"
                  max="5"
                  step="0.5"
                  value={formData.overall_score}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback *
                </label>
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Commentaires généraux sur la performance..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points forts
                </label>
                <textarea
                  name="strengths"
                  value={formData.strengths}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Points forts identifiés..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Axes d'amélioration
                </label>
                <textarea
                  name="areas_for_improvement"
                  value={formData.areas_for_improvement}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Domaines à améliorer..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => navigate("/app/performance")} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" icon={Save} className="flex-1" disabled={loading}>
                {loading ? 'Création...' : 'Créer l\'évaluation'}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ReviewCreate;
