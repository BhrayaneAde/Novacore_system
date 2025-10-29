import React, { useState, useEffect } from 'react';
import { systemService } from '../../services/system';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Loader from '../../components/ui/Loader';

const SyncLogs = ({ integrationId, isOpen, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && integrationId) {
      loadLogs();
    }
  }, [isOpen, integrationId]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await systemService.integrations.getLogs(integrationId);
      setLogs(response.data || []);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Clock className="w-4 h-4 text-secondary-500 animate-pulse" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'running':
        return 'text-secondary-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Logs de Synchronisation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader size={24} />
              <span className="ml-2 text-gray-600">Chargement des logs...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun log de synchronisation disponible
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(log.started_at).toLocaleString('fr-FR')}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Traités:</span>
                      <span className="ml-1 font-medium">{log.records_processed}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Réussis:</span>
                      <span className="ml-1 font-medium text-green-600">{log.records_success}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Échoués:</span>
                      <span className="ml-1 font-medium text-red-600">{log.records_failed}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Durée:</span>
                      <span className="ml-1 font-medium">
                        {log.duration_seconds ? `${log.duration_seconds.toFixed(1)}s` : '-'}
                      </span>
                    </div>
                  </div>

                  {log.error_message && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                      <div className="text-sm text-red-800">
                        <strong>Erreur:</strong> {log.error_message}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyncLogs;