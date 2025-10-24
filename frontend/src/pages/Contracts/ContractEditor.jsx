import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Play, FileText, Plus, Trash2, Download, Save, Eye, Edit3 } from 'lucide-react';
import { employeesService } from '../../services';
import jsPDF from 'jspdf';

const ContractEditor = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('templates');
  const [activeTab, setActiveTab] = useState('cdi');
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editorTab, setEditorTab] = useState('edit');
  const [editStep, setEditStep] = useState(1);
  const [contractVariables, setContractVariables] = useState({});
  const [companyLogo, setCompanyLogo] = useState(null);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [nextArticleId, setNextArticleId] = useState(7);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentView === 'employeeSelect') {
      loadEmployees();
    }
  }, [currentView]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeesService.getAll();
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "ENGAGEMENT",
      content: "L'Employeur engage le Salarié qui accepte, en qualité de [POSTE], statut [STATUT], position [POSITION], niveau [NIVEAU], coefficient [COEFFICIENT] de la convention collective [NOM DE LA CONVENTION COLLECTIVE].",
      order: 1
    },
    {
      id: 2,
      title: "DATE D'EFFET ET DURÉE",
      content: "Le présent contrat prend effet le [DATE DEBUT].\\n\\nIl est conclu pour une durée indéterminée.\\n\\nLe Salarié bénéficie d'une période d'essai de [DUREE ESSAI] mois, renouvelable une fois, conformément aux dispositions légales et conventionnelles en vigueur.",
      order: 2
    },
    {
      id: 3,
      title: "FONCTIONS",
      content: "Le Salarié exercera les fonctions de [POSTE].\\n\\nSes principales missions seront les suivantes :\\n• [MISSION 1]\\n• [MISSION 2]\\n• [MISSION 3]\\n• [MISSION 4]",
      order: 3
    },
    {
      id: 4,
      title: "LIEU DE TRAVAIL",
      content: "Le Salarié exercera ses fonctions au [ADRESSE TRAVAIL].\\n\\nLe Salarié pourra être amené à effectuer des déplacements professionnels en France et à l'étranger dans le cadre de ses fonctions.",
      order: 4
    },
    {
      id: 5,
      title: "RÉMUNÉRATION",
      content: "En contrepartie de ses fonctions, le Salarié percevra une rémunération brute mensuelle de [SALAIRE] euros, versée par virement bancaire le dernier jour ouvré de chaque mois.\\n\\nCette rémunération s'entend pour un temps complet et sera soumise aux retenues sociales et fiscales en vigueur.",
      order: 5
    },
    {
      id: 6,
      title: "DURÉE DU TRAVAIL",
      content: "Le Salarié est employé à temps complet sur la base de 35 heures hebdomadaires.\\n\\nLes horaires de travail sont : [HORAIRES].\\n\\nLe Salarié bénéficie de [CONGES] jours de RTT par an.",
      order: 6
    }
  ]);

  const contractTypes = {
    cdi: {
      title: 'CDI',
      sections: [
        {
          title: 'Début de fonction',
          contracts: [
            {
              id: 'cdi-contract',
              title: 'Contrat de travail CDI',
              description: 'Document principal établissant les termes et conditions d\'emploi à durée indéterminée.',
              category: 'Modèle juridique'
            }
          ]
        }
      ]
    },
    cdd: { title: 'CDD', sections: [] },
    freelance: { title: 'Freelance', sections: [] },
    stage: { title: 'Stage', sections: [] }
  };

  const handleContractSelect = (contract) => {
    setSelectedContract(contract);
    setCurrentView('employeeSelect');
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setContractVariables({
      'NOM EMPLOYE': `${employee.first_name} ${employee.last_name}` || '',
      'DATE NAISSANCE': employee.birth_date || '',
      'LIEU NAISSANCE': employee.birth_place || '',
      'NATIONALITE': 'Française',
      'ADRESSE EMPLOYE': employee.address || '',
      'NUMERO SECU': employee.social_security_number || '',
      'POSTE': employee.position || '',
      'SALAIRE': employee.salary || ''
    });
    setCurrentView('editor');
  };

  const handleBack = () => {
    if (currentView === 'editor') setCurrentView('employeeSelect');
    else if (currentView === 'employeeSelect') setCurrentView('templates');
    else onBack();
  };

  const addArticle = () => {
    const newArticle = {
      id: nextArticleId,
      title: "",
      content: "",
      order: articles.length + 1
    };
    setArticles([...articles, newArticle]);
    setNextArticleId(nextArticleId + 1);
    setCurrentArticleId(newArticle.id);
  };

  const deleteArticle = (id) => {
    if (window.confirm('Supprimer cet article ?')) {
      const newArticles = articles.filter(a => a.id !== id);
      newArticles.forEach((article, index) => article.order = index + 1);
      setArticles(newArticles);
      if (currentArticleId === id) setCurrentArticleId(null);
    }
  };

  const updateArticle = (id, field, value) => {
    setArticles(articles.map(article => 
      article.id === id ? { ...article, [field]: value } : article
    ));
  };

  const generatePreview = () => {
    let html = `
      <div class="text-center mb-8">
        ${companyLogo ? `<img src="${companyLogo}" alt="Logo" class="mx-auto mb-4 max-h-20 object-contain" />` : ''}
        <h1 class="text-2xl font-semibold tracking-tight mb-2">CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE</h1>
      </div>
      
      <div class="space-y-6 text-gray-800">
        <div>
          <p class="font-medium mb-2">Entre les soussignés :</p>
          <p>La société <span class="font-medium">[NOM ENTREPRISE]</span></p>
          <p>Société [FORME JURIDIQUE] au capital de [CAPITAL] euros</p>
          <p>Immatriculée au RCS de [VILLE] sous le numéro [RCS]</p>
          <p>Ayant son siège social au [ADRESSE ENTREPRISE]</p>
          <p>Représentée par [NOM EMPLOYEUR], en qualité de [FONCTION EMPLOYEUR]</p>
          <p class="mt-4 italic">Ci-après dénommée « l'Employeur »</p>
        </div>
        
        <div class="text-center font-medium">
          <p>D'une part,</p>
        </div>
        
        <div>
          <p class="font-medium mb-2">Et :</p>
          <p>Madame / Monsieur <span class="font-medium">[NOM EMPLOYE]</span></p>
          <p>Né(e) le [DATE NAISSANCE] à [LIEU NAISSANCE]</p>
          <p>De nationalité [NATIONALITE]</p>
          <p>Demeurant au [ADRESSE EMPLOYE]</p>
          <p>Numéro de sécurité sociale : [NUMERO SECU]</p>
          <p class="mt-4 italic">Ci-après dénommé(e) « le Salarié »</p>
        </div>
        
        <div class="text-center font-medium">
          <p>D'autre part,</p>
        </div>
        
        <div class="border-t border-gray-300 pt-6 mt-8">
          <p class="font-medium mb-4">IL A ÉTÉ CONVENU ET ARRÊTÉ CE QUI SUIT :</p>
        </div>
    `;
    
    articles.sort((a, b) => a.order - b.order).forEach((article, index) => {
      let formattedContent = article.content.replace(/\\n/g, '<br>');
      
      Object.entries(contractVariables).forEach(([key, value]) => {
        const regex = new RegExp(`\\\\[${key}\\\\]`, 'g');
        formattedContent = formattedContent.replace(regex, value || `[${key}]`);
      });
      
      html += `
        <div>
          <h3 class="font-semibold text-base mb-3">ARTICLE ${index + 1} - ${article.title}</h3>
          <p>${formattedContent}</p>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const content = generatePreview().replace(/<[^>]*>/g, '');
    const lines = content.split('\n').filter(line => line.trim());
    let yPosition = 20;
    
    lines.forEach((line) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line.trim(), 20, yPosition);
      yPosition += 6;
    });
    
    doc.save(`contrat-${selectedEmployee?.first_name}-${selectedEmployee?.last_name || 'nouveau'}.pdf`);
  };

  // Templates View
  if (currentView === 'templates') {
    return (
      <div className="min-h-screen bg-white">
        <div className=" mx-auto px-6 py-12">
          <div className="flex items-center mb-12">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg mr-4">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Gestion des Contrats</h1>
              <p className="text-lg text-gray-600">Créez et gérez vos contrats professionnels</p>
            </div>
          </div>

          <div className="mb-12">
            <div className="bg-gray-50 rounded-xl p-2 inline-flex">
              {Object.entries(contractTypes).map(([key, type]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-white/50'
                  }`}
                >
                  {type.title}
                </button>
              ))}
            </div>
          </div>

          {contractTypes[activeTab]?.sections?.length > 0 ? (
            <div className="space-y-12">
              {contractTypes[activeTab].sections.map((section) => (
                <div key={section.title} className="bg-white rounded-2xl border border-emerald-200 p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Play className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                      <p className="text-gray-600">Documents pour l'intégration des nouveaux employés</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {section.contracts.map((contract) => (
                      <div
                        key={contract.id}
                        onClick={() => handleContractSelect(contract)}
                        className="group border-2 border-gray-100 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="h-48 bg-gray-50 border-b p-6 relative">
                          <div className="absolute top-4 right-4">
                            <div className="w-10 h-10 rounded-lg bg-white/90 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-gray-700" />
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 font-mono">
                            <div className="font-semibold text-gray-800 text-sm mb-3">
                              CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE
                            </div>
                            <div className="space-y-1 opacity-75">
                              <div>Entre les soussignés :</div>
                              <div>La société [NOM ENTREPRISE]</div>
                              <div>Et : [NOM PRÉNOM DU SALARIÉ]</div>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-semibold text-gray-900 mb-2">{contract.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">{contract.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs bg-gray-50 px-3 py-1 rounded-full">{contract.category}</span>
                            <span className="text-xs text-gray-400">Cliquer pour éditer</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Contenu {contractTypes[activeTab]?.title} bientôt disponible...
            </div>
          )}
        </div>
      </div>
    );
  }

  // Employee Selection View
  if (currentView === 'employeeSelect') {
    return (
      <div className="min-h-screen bg-white">
        <div className=" mx-auto px-6 py-12">
          <div className="flex items-center mb-8">
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg mr-4">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sélectionner un employé</h1>
              <p className="text-gray-600">Choisissez l'employé pour le contrat {selectedContract?.title}</p>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Chargement des employés...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => handleEmployeeSelect(employee)}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {employee.first_name?.[0]}{employee.last_name?.[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{employee.first_name} {employee.last_name}</h3>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                      <p className="text-xs text-gray-500">{employee.department?.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Contract Editor View
  return (
    <div className="min-h-screen bg-white">
      <div className=" mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedContract?.title}</h1>
              <p className="text-gray-600">Employé: {selectedEmployee?.first_name} {selectedEmployee?.last_name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditorTab('preview')}
              className={`px-4 py-2 rounded-lg font-medium ${
                editorTab === 'preview' ? 'bg-gray-900 text-white' : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Aperçu
            </button>
            <button
              onClick={() => setEditorTab('edit')}
              className={`px-4 py-2 rounded-lg font-medium ${
                editorTab === 'edit' ? 'bg-gray-900 text-white' : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Éditer
            </button>
          </div>
        </div>

        {editorTab === 'preview' && (
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="max-w-4xl mx-auto bg-white border rounded-lg">
              <div className="p-12 text-sm" dangerouslySetInnerHTML={{ __html: generatePreview() }} />
            </div>
          </div>
        )}

        {editorTab === 'edit' && (
          <div className="bg-gray-50 rounded-xl">
            <div className="bg-white border-b px-8 py-6">
              <div className="flex justify-center gap-12">
                <button
                  onClick={() => setEditStep(1)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold ${
                    editStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    editStep === 1 ? 'bg-white/20 text-white' : 'bg-white text-gray-600'
                  }`}>1</div>
                  Variables
                </button>
                <div className={`w-20 h-1 rounded-full self-center ${
                  editStep === 2 ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
                <button
                  onClick={() => setEditStep(2)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold ${
                    editStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    editStep === 2 ? 'bg-white/20 text-white' : 'bg-white text-gray-600'
                  }`}>2</div>
                  Articles
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12">
              {editStep === 2 && (
                <div className="col-span-3 border-r bg-gray-50">
                  <div className="p-6 border-b bg-white">
                    <button
                      onClick={addArticle}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Nouvel article
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    {articles.sort((a, b) => a.order - b.order).map((article, index) => (
                      <div
                        key={article.id}
                        onClick={() => setCurrentArticleId(article.id)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          currentArticleId === article.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            currentArticleId === article.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteArticle(article.id); }}
                            className="p-1 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                        <div className="text-sm font-semibold text-gray-800 mb-1">
                          {article.title || 'Article sans titre'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {article.content.substring(0, 60)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className={`${editStep === 2 ? 'col-span-9' : 'col-span-12'} bg-white p-8 relative`}>
                <div className="max-w-4xl mx-auto space-y-8 pb-24">
                  {editStep === 1 && (
                    <>
                      {/* Logo Upload */}
                      <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-xl font-bold text-gray-900">Logo de l'entreprise</h4>
                        </div>
                        <div className="flex items-center gap-6">
                          {companyLogo ? (
                            <div className="flex items-center gap-6">
                              <div className="w-20 h-20 bg-white rounded-xl border-2 border-gray-200 p-2 shadow-sm">
                                <img src={companyLogo} alt="Logo" className="w-full h-full object-contain" />
                              </div>
                              <button
                                onClick={() => setCompanyLogo(null)}
                                className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                              >
                                Supprimer le logo
                              </button>
                            </div>
                          ) : (
                            <label className="cursor-pointer group">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (e) => setCompanyLogo(e.target.result);
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <div className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 text-base font-semibold shadow-lg group-hover:shadow-xl transform group-hover:scale-105">
                                📎 Ajouter un logo
                              </div>
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Variables Form */}
                      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                            <Edit3 className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-xl font-bold text-gray-900">Variables du contrat</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                            { key: 'NOM ENTREPRISE', label: 'Nom de l\'entreprise', type: 'text' },
                            { key: 'FORME JURIDIQUE', label: 'Forme juridique', type: 'text' },
                            { key: 'CAPITAL', label: 'Capital social', type: 'number' },
                            { key: 'VILLE', label: 'Ville du siège', type: 'text' },
                            { key: 'RCS', label: 'Numéro RCS', type: 'text' },
                            { key: 'ADRESSE ENTREPRISE', label: 'Adresse entreprise', type: 'textarea' },
                            { key: 'NOM EMPLOYEUR', label: 'Nom employeur', type: 'text' },
                            { key: 'FONCTION EMPLOYEUR', label: 'Fonction employeur', type: 'text' },
                            { key: 'NOM EMPLOYE', label: 'Nom employé', type: 'text' },
                            { key: 'DATE NAISSANCE', label: 'Date de naissance', type: 'date' },
                            { key: 'LIEU NAISSANCE', label: 'Lieu de naissance', type: 'text' },
                            { key: 'NATIONALITE', label: 'Nationalité', type: 'text' },
                            { key: 'ADRESSE EMPLOYE', label: 'Adresse employé', type: 'textarea' },
                            { key: 'NUMERO SECU', label: 'Numéro sécurité sociale', type: 'text' },
                            { key: 'POSTE', label: 'Poste', type: 'text' },
                            { key: 'STATUT', label: 'Statut', type: 'text' },
                            { key: 'DATE DEBUT', label: 'Date de début', type: 'date' },
                            { key: 'DUREE ESSAI', label: 'Durée d\'essai (mois)', type: 'number' },
                            { key: 'ADRESSE TRAVAIL', label: 'Adresse lieu de travail', type: 'textarea' },
                            { key: 'SALAIRE', label: 'Salaire mensuel brut', type: 'number' },
                            { key: 'HORAIRES', label: 'Horaires de travail', type: 'text' },
                            { key: 'CONGES', label: 'Jours de congés/RTT', type: 'number' },
                            { key: 'MISSION 1', label: 'Mission 1', type: 'text' },
                            { key: 'MISSION 2', label: 'Mission 2', type: 'text' },
                            { key: 'MISSION 3', label: 'Mission 3', type: 'text' },
                            { key: 'MISSION 4', label: 'Mission 4', type: 'text' }
                          ].map((variable) => (
                            <div key={variable.key} className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-800 mb-2">
                                {variable.label}
                              </label>
                              {variable.type === 'textarea' ? (
                                <textarea
                                  value={contractVariables[variable.key] || ''}
                                  onChange={(e) => setContractVariables(prev => ({ ...prev, [variable.key]: e.target.value }))}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                  rows={2}
                                  placeholder={`Saisir ${variable.label.toLowerCase()}`}
                                />
                              ) : (
                                <input
                                  type={variable.type}
                                  value={contractVariables[variable.key] || ''}
                                  onChange={(e) => setContractVariables(prev => ({ ...prev, [variable.key]: e.target.value }))}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                  placeholder={`Saisir ${variable.label.toLowerCase()}`}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {editStep === 2 && (
                    <>
                      {articles.sort((a, b) => a.order - b.order).map((article, index) => (
                        <div
                          key={article.id}
                          className={`p-8 border-2 rounded-2xl transition-all ${
                            currentArticleId === article.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                                currentArticleId === article.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-gray-900">Article {index + 1}</h4>
                                <p className={`text-sm font-medium ${
                                  currentArticleId === article.id ? 'text-blue-600' : 'text-gray-500'
                                }`}>
                                  {currentArticleId === article.id ? '✏️ En cours d\'édition' : '👆 Cliquez pour éditer'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            <div>
                              <label className="block text-base font-bold text-gray-800 mb-3">
                                📝 Titre de l'article
                              </label>
                              <input
                                type="text"
                                value={article.title}
                                onChange={(e) => updateArticle(article.id, 'title', e.target.value)}
                                onFocus={() => setCurrentArticleId(article.id)}
                                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm focus:shadow-md"
                                placeholder="Ex: ENGAGEMENT, RÉMUNÉRATION, DURÉE DU TRAVAIL..."
                              />
                            </div>
                            
                            <div>
                              <label className="block text-base font-bold text-gray-800 mb-3">
                                📄 Contenu de l'article
                              </label>
                              <textarea
                                value={article.content}
                                onChange={(e) => updateArticle(article.id, 'content', e.target.value)}
                                onFocus={() => setCurrentArticleId(article.id)}
                                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base leading-relaxed resize-none transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm focus:shadow-md"
                                rows={8}
                                placeholder="Rédigez le contenu de cet article. Vous pouvez utiliser des variables entre crochets comme [NOM ENTREPRISE], [DATE DEBUT], etc."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                
                <div className="fixed bottom-6 right-6">
                  {editStep === 1 ? (
                    <button
                      onClick={() => setEditStep(2)}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-lg"
                    >
                      Suivant : Articles <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditStep(1)}
                        className="flex items-center gap-2 px-4 py-3 border border-gray-300 bg-white rounded-xl hover:bg-gray-50 font-semibold"
                      >
                        <ArrowLeft className="w-4 h-4" /> Variables
                      </button>
                      <button
                        onClick={() => setEditorTab('preview')}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold"
                      >
                        <Eye className="w-5 h-5" /> Aperçu
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center p-6 border-t bg-white mt-8">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" /> Télécharger PDF
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                alert('Contrat enregistré avec succès !');
                setCurrentView('templates');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              <Save className="w-4 h-4" /> Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractEditor;