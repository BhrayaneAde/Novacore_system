import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Target, Award } from 'lucide-react';
import { systemService } from '../../../services';

const SuccessionPlanningPage = () => {
  const [successors, setSuccessors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuccessionPlans();
  }, []);

  const loadSuccessionPlans = async () => {
    try {
      const response = await systemService.employees.getAll();
      const employees = Array.isArray(response.data) ? response.data : [];
      
      const plans = employees.slice(0, 3).map((emp, index) => ({
        id: index + 1,
        position: emp.role || 'Poste',
        currentHolder: emp.name,
        successors: employees.slice(index + 1, index + 3).map(successor => ({
          name: successor.name,
          readiness: Math.floor(Math.random() * 40) + 60,
          timeframe: ['6 mois', '9 mois', '12 mois'][Math.floor(Math.random() * 3)]
        }))
      }));
      
      setSuccessors(plans);
    } catch (error) {
      console.error('Erreur chargement succession:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Planification de Succession</h1>
        <p className="text-gray-600">Gestion des plans de succession pour les postes clés</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Postes Critiques</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{successors.length}</p>
          <p className="text-sm text-gray-500">Identifiés</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Successeurs Prêts</h3>
            <Award className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">5</p>
          <p className="text-sm text-gray-500">Disponibles</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">En Formation</h3>
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">12</p>
          <p className="text-sm text-gray-500">Employés</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Risque Élevé</h3>
            <Target className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">3</p>
          <p className="text-sm text-gray-500">Postes</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Plans de Succession Actifs</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {successors.map((plan) => (
              <div key={plan.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{plan.position}</h3>
                    <p className="text-sm text-gray-600">Titulaire actuel: {plan.currentHolder}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {plan.successors.length} successeur{plan.successors.length > 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {plan.successors.map((successor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{successor.name}</h4>
                        <p className="text-sm text-gray-600">Prêt dans {successor.timeframe}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{successor.readiness}%</p>
                          <p className="text-xs text-gray-500">Préparation</p>
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              successor.readiness >= 80 ? 'bg-green-500' :
                              successor.readiness >= 60 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${successor.readiness}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessionPlanningPage;