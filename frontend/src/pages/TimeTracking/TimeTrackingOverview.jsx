import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { hrService } from "../../services";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import PermissionGuard from "../../components/auth/PermissionGuard";
import { Clock, Play, Pause, Plus, Calendar, BarChart3, Download } from "lucide-react";

const TimeTrackingOverview = () => {
  const { currentUser, currentCompany } = useAuthStore();
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [myTimeEntries, setMyTimeEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTimeEntries = async () => {
      try {
        const entries = await hrService.timeTracking.getMyEntries();
        setMyTimeEntries(entries || []);
      } catch (error) {
        console.error('Erreur lors du chargement des entrées:', error);
        setMyTimeEntries([]);
      } finally {
        setLoading(false);
      }
    };
    loadTimeEntries();
  }, []);
  const todayEntries = myTimeEntries.filter(entry => entry.date === new Date().toISOString().split('T')[0]);
  
  const weeklyHours = myTimeEntries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return entryDate >= weekStart;
    })
    .reduce((total, entry) => total + (entry.total_hours || entry.totalHours || 0), 0);

  const handleStartTracking = async () => {
    try {
      const session = await hrService.timeTracking.startSession();
      setIsTracking(true);
      setCurrentSession(session);
    } catch (error) {
      console.error('Erreur lors du démarrage:', error);
    }
  };

  const handleStopTracking = async () => {
    try {
      if (currentSession) {
        await hrService.timeTracking.stopSession(currentSession.id);
      }
      setIsTracking(false);
      setCurrentSession(null);
    } catch (error) {
      console.error('Erreur lors de l\'arrêt:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <Badge variant="success">Approuvé</Badge>;
      case 'pending': return <Badge variant="warning">En attente</Badge>;
      case 'rejected': return <Badge variant="danger">Refusé</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const formatDuration = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h${m.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Suivi du temps</h1>
            <p className="text-gray-600">Gérez vos heures de travail et projets</p>
          </div>
          
          <div className="flex gap-2">
            <PermissionGuard permission="timetracking.manage">
              <Button variant="outline" icon={BarChart3}>
                Rapports
              </Button>
            </PermissionGuard>
            <Button icon={Plus}>
              Nouvelle entrée
            </Button>
          </div>
        </div>

        {/* Timer actuel */}
        <Card>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isTracking ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Clock className={`w-8 h-8 ${isTracking ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {isTracking ? 'En cours...' : 'Prêt à démarrer'}
                </h3>
                <p className="text-gray-600">
                  {isTracking && currentSession 
                    ? `Démarré à ${currentSession.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
                    : 'Cliquez pour commencer le suivi'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isTracking && (
                <div className="text-right mr-4">
                  <div className="text-2xl font-bold text-green-600">
                    {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-sm text-gray-500">Temps écoulé</div>
                </div>
              )}
              
              {isTracking ? (
                <Button 
                  onClick={handleStopTracking}
                  className="bg-red-600 hover:bg-red-700"
                  icon={Pause}
                >
                  Arrêter
                </Button>
              ) : (
                <Button 
                  onClick={handleStartTracking}
                  className="bg-green-600 hover:bg-green-700"
                  icon={Play}
                >
                  Démarrer
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(todayEntries.reduce((total, entry) => total + (entry.total_hours || entry.totalHours || 0), 0))}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cette semaine</p>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(weeklyHours)}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {myTimeEntries.filter(e => e.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Heures sup.</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(myTimeEntries.reduce((total, entry) => total + (entry.overtime || 0), 0))}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Entrées récentes */}
        <Card title="Entrées récentes">
          {loading ? (
            <div className="text-center py-8">
              <p>Chargement des entrées...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myTimeEntries.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-secondary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{entry.project}</h4>
                    <p className="text-sm text-gray-600">{entry.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>{new Date(entry.date).toLocaleDateString('fr-FR')}</span>
                      <span>{entry.startTime} - {entry.endTime}</span>
                      <span>Pause: {entry.breakDuration}min</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatDuration(entry.total_hours || entry.totalHours || 0)}</div>
                    {entry.overtime && (
                      <div className="text-xs text-orange-600">+{formatDuration(entry.overtime)} sup.</div>
                    )}
                  </div>
                  {getStatusBadge(entry.status)}
                </div>
              </div>
              ))}
            </div>
          )}
          
          {!loading && myTimeEntries.length === 0 && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune entrée de temps enregistrée</p>
              <Button className="mt-4" icon={Plus}>
                Créer votre première entrée
              </Button>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TimeTrackingOverview;