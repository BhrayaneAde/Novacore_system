import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { leavesService, employeesService } from "../../services";
import { ChevronLeft, ChevronRight, Calendar, Filter, Plus, Eye } from "lucide-react";

const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day
  const [events, setEvents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    departments: [],
    eventTypes: ['presence', 'absence', 'leave', 'holiday']
  });
  const [loading, setLoading] = useState(true);

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
      
      // Transformer les congés en événements calendrier
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
      
      // Ajouter les jours fériés français
      const holidays = getHolidays(currentDate.getFullYear());
      
      // Générer les présences par défaut pour les employés actifs
      const workDays = generateWorkDays(currentDate, employeesData);
      
      setEvents([...leaveEvents, ...holidays, ...workDays]);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
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

  const getEventColor = (event) => {
    const colors = {
      presence: 'bg-green-100 text-green-800 border-green-200',
      absence: 'bg-red-100 text-red-800 border-red-200',
      leave: 'bg-blue-100 text-blue-800 border-blue-200',
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
            <Button variant="outline" icon={Filter}>
              Filtres
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

        {/* Légende */}
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Légende</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                <span className="text-sm text-gray-600">Présence</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                <span className="text-sm text-gray-600">Congés</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                <span className="text-sm text-gray-600">Absence</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded"></div>
                <span className="text-sm text-gray-600">Jour férié</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Calendrier */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <p>Chargement du calendrier...</p>
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
                          day.isToday ? 'text-blue-600' : ''
                        }`}>
                          {day.date.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {day.events.slice(0, 3).map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded border truncate cursor-pointer hover:shadow-sm ${
                                getEventColor(event)
                              }`}
                              title={event.title}
                            >
                              {event.title}
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
                <p className="text-2xl font-bold text-blue-600">
                  {events.filter(e => 
                    e.type === 'leave' && 
                    new Date(e.start) <= new Date() && 
                    new Date(e.end) >= new Date()
                  ).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">Taux présence</p>
                <p className="text-2xl font-bold text-gray-900">94.2%</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceCalendar;
