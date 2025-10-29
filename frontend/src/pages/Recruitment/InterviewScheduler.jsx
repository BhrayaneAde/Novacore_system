import React, { useState, useEffect } from "react";
import { hrService, usersService, notificationsService } from "../../services";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Calendar, Plus, Clock, MapPin, Video, Phone, User, Mail, Edit, Trash2, CheckCircle, X } from "lucide-react";

const InterviewScheduler = () => {
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    candidate_id: '',
    interviewer_id: '',
    date: '',
    time: '',
    duration: 60,
    type: 'in_person',
    room_id: '',
    notes: '',
    job_position: ''
  });

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Utiliser les données existantes
      const [employeesData, usersData] = await Promise.all([
        employeesService.getAll(),
        usersService.getAll()
      ]);
      
      // Simuler des entretiens basés sur les employés récents
      const mockInterviews = employeesData?.slice(0, 3).map((emp, index) => ({
        id: index + 1,
        candidate_name: `${emp.first_name} ${emp.last_name}`,
        candidate_email: emp.email,
        interviewer_id: usersData?.[0]?.id,
        interviewer_name: `${usersData?.[0]?.first_name} ${usersData?.[0]?.last_name}`,
        date: selectedDate,
        time: `${9 + index * 2}:00`,
        duration: 60,
        type: 'in_person',
        status: 'scheduled',
        job_position: emp.position,
        room_name: `Salle ${index + 1}`
      })) || [];
      
      // Candidats = employés récents
      const mockCandidates = employeesData?.map(emp => ({
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        position: emp.position,
        email: emp.email
      })) || [];
      
      // Intervieweurs = utilisateurs RH/managers
      const mockInterviewers = usersData?.filter(user => 
        ['hr', 'manager', 'employer'].includes(user.role)
      ) || [];
      
      // Salles simulées
      const mockRooms = [
        { id: 1, name: 'Salle de conférence A', capacity: 8 },
        { id: 2, name: 'Salle de conférence B', capacity: 6 },
        { id: 3, name: 'Bureau direction', capacity: 4 }
      ];
      
      setInterviews(mockInterviews);
      setCandidates(mockCandidates);
      setInterviewers(mockInterviewers);
      setRooms(mockRooms);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInterview = async () => {
    try {
      setLoading(true);
      
      const candidate = candidates.find(c => c.id === formData.candidate_id);
      const interviewer = interviewers.find(i => i.id === formData.interviewer_id);
      const room = rooms.find(r => r.id === formData.room_id);
      
      const newInterview = {
        id: Date.now(),
        candidate_name: candidate?.name,
        candidate_email: candidate?.email,
        interviewer_id: formData.interviewer_id,
        interviewer_name: `${interviewer?.first_name} ${interviewer?.last_name}`,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        type: formData.type,
        status: 'scheduled',
        job_position: formData.job_position,
        room_name: room?.name,
        notes: formData.notes
      };
      
      // Envoyer notification simple
      try {
        await notificationsService.create({
          user_id: formData.interviewer_id,
          type: 'interview_scheduled',
          title: 'Nouvel entretien programmé',
          message: `Entretien avec ${candidate?.name} le ${new Date(formData.date).toLocaleDateString('fr-FR')} à ${formData.time}`,
          priority: 'medium'
        });
      } catch (notifError) {
        console.warn('Notification non envoyée:', notifError);
      }
      
      setInterviews(prev => [...prev, newInterview]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la planification de l\'entretien');
    } finally {
      setLoading(false);
    }
  };

  const updateInterviewStatus = async (id, status) => {
    try {
      await hrService.recruitment.updateInterview(id, { status });
      setInterviews(prev => 
        prev.map(interview => 
          interview.id === id ? { ...interview, status } : interview
        )
      );
      
      // Notification selon le statut
      const interview = interviews.find(i => i.id === id);
      if (interview && status === 'completed') {
        await notificationsService.create({
          user_id: interview.interviewer_id,
          type: 'interview_completed',
          title: 'Entretien terminé',
          message: `N'oubliez pas de saisir vos commentaires pour ${interview.candidate_name}`,
          priority: 'medium'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const deleteInterview = async (id) => {
    if (!confirm('Confirmer la suppression de cet entretien ?')) return;
    
    try {
      await hrService.recruitment.deleteInterview(id);
      setInterviews(prev => prev.filter(interview => interview.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getAvailableSlots = (date, interviewerId) => {
    const slots = [];
    const startHour = 9;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 30]) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isBooked = interviews.some(interview => 
          interview.date === date && 
          interview.time === timeSlot && 
          interview.interviewer_id === interviewerId
        );
        
        if (!isBooked) {
          slots.push(timeSlot);
        }
      }
    }
    
    return slots;
  };

  const resetForm = () => {
    setFormData({
      candidate_id: '',
      interviewer_id: '',
      date: '',
      time: '',
      duration: 60,
      type: 'in_person',
      room_id: '',
      notes: '',
      job_position: ''
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      scheduled: 'info',
      in_progress: 'warning',
      completed: 'success',
      cancelled: 'danger',
      no_show: 'danger'
    };
    
    const labels = {
      scheduled: 'Programmé',
      in_progress: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
      no_show: 'Absent'
    };
    
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const todayInterviews = interviews.filter(i => i.date === new Date().toISOString().split('T')[0]);
  const upcomingInterviews = interviews.filter(i => new Date(i.date) > new Date());

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Planification des entretiens</h1>
            <p className="text-gray-600">Gérez les entretiens de recrutement et les disponibilités</p>
          </div>
          <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
            Planifier un entretien
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
                <p className="text-2xl font-bold text-secondary-600">{todayInterviews.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-secondary-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">À venir</p>
                <p className="text-2xl font-bold text-green-600">{upcomingInterviews.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Candidats actifs</p>
                <p className="text-2xl font-bold text-purple-600">{candidates.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de présence</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filtre par date */}
        <Card>
          <div className="p-4 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            />
            <Button variant="outline" onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}>
              Aujourd'hui
            </Button>
          </div>
        </Card>

        {/* Liste des entretiens */}
        <Card title={`Entretiens du ${new Date(selectedDate).toLocaleDateString('fr-FR')}`}>
          {loading ? (
            <div className="text-center py-8">
              <p>Chargement des entretiens...</p>
            </div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun entretien programmé pour cette date</p>
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div key={interview.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        {getTypeIcon(interview.type)}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{interview.candidate_name}</h3>
                          {getStatusBadge(interview.status)}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {interview.time} ({interview.duration}min)
                          </span>
                          
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {interview.interviewer_name}
                          </span>
                          
                          {interview.room_name && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {interview.room_name}
                            </span>
                          )}
                          
                          {interview.job_position && (
                            <span className="text-secondary-600">{interview.job_position}</span>
                          )}
                        </div>
                        
                        {interview.notes && (
                          <p className="text-sm text-gray-500 mt-2">{interview.notes}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {interview.status === 'scheduled' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateInterviewStatus(interview.id, 'in_progress')}
                          >
                            Démarrer
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Edit}
                          >
                            Modifier
                          </Button>
                        </>
                      )}
                      
                      {interview.status === 'in_progress' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateInterviewStatus(interview.id, 'completed')}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          Terminer
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Trash2}
                        onClick={() => deleteInterview(interview.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Modal de création */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Planifier un entretien</h2>
                <Button variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Candidat</label>
                    <select
                      value={formData.candidate_id}
                      onChange={(e) => setFormData({...formData, candidate_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      required
                    >
                      <option value="">Sélectionner un candidat</option>
                      {candidates.map(candidate => (
                        <option key={candidate.id} value={candidate.id}>
                          {candidate.name} - {candidate.position}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Intervieweur</label>
                    <select
                      value={formData.interviewer_id}
                      onChange={(e) => setFormData({...formData, interviewer_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      required
                    >
                      <option value="">Sélectionner un intervieweur</option>
                      {interviewers.map(interviewer => (
                        <option key={interviewer.id} value={interviewer.id}>
                          {interviewer.first_name} {interviewer.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      required
                    >
                      <option value="">Sélectionner une heure</option>
                      {formData.date && formData.interviewer_id && 
                        getAvailableSlots(formData.date, formData.interviewer_id).map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))
                      }
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    >
                      <option value={30}>30 min</option>
                      <option value={45}>45 min</option>
                      <option value={60}>1 heure</option>
                      <option value={90}>1h30</option>
                      <option value={120}>2 heures</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type d'entretien</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    >
                      <option value="in_person">En présentiel</option>
                      <option value="video">Visioconférence</option>
                      <option value="phone">Téléphonique</option>
                    </select>
                  </div>
                  
                  {formData.type === 'in_person' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
                      <select
                        value={formData.room_id}
                        onChange={(e) => setFormData({...formData, room_id: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      >
                        <option value="">Sélectionner une salle</option>
                        {rooms.map(room => (
                          <option key={room.id} value={room.id}>
                            {room.name} (Capacité: {room.capacity})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poste à pourvoir</label>
                  <input
                    type="text"
                    value={formData.job_position}
                    onChange={(e) => setFormData({...formData, job_position: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    placeholder="Ex: Développeur Full Stack"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    placeholder="Notes ou instructions spéciales..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1"
                  onClick={createInterview}
                  disabled={loading || !formData.candidate_id || !formData.interviewer_id || !formData.date || !formData.time}
                >
                  {loading ? 'Planification...' : 'Planifier'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InterviewScheduler;
