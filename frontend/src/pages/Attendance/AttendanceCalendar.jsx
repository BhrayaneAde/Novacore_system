import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";
import { useToast } from "../../components/ui/Toast";
import { leavesService, employeesService, systemService } from "../../services";
import { ChevronLeft, ChevronRight, Calendar, Filter, Plus, Eye, RefreshCw, Download } from "lucide-react";

const AttendanceCalendar = () => {
  const { success, error, warning, ToastContainer } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day
  const [events, setEvents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    departments: [],
    eventTypes: ['presence', 'absence', 'leave', 'holiday']
  });
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentDate, view]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [leavesData, employeesData] = await Promise.all([
        leavesService.getAll(),
        employeesService.getAll()
      ]);
      
      setEmployees(employeesData || []);
      
      // Charger les données de présence réelles pour chaque employé
      const attendancePromises = (employeesData || []).map(async (employee) => {
        try {
          const calendarData = await systemService.attendance.getCalendar(
            employee.id, 
            currentDate.getMonth() + 1, 
            currentDate.getFullYear()
          );
          const stats = await systemService.attendance.getStatistics(employee.id);
          return { employee, calendarData, stats };
        } catch (error) {
          console.error(`Erreur pour l'employé ${employee.id}:`, error);
          return { employee, calendarData: null, stats: null };
        }
      });
      
      const attendanceResults = await Promise.all(attendancePromises);
      
      // Transformer les données en événements calendrier
      const attendanceEvents = [];
      const allStats = [];
      
      attendanceResults.forEach(({ employee, calendarData, stats }) => {
        if (calendarData) {
          // Ajouter les présences réelles
          calendarData.attendance?.forEach(record => {
            attendanceEvents.push({
              id: `attendance-${record.id}`,
              title: `${employee.first_name} ${employee.last_name}`,
              start: record.date,
              end: record.date,
              type: 'presence',
              employee: `${employee.first_name} ${employee.last_name}`,
              department: employee.department,
              details: record,
              hours: record.clock_out ? 
                ((new Date(record.clock_out) - new Date(record.clock_in)) / (1000 * 60 * 60)).toFixed(1) : 
                null
            });
          });
          
          // Ajouter les congés approuvés
          calendarData.leaves?.forEach(leave => {
            const startDate = new Date(leave.start_date);
            const endDate = new Date(leave.end_date);
            
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
              attendanceEvents.push({
                id: `leave-${leave.id}-${d.toISOString().split('T')[0]}`,
                title: `${employee.first_name} ${employee.last_name} - ${getLeaveTypeLabel(leave.leave_type)}`,
                start: d.toISOString().split('T')[0],
                end: d.toISOString().split('T')[0],
                type: 'leave',
                employee: `${employee.first_name} ${employee.last_name}`,
                department: employee.department,
                details: leave
              });
            }
          });
        }
        
        if (stats) {
          allStats.push({ employee, ...stats });
        }
      });
      
      // Transformer les congés en événements calendrier (demandes en cours)
      const leaveEvents = (leavesData || []).filter(leave => leave.status === 'pending').map(leave => ({
        id: `leave-request-${leave.id}`,
        title: `${leave.employee_name} - ${getLeaveTypeLabel(leave.leave_type)} (En attente)`,
        start: leave.start_date,
        end: leave.end_date,
        type: 'leave',
        status: leave.status,
        employee: leave.employee_name,
        department: leave.department,
        details: leave
      }));
      
      // Ajouter les jours fériés français
      const holidays = getHolidays(currentDate.getFullYear());
      
      setEvents([...attendanceEvents, ...leaveEvents, ...holidays]);
      setStatistics(allStats);
      setLastRefresh(new Date());
      success(`Calendrier mis à jour - ${attendanceEvents.length} événements chargés`);
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      error('Erreur lors du chargement du calendrier');
      
      // Fallback vers les données mockées en cas d'erreur
      try {
        const [leavesData, employeesData] = await Promise.all([
          leavesService.getAll(),
          employeesService.getAll()
        ]);
        
        setEmployees(employeesData || []);
        
        const leaveEvents = (leavesData || []).map(leave => ({
          id: `leave-${leave.id}`,
          title: `${leave.employee_name} - ${getLeaveTypeLabel(leave.leave_type)}`,
          start: leave.start_date,
          end: leave.end_date,
          type: 'leave',
          status: leave.status,
          employee: leave.employee_name,
          department: leave.department,
          details: leave
        }));
        
        const holidays = getHolidays(currentDate.getFullYear());
        const workDays = generateWorkDays(currentDate, employeesData);
        
        setEvents([...leaveEvents, ...holidays, ...workDays]);
        warning('Données de secours chargées');
      } catch (fallbackError) {
        console.error('Erreur fallback:', fallbackError);
        error('Impossible de charger les données');
      }
    } finally {
      setLoading(false);
    }
  };

  const getLeaveTypeLabel = (type) => {
    const labels = {
      vacation: 'Congés payés',
      sick: 'Arrêt maladie',
      maternity: 'Congé maternité',
      paternity: 'Congé paternité',
      personal: 'Congé personnel',
      training: 'Formation'
    };
    return labels[type] || type;
  };

  const getHolidays = (year) => {
    // Jours fériés français fixes et calculés
    const holidays = [
      { date: `${year}-01-01`, name: 'Jour de l\'An' },
      { date: `${year}-05-01`, name: 'Fête du Travail' },
      { date: `${year}-05-08`, name: 'Victoire 1945' },
      { date: `${year}-07-14`, name: 'Fête Nationale' },
      { date: `${year}-08-15`, name: 'Assomption' },
      { date: `${year}-11-01`, name: 'Toussaint' },
      { date: `${year}-11-11`, name: 'Armistice' },
      { date: `${year}-12-25`, name: 'Noël' }
    ];
    
    return holidays.map(holiday => ({
      id: `holiday-${holiday.date}`,
      title: holiday.name,
      start: holiday.date,
      end: holiday.date,
      type: 'holiday',
      allDay: true
    }));
  };

  const generateWorkDays = (date, employeesList) => {
    const workDays = [];
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Lundi à Vendredi
        employeesList.forEach(employee => {
          workDays.push({
            id: `work-${employee.id}-${d.toISOString().split('T')[0]}`,
            title: `${employee.first_name} ${employee.last_name}`,
            start: d.toISOString().split('T')[0],
            end: d.toISOString().split('T')[0],
            type: 'presence',
            employee: `${employee.first_name} ${employee.last_name}`,
            department: employee.department,
            allDay: true
          });
        });
      }
    }
    
    return workDays;
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else {
      newDate.setDate(newDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };
  
  const refreshData = async () => {
    setLoading(true);
    await loadData();
  };
  
  const exportCalendar = () => {
    const data = {
      period: currentDate.toISOString().split('T')[0],
      events: events.filter(e => selectedFilters.eventTypes.includes(e.type)),
      statistics: statistics
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendrier-${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    success('Calendrier exporté');
  };
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };
  
  const toggleFilter = (type) => {
    setSelectedFilters(prev => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(type)
        ? prev.eventTypes.filter(t => t !== type)
        : [...prev.eventTypes, type]
    }));
  };

  const getEventColor = (event) => {
    const colors = {
      presence: 'bg-green-100 text-green-800 border-green-200',
      absence: 'bg-red-100 text-red-800 border-red-200',
      leave: 'bg-secondary-100 text-blue-800 border-blue-200',
      holiday: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[event.type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const renderCalendarGrid = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startOfWeek = new Date(startOfMonth);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Lundi
    
    const days = [];
    const current = new Date(startOfWeek);
    
    // Générer 6 semaines pour couvrir tout le mois
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const dayEvents = events.filter(event => {
          const eventDate = new Date(event.start);
          return eventDate.toDateString() === current.toDateString() &&
                 selectedFilters.eventTypes.includes(event.type);
        });
        
        weekDays.push({
          date: new Date(current),
          events: dayEvents,
          isCurrentMonth: current.getMonth() === currentDate.getMonth(),
          isToday: current.toDateString() === new Date().toDateString()
        });
        
        current.setDate(current.getDate() + 1);
      }
      days.push(weekDays);
    }
    
    return days;
  };

  const calendarGrid = renderCalendarGrid();
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Calendrier des présences</h1>
            <p className="text-gray-600">Visualisez et gérez les présences de votre équipe</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              icon={RefreshCw} 
              onClick={refreshData}
              disabled={loading}
            >
              Actualiser
            </Button>
            <Button 
              variant="outline" 
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtres
            </Button>
            <Button 
              variant="outline" 
              icon={Download}
              onClick={exportCalendar}
            >
              Exporter
            </Button>
            <Button icon={Plus}>
              Nouvelle demande
            </Button>
          </div>
        </div>

        {/* Contrôles de navigation */}
        <Card>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateDate(-1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateDate(1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <h2 className="text-xl font-semibold">
                {currentDate.toLocaleDateString('fr-FR', { 
                  month: 'long', 
                  year: 'numeric' 
                }).charAt(0).toUpperCase() + currentDate.toLocaleDateString('fr-FR', { 
                  month: 'long', 
                  year: 'numeric' 
                }).slice(1)}
              </h2>
              
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Aujourd'hui
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              {['month', 'week', 'day'].map((viewType) => (
                <Button
                  key={viewType}
                  variant={view === viewType ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView(viewType)}
                >
                  {viewType === 'month' ? 'Mois' : viewType === 'week' ? 'Semaine' : 'Jour'}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Légende et Filtres */}
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Légende et Filtres</h3>
              {lastRefresh && (
                <span className="text-xs text-gray-500">
                  Dernière mise à jour: {lastRefresh.toLocaleTimeString('fr-FR')}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4">
              {[
                { type: 'presence', color: 'bg-green-100 border-green-200', label: 'Présence' },
                { type: 'leave', color: 'bg-secondary-100 border-blue-200', label: 'Congés' },
                { type: 'absence', color: 'bg-red-100 border-red-200', label: 'Absence' },
                { type: 'holiday', color: 'bg-purple-100 border-purple-200', label: 'Jour férié' }
              ].map(({ type, color, label }) => (
                <div 
                  key={type}
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded ${
                    selectedFilters.eventTypes.includes(type) ? 'bg-gray-50' : 'opacity-50'
                  }`}
                  onClick={() => toggleFilter(type)}
                >
                  <div className={`w-4 h-4 ${color} rounded`}></div>
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-xs text-gray-400">
                    ({events.filter(e => e.type === type).length})
                  </span>
                </div>
              ))}
            </div>
            
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Filtres avancés</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Départements</label>
                    <select className="w-full text-sm border border-gray-300 rounded px-2 py-1">
                      <option>Tous les départements</option>
                      <option>RH</option>
                      <option>IT</option>
                      <option>Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Statut</label>
                    <select className="w-full text-sm border border-gray-300 rounded px-2 py-1">
                      <option>Tous les statuts</option>
                      <option>Approuvé</option>
                      <option>En attente</option>
                      <option>Rejeté</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Calendrier */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center justify-center py-8">
                <Loader size={32} />
                <p className="mt-3 text-gray-600">Chargement du calendrier...</p>
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun événement pour cette période</p>
              <Button onClick={refreshData} variant="outline" className="mt-4">
                Actualiser
              </Button>
            </div>
          ) : (
            <div className="p-4">
              {/* En-têtes des jours */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Grille du calendrier */}
              <div className="space-y-1">
                {calendarGrid.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`min-h-[120px] p-2 border rounded-lg ${
                          day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                        } ${
                          day.isToday ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <div className={`text-sm font-medium mb-2 ${
                          day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                        } ${
                          day.isToday ? 'text-secondary-600' : ''
                        }`}>
                          {day.date.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {day.events.slice(0, 3).map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded border truncate cursor-pointer hover:shadow-sm transition-all ${
                                getEventColor(event)
                              }`}
                              title={`${event.title}${event.hours ? ` (${event.hours}h)` : ''}`}
                              onClick={() => handleEventClick(event)}
                            >
                              {event.title}
                              {event.hours && (
                                <span className="ml-1 font-medium">({event.hours}h)</span>
                              )}
                            </div>
                          ))}
                          {day.events.length > 3 && (
                            <div className="text-xs text-gray-500 p-1">
                              +{day.events.length - 3} autres
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Présents aujourd'hui</p>
                <p className="text-2xl font-bold text-green-600">
                  {events.filter(e => 
                    e.type === 'presence' && 
                    new Date(e.start).toDateString() === new Date().toDateString()
                  ).length}
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
                <p className="text-sm font-medium text-gray-600">En congés</p>
                <p className="text-2xl font-bold text-secondary-600">
                  {events.filter(e => 
                    e.type === 'leave' && 
                    new Date(e.start) <= new Date() && 
                    new Date(e.end) >= new Date()
                  ).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-secondary-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Demandes en attente</p>
                <p className="text-2xl font-bold text-orange-600">
                  {events.filter(e => e.details?.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Heures moyennes/mois</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics ? 
                    Math.round(statistics.reduce((acc, s) => acc + (s.monthly_hours || 0), 0) / statistics.length) : 
                    '151'
                  }h
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </Card>
        </div>
        
        {/* Modal détail événement */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedEvent(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Type:</span>
                  <span className="ml-2 text-sm">{selectedEvent.type}</span>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Date:</span>
                  <span className="ml-2 text-sm">{selectedEvent.start}</span>
                </div>
                
                {selectedEvent.employee && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Employé:</span>
                    <span className="ml-2 text-sm">{selectedEvent.employee}</span>
                  </div>
                )}
                
                {selectedEvent.department && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Département:</span>
                    <span className="ml-2 text-sm">{selectedEvent.department}</span>
                  </div>
                )}
                
                {selectedEvent.hours && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Durée:</span>
                    <span className="ml-2 text-sm">{selectedEvent.hours}h</span>
                  </div>
                )}
                
                {selectedEvent.details?.status && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Statut:</span>
                    <span className="ml-2">{getStatusBadge(selectedEvent.details.status)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <ToastContainer />
      </div>
    </DashboardLayout>
  );
};

export default AttendanceCalendar;
