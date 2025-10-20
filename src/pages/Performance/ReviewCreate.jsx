import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHRStore } from "../../store/useHRStore";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ArrowLeft, Save } from "lucide-react";

const ReviewCreate = () => {
  const navigate = useNavigate();
  const { employees, addPerformanceReview } = useHRStore();
  
  const [formData, setFormData] = useState({
    employeeId: "",
    period: "",
    rating: 3,
    feedback: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const employee = employees.find((emp) => emp.id === parseInt(formData.employeeId));
    addPerformanceReview({
      ...formData,
      employeeName: employee?.name || "",
      reviewDate: new Date().toISOString().split("T")[0],
      goals: [],
    });
    navigate("/app/performance");
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
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un employé</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.role}
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
                  name="rating"
                  min="1"
                  max="5"
                  step="0.5"
                  value={formData.rating}
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
                  placeholder="Commentaires sur la performance..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => navigate("/app/performance")} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" icon={Save} className="flex-1">
                Créer l'évaluation
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ReviewCreate;
