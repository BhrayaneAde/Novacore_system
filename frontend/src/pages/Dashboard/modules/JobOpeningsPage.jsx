import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { recruitmentService } from '../../../services/recruitment';
import JobOpeningForm from '../../../components/forms/JobOpeningForm';
import Loader from '../../../components/ui/Loader';
import SurveillanceStatus from '../../../components/recruitment/SurveillanceStatus';

const JobOpeningsPage = () => {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    loadJobOpenings();
  }, []);

  const loadJobOpenings = async () => {
    try {
      setLoading(true);
      const response = await recruitmentService.getJobOpenings();
      setJobOpenings(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
      setJobOpenings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedJob) {
        await recruitmentService.updateJobOpening(selectedJob.id, formData);
      } else {
        await recruitmentService.createJobOpening(formData);
      }
      await loadJobOpenings();
      setShowForm(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        await recruitmentService.jobOpenings.delete(id);
        await loadJobOpenings();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'filled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      open: 'Ouverte',
      paused: 'En pause',
      closed: 'Fermée',
      filled: 'Pourvue'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offres d'Emploi</h1>
          <p className="text-gray-600">{jobOpenings.length} offres au total</p>
        </div>
        <div className="flex items-center gap-4">
          <SurveillanceStatus />
          <button
            onClick={() => {
              setSelectedJob(null);
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvelle offre
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobOpenings.map((job) => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.department}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                {getStatusLabel(job.status)}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{job.type}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Localisation:</span>
                <span className="font-medium">{job.location || 'Non spécifiée'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Publié le:</span>
                <span className="font-medium">{job.posted_date}</span>
              </div>
            </div>

            {job.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {job.description}
              </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setShowForm(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                <Eye className="w-4 h-4" />
                Voir candidats
              </button>
            </div>
          </div>
        ))}
      </div>

      {jobOpenings.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune offre d'emploi</h3>
          <p className="text-gray-600 mb-4">Commencez par créer votre première offre d'emploi.</p>
          <button
            onClick={() => {
              setSelectedJob(null);
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Créer une offre
          </button>
        </div>
      )}

      <JobOpeningForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedJob(null);
        }}
        onSave={handleSave}
        jobOpening={selectedJob}
      />
    </div>
  );
};

export default JobOpeningsPage;