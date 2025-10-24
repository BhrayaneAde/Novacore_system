import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { employeesService } from "../../services";

const ContractEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: "",
    contract_type: "",
    start_date: "",
    end_date: "",
    salary: "",
    position: "",
    department: ""
  });

  useEffect(() => {
    loadContract();
  }, [id]);

  const loadContract = async () => {
    try {
      setLoading(true);
      const data = await employeesService.getContract(id);
      setContract(data);
      setFormData({
        employee_id: data.employee_id || "",
        contract_type: data.contract_type || "",
        start_date: data.start_date || "",
        end_date: data.end_date || "",
        salary: data.salary || "",
        position: data.position || "",
        department: data.department || ""
      });
    } catch (error) {
      console.error("Erreur lors du chargement du contrat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await employeesService.updateContract(id, formData);
      navigate("/contracts");
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading && !contract) return <div>Chargement...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">Modifier le contrat</h1>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type de contrat</label>
                <select name="contract_type" value={formData.contract_type} onChange={handleChange} className="w-full p-2 border rounded" required>
                  <option value="">Sélectionner</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Stage">Stage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Poste</label>
                <input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date de début</label>
                <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date de fin</label>
                <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salaire</label>
                <input type="number" name="salary" value={formData.salary} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Département</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Modification..." : "Modifier"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/contracts")}>
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ContractEdit;