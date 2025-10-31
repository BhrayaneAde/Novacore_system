import React, { useState, useEffect } from 'react';
import { X, Save, Briefcase, MapPin, Calendar, FileText, Mail, Tag, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import apiClient from '../../api/client';

const JobOpeningForm = ({ isOpen, onClose, onSave, jobOpening = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    department_id: '',
    location: '',
    type: 'CDI',
    status: 'open',
    description: '',
    requirements: '',
    email_keywords: [],
    auto_screening_enabled: true,
    screening_criteria: {
      required_skills: [],
      experience_min: 0
    }
  });
  
  const [departments, setDepartments] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [newSkill, setNewSkill] = useState('');
  
  const steps = [
    { id: 1, title: 'Informations générales', icon: Briefcase },
    { id: 2, title: 'Description du poste', icon: FileText },
    { id: 3, title: 'Surveillance automatique', icon: Mail }
  ];

  useEffect(() => {
    loadDepartments();
    
    if (jobOpening) {
      setFormData({
        title: jobOpening.title || '',
        department_id: jobOpening.department_id || '',
        location: jobOpening.location || '',
        type: jobOpening.type || 'CDI',
        status: jobOpening.status || 'open',
        description: jobOpening.description || '',
        requirements: jobOpening.requirements || '',
        email_keywords: jobOpening.email_keywords || [],
        auto_screening_enabled: jobOpening.auto_screening_enabled ?? true,
        screening_criteria: jobOpening.screening_criteria || {
          required_skills: [],
          experience_min: 0
        }
      });
    } else {
      setFormData({
        title: '',
        department_id: '',
        location: '',
        type: 'CDI',
        status: 'open',
        description: '',
        requirements: '',
        email_keywords: [],
        auto_screening_enabled: true,
        screening_criteria: {
          required_skills: [],
          experience_min: 0
        }
      });
    }
    setCurrentStep(1);
  }, [jobOpening, isOpen]);
  
  const loadDepartments = async () => {
    try {
      const response = await apiClient.get('/recruitment/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Erreur chargement départements:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.department_id;
      case 2:
        return formData.description;
      default:
        return true;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {jobOpening ? 'Modifier l\'offre' : 'Créer une offre d\'emploi'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Stepper */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-teal-50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive 
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 border-amber-500 text-white' 
                      : isCompleted 
                      ? 'bg-gradient-to-r from-teal-600 to-teal-700 border-teal-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-amber-600' : isCompleted ? 'text-teal-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-teal-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Informations générales */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Titre du poste
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Ex: Développeur React Senior"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Département
                  </label>
                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} {dept.manager_name && `(${dept.manager_name})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Localisation
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Ex: Paris, Télétravail"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de contrat
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Alternance">Alternance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="open">Ouverte</option>
                    <option value="paused">En pause</option>
                    <option value="closed">Fermée</option>
                    <option value="filled">Pourvue</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Description du poste */}
          {currentStep === 2 && (
            <div className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Description du poste
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Décrivez les missions, responsabilités et environnement de travail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exigences et qualifications
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Listez les compétences requises, expérience, diplômes..."
                />
              </div>
            </div>
          )}
          
          {/* Step 3: Surveillance automatique */}
          {currentStep === 3 && (
            <div className="space-y-6">

              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-medium text-gray-900">Surveillance Email Automatique</h3>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.auto_screening_enabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, auto_screening_enabled: e.target.checked }))}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">Activer la surveillance automatique des candidatures par email</span>
                </label>
              </div>

              {formData.auto_screening_enabled && (
                <div className="space-y-4 bg-gradient-to-br from-amber-50 to-teal-50 p-4 rounded-lg border border-amber-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Tag className="w-4 h-4 inline mr-2" />
                      Mots-clés de surveillance
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        placeholder="Ex: candidature RH, poste ressources humaines"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newKeyword.trim()) {
                              setFormData(prev => ({
                                ...prev,
                                email_keywords: [...prev.email_keywords, newKeyword.trim()]
                              }));
                              setNewKeyword('');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newKeyword.trim()) {
                            setFormData(prev => ({
                              ...prev,
                              email_keywords: [...prev.email_keywords, newKeyword.trim()]
                            }));
                            setNewKeyword('');
                          }
                        }}
                        className="px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.email_keywords.map((keyword, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-lg">
                          <input
                            type="checkbox"
                            checked={true}
                            readOnly
                            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          />
                          <span className="flex-1 text-sm text-gray-700">{keyword}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                email_keywords: prev.email_keywords.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {formData.email_keywords.length === 0 && (
                        <p className="text-sm text-gray-500 italic">Aucun mot-clé ajouté</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Compétences requises
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Ex: recrutement, entretiens"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (newSkill.trim()) {
                                setFormData(prev => ({
                                  ...prev,
                                  screening_criteria: {
                                    ...prev.screening_criteria,
                                    required_skills: [...prev.screening_criteria.required_skills, newSkill.trim()]
                                  }
                                }));
                                setNewSkill('');
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newSkill.trim()) {
                              setFormData(prev => ({
                                ...prev,
                                screening_criteria: {
                                  ...prev.screening_criteria,
                                  required_skills: [...prev.screening_criteria.required_skills, newSkill.trim()]
                                }
                              }));
                              setNewSkill('');
                            }
                          }}
                          className="px-3 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.screening_criteria.required_skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  screening_criteria: {
                                    ...prev.screening_criteria,
                                    required_skills: prev.screening_criteria.required_skills.filter((_, i) => i !== index)
                                  }
                                }));
                              }}
                              className="ml-1 text-teal-600 hover:text-teal-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expérience minimale (années)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={formData.screening_criteria.experience_min}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          screening_criteria: {
                            ...prev.screening_criteria,
                            experience_min: parseInt(e.target.value) || 0
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 text-teal-700 bg-teal-100 hover:bg-teal-200 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Annuler
              </button>
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedToNext()}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {jobOpening ? 'Modifier' : 'Publier'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobOpeningForm;