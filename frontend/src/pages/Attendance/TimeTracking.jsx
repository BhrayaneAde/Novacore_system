import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { systemService } from "../../services";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";
import { useToast } from "../../components/ui/Toast";
import { Clock, Play, Pause, Coffee, LogOut, LogIn, MapPin, Calendar, AlertCircle, Wifi, WifiOff } from "lucide-react";

const TimeTracking = () => {
  const { currentUser } = useAuthStore();
  const { success, error, warning, ToastContainer } = useToast();
  const [currentSession, setCurrentSession] = useState(null);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayEntries, setTodayEntries] = useState([]);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    // Mettre à jour l'heure toutes les secondes
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Surveiller la connexion
    const handleOnline = () => {
      setIsOnline(true);
      success('Connexion rétablie');
      loadTodayData();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      warning('Connexion perdue - Mode hors ligne');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadTodayData();
    getCurrentLocation();
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadTodayData = async () => {
    if (!isOnline) {
      warning('Mode hors ligne - Données non synchronisées');
      return;
    }
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const entries = await systemService.timeTracking.getEntries(today);
      setTodayEntries(entries || []);
      
      // Vérifier s'il y a une session active
      const activeSession = entries?.find(entry => !entry.clock_out);
      if (activeSession) {
        setCurrentSession(activeSession);
        setIsOnBreak(activeSession.break_start && !activeSession.break_end);
      }
      
      // Calculer les heures de la semaine
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      const weekEntries = await systemService.timeTracking.getWeeklyEntries(weekStart.toISOString().split('T')[0]);
      const totalHours = weekEntries?.reduce((sum, entry) => sum + (entry.total_hours || 0), 0) || 0;
      setWeeklyHours(totalHours);
      
      setLastSync(new Date());
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      error('Impossible de charger les données de pointage');
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Géolocalisation non supportée');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLocationError(null);
      },
      (err) => {
        console.warn('Géolocalisation non disponible:', err);
        const errorMessages = {
          1: 'Permission de géolocalisation refusée',
          2: 'Position indisponible',
          3: 'Délai d\'attente dépassé'
        };
        setLocationError(errorMessages[err.code] || 'Erreur de géolocalisation');
        warning('Géolocalisation indisponible - Pointage sans position');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const clockIn = async () => {
    if (!isOnline) {
      error('Connexion requise pour pointer');
      return;
    }
    
    if (!currentUser?.employee_id) {
      error('Utilisateur non identifié');
      return;
    }
    
    try {
      setLoading(true);
      
      // Validation des heures de travail
      const now = new Date();
      const hour = now.getHours();
      if (hour < 6 || hour > 22) {
        const confirm = window.confirm('Pointage en dehors des heures normales. Continuer ?');
        if (!confirm) return;
      }
      
      const session = await systemService.timeTracking.clockIn({
        employee_id: currentUser.employee_id,
        clock_in: now.toISOString(),
        location: location,
        ip_address: await getClientIP()
      });
      
      setCurrentSession(session);
      await loadTodayData();
      success('Pointage d\'arrivée enregistré');
    } catch (err) {
      console.error('Erreur lors du pointage d\'entrée:', err);
      error(`Erreur lors du pointage: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clockOut = async () => {
    if (!currentSession) {
      error('Aucune session active');
      return;
    }
    
    if (!isOnline) {
      error('Connexion requise pour pointer');
      return;
    }
    
    try {
      setLoading(true);
      
      // Validation durée minimale
      const sessionStart = new Date(currentSession.clock_in);
      const now = new Date();
      const duration = (now - sessionStart) / (1000 * 60); // minutes
      
      if (duration < 30) {
        const confirm = window.confirm('Session très courte (moins de 30min). Confirmer la sortie ?');
        if (!confirm) return;
      }
      
      await systemService.timeTracking.clockOut(currentSession.id, {
        clock_out: now.toISOString(),
        location: location,
        ip_address: await getClientIP()
      });
      
      setCurrentSession(null);
      setIsOnBreak(false);
      await loadTodayData();
      success('Pointage de sortie enregistré');
    } catch (err) {
      console.error('Erreur lors du pointage de sortie:', err);
      error(`Erreur lors du pointage: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startBreak = async () => {
    if (!currentSession) return;
    
    try {
      setLoading(true);
      await systemService.timeTracking.startBreak(currentSession.id, {
        break_start: new Date().toISOString()
      });
      
      setIsOnBreak(true);
      await loadTodayData();
    } catch (error) {
      console.error('Erreur lors du début de pause:', error);
    } finally {
      setLoading(false);
    }
  };

  const endBreak = async () => {
    if (!currentSession) return;
    
    try {
      setLoading(true);
      await systemService.timeTracking.endBreak(currentSession.id, {
        break_end: new Date().toISOString()
      });
      
      setIsOnBreak(false);
      await loadTodayData();
    } catch (error) {
      console.error('Erreur lors de la fin de pause:', error);
    } finally {
      setLoading(false);
    }
  };

  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  const formatDuration = (start, end = new Date()) => {
    const diff = new Date(end) - new Date(start);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  };

  const getTodayStats = () => {
    const totalWorked = todayEntries.reduce((sum, entry) => {
      if (entry.clock_out) {
        return sum + (new Date(entry.clock_out) - new Date(entry.clock_in));
      } else if (entry.clock_in) {
        return sum + (new Date() - new Date(entry.clock_in));
      }
      return sum;
    }, 0);
    
    const totalBreaks = todayEntries.reduce((sum, entry) => {
      return sum + (entry.total_break_time || 0);
    }, 0);
    
    return {
      worked: Math.floor(totalWorked / (1000 * 60 * 60 * 1000)) / 1000,
      breaks: totalBreaks,
      entries: todayEntries.length
    };
  };

  const todayStats = getTodayStats();
  const isWorking = currentSession && !isOnBreak;
  const expectedHours = 8; // Heures de travail attendues par jour
  const workProgress = (todayStats.worked / expectedHours) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Pointage</h1>
            <p className="text-gray-600">Gérez vos heures de travail et pauses</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-gray-900">
              {currentTime.toLocaleTimeString('fr-FR')}
            </div>
            <div className="text-sm text-gray-500">
              {currentTime.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </div>
          </div>
        </div>

        {/* Statut actuel */}
        <Card>
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  isWorking ? 'bg-green-100 animate-pulse' : 
                  isOnBreak ? 'bg-orange-100' : 
                  'bg-gray-100'
                }`}>
                  <Clock className={`w-10 h-10 ${
                    isWorking ? 'text-green-600' : 
                    isOnBreak ? 'text-orange-600' : 
                    'text-gray-400'
                  }`} />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isWorking ? 'En service' : 
                     isOnBreak ? 'En pause' : 
                     'Hors service'}
                  </h2>
                  
                  {currentSession && (
                    <div className="space-y-1">
                      <p className="text-gray-600">
                        Arrivée: {new Date(currentSession.clock_in).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      
                      {isWorking && (
                        <p className="text-green-600 font-medium">
                          Temps travaillé: {formatDuration(currentSession.clock_in)}
                        </p>
                      )}
                      
                      {isOnBreak && (
                        <p className="text-orange-600 font-medium">
                          En pause depuis: {formatDuration(currentSession.break_start)}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    {location ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span>Position confirmée (±{Math.round(location.accuracy)}m)</span>
                      </div>
                    ) : locationError ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-red-600" />
                        <span>{locationError}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-primary-600" />
                        <span>Localisation en cours...</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      {isOnline ? (
                        <Wifi className="w-4 h-4 text-green-600" />
                      ) : (
                        <WifiOff className="w-4 h-4 text-red-600" />
                      )}
                      <span>{isOnline ? 'En ligne' : 'Hors ligne'}</span>
                    </div>
                    
                    {lastSync && (
                      <span className="text-xs">
                        Sync: {lastSync.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Boutons de contrôle */}
              <div className="flex flex-col gap-3">
                {!currentSession ? (
                  <Button 
                    onClick={clockIn} 
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                    icon={LogIn}
                  >
                    {loading ? 'Pointage...' : 'Pointer l\'arrivée'}
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    {!isOnBreak ? (
                      <div className="flex gap-2">
                        <Button 
                          onClick={startBreak}
                          disabled={loading}
                          variant="outline"
                          icon={Coffee}
                        >
                          Commencer pause
                        </Button>
                        <Button 
                          onClick={clockOut}
                          disabled={loading}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          icon={LogOut}
                        >
                          Pointer la sortie
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          onClick={endBreak}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          icon={Play}
                        >
                          Reprendre le travail
                        </Button>
                        <Button 
                          onClick={clockOut}
                          disabled={loading}
                          variant="outline"
                          icon={LogOut}
                        >
                          Pointer la sortie
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Statistiques du jour */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temps travaillé</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor(todayStats.worked)}h{Math.floor((todayStats.worked % 1) * 60).toString().padStart(2, '0')}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-secondary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(workProgress, 100)}%` }}
                  />
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pauses prises</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor(todayStats.breaks / 60)}h{(todayStats.breaks % 60).toString().padStart(2, '0')}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Coffee className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cette semaine</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor(weeklyHours)}h{Math.floor((weeklyHours % 1) * 60).toString().padStart(2, '0')}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pointages</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.entries}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <LogIn className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Historique du jour */}
        <Card title="Historique d'aujourd'hui">
          {loading ? (
            <div className="text-center py-8">
              <div className="flex flex-col items-center justify-center py-8">
                <Loader size={32} />
                <p className="mt-3 text-gray-600">Chargement de l'historique...</p>
              </div>
            </div>
          ) : todayEntries.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun pointage aujourd'hui</p>
              {!isOnline && (
                <p className="text-sm text-primary-600 mt-2">Mode hors ligne - Données non synchronisées</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {todayEntries.map((entry, index) => (
                <div key={entry.id || index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      entry.clock_out ? 'bg-green-50' : 'bg-blue-50'
                    }`}>
                      {entry.clock_out ? (
                        <LogOut className="w-5 h-5 text-green-600" />
                      ) : (
                        <LogIn className="w-5 h-5 text-secondary-600" />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">
                          Arrivée: {new Date(entry.clock_in).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        
                        {entry.clock_out && (
                          <span className="font-medium">
                            Sortie: {new Date(entry.clock_out).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {entry.total_break_time > 0 && (
                          <span>Pause: {Math.floor(entry.total_break_time / 60)}h{(entry.total_break_time % 60).toString().padStart(2, '0')}</span>
                        )}
                        
                        {entry.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Géolocalisé
                          </span>
                        )}
                        
                        {entry.notes && (
                          <span className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Note
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {entry.clock_out ? 
                        formatDuration(entry.clock_in, entry.clock_out) : 
                        formatDuration(entry.clock_in)
                      }
                    </div>
                    
                    <Badge variant={entry.clock_out ? 'success' : 'warning'}>
                      {entry.clock_out ? 'Terminé' : 'En cours'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <ToastContainer />
      </div>
    </DashboardLayout>
  );
};

export default TimeTracking;
