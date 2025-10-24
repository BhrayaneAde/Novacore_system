import React, { useState, useEffect } from "react";
import { hrService } from "../../services";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const CandidateTracking = () => {
  const [pipeline, setPipeline] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pipelineData, candidatesData] = await Promise.all([
          hrService.recruitment.getPipeline(),
          hrService.recruitment.getActiveCandidates()
        ]);
        setPipeline(pipelineData || []);
        setCandidates(candidatesData || []);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        setPipeline([]);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Suivi des candidatures</h1>

        {loading ? (
          <div className="text-center py-8">
            <p>Chargement des données...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {pipeline.map((stage, index) => (
            <Card key={index} className={stage.color}>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-2">{stage.count}</p>
                <p className="text-sm font-medium text-gray-700">{stage.stage}</p>
              </div>
            </Card>
            ))}
          </div>
        )}

        {!loading && (
          <Card title="Candidats en cours">
            <div className="space-y-3">
              {candidates.length === 0 ? (
                <p className="text-center py-4 text-gray-500">Aucun candidat en cours</p>
              ) : (
                candidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <span className="font-medium text-gray-900">{candidate.first_name} {candidate.last_name}</span>
                    <Badge variant="info">{candidate.status}</Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CandidateTracking;
