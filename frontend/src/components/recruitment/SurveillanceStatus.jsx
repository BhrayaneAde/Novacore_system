import React, { useState, useEffect } from 'react';
import { Mail, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { recruitmentService } from '../../services/recruitment';

const SurveillanceStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurveillanceStatus();
  }, []);

  const loadSurveillanceStatus = async () => {
    try {
      const response = await recruitmentService.getSurveillanceStatus();
      setStatus(response.data);
    } catch (error) {
      console.error('Erreur chargement statut surveillance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const isActive = status?.status === 'active';
  const surveillanceCount = status?.active_surveillances || 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isActive ? 'bg-green-100' : 'bg-gray-100'
        }`}>
          <Mail className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Surveillance Email</h3>
          <div className="flex items-center gap-2">
            {isActive ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-gray-400" />
            )}
            <span className={`text-sm ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Offres surveillées:</span>
          <span className="font-medium">{surveillanceCount}</span>
        </div>
        
        {status?.surveillances && Object.keys(status.surveillances).length > 0 && (
          <div className="mt-3">
            <button 
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              onClick={() => {
                console.log('Surveillances:', status.surveillances);
              }}
            >
              <Eye className="w-4 h-4" />
              Voir détails
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveillanceStatus;