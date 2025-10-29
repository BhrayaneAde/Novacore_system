import { useState } from 'react';
import { Users, PenTool, FileText, Database, Target, CreditCard, ArrowRight, CheckCircle, X } from 'lucide-react';

const ModulesSection = () => {
  const [activeModal, setActiveModal] = useState(null);

  const modules = [
    {
      id: 'hire',
      icon: Users,
      color: 'blue',
      title: 'NovaHire',
      description: 'Recrutement simplifié et suivi des candidatures.',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop',
      subtitle: 'Module de recrutement',
      details: 'NovaHire transforme votre processus de recrutement en une expérience fluide et efficace.',
      features: [
        'Publiez vos offres d\'emploi sur plusieurs plateformes en un clic',
        'Suivez les candidatures à travers un pipeline visuel intuitif',
        'Collaborez avec votre équipe sur l\'évaluation des candidats',
        'Automatisez les communications et les relances'
      ]
    },
    {
      id: 'sign',
      icon: PenTool,
      color: 'purple',
      title: 'NovaSign',
      description: 'Signature électronique sécurisée pour tous vos documents RH.',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop',
      subtitle: 'Signature électronique',
      details: 'NovaSign garantit la sécurité juridique et accélère la signature de tous vos documents RH.',
      features: [
        'Conformité légale avec les normes eIDAS et les réglementations locales',
        'Signature multi-parties avec suivi en temps réel',
        'Certificats d\'authenticité et traçabilité complète',
        'Interface intuitive accessible depuis n\'importe quel appareil'
      ]
    },
    {
      id: 'contrat',
      icon: FileText,
      color: 'green',
      title: 'NovaContrat',
      description: 'Gestion complète des contrats de travail.',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop',
      subtitle: 'Gestion des contrats',
      details: 'NovaContrat centralise et automatise la gestion de tous vos contrats de travail.',
      features: [
        'Bibliothèque de modèles personnalisables et conformes',
        'Génération automatique avec remplissage intelligent des données',
        'Alertes pour les renouvellements et échéances importantes',
        'Archivage sécurisé avec historique complet des versions'
      ]
    },
    {
      id: 'people',
      icon: Database,
      color: 'orange',
      title: 'NovaPeople',
      description: 'Base de données employés complète et actualisée.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
      subtitle: 'Base de données employés',
      details: 'NovaPeople est votre référentiel unique pour toutes les informations liées à vos employés.',
      features: [
        'Profils employés détaillés avec historique complet',
        'Organigramme dynamique et visualisation d\'équipe',
        'Gestion des compétences, certifications et formations',
        'Recherche avancée et rapports personnalisables'
      ]
    },
    {
      id: 'perform',
      icon: Target,
      color: 'indigo',
      title: 'NovaPerform',
      description: 'Évaluation des performances et objectifs SMART.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      subtitle: 'Évaluation des performances',
      details: 'NovaPerform transforme la gestion des performances en un processus continu et constructif.',
      features: [
        'Définition et suivi d\'objectifs SMART alignés avec la stratégie',
        'Évaluations périodiques avec feedback à 360 degrés',
        'Plans de développement individuels personnalisés',
        'Analytics et tableaux de bord pour mesurer la progression'
      ]
    },
    {
      id: 'pay',
      icon: CreditCard,
      color: 'emerald',
      title: 'NovaPay',
      description: 'Gestion automatisée de la paie avec conformité légale.',
      image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=400&fit=crop',
      subtitle: 'Gestion de la paie',
      details: 'NovaPay simplifie et sécurise l\'ensemble de votre processus de paie.',
      features: [
        'Calcul automatique des salaires avec toutes les variables',
        'Conformité garantie avec les législations locales',
        'Génération automatique des bulletins de paie et déclarations',
        'Intégration bancaire pour virements automatiques'
      ]
    }
  ];

  const openModal = (moduleId) => {
    setActiveModal(moduleId);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto';
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-50', text: 'text-secondary-600', hover: 'hover:text-secondary-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', hover: 'hover:text-purple-600' },
      green: { bg: 'bg-green-50', text: 'text-green-600', hover: 'hover:text-green-600' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', hover: 'hover:text-orange-600' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', hover: 'hover:text-indigo-600' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', hover: 'hover:text-emerald-600' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      <section id="modules" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 mb-6">
              Modules intégrés pour tout le cycle RH
            </h1>
            <p className="text-xl text-gray-600 font-normal">
              De l'embauche au développement, gérez chaque étape avec des outils connectés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const IconComponent = module.icon;
              const colorClasses = getColorClasses(module.color);
              
              return (
                <div
                  key={module.id}
                  className="group border border-gray-200 rounded-xl p-8 hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer bg-white"
                >
                  <div className="mb-6">
                    <div className={`w-12 h-12 rounded-lg ${colorClasses.bg} flex items-center justify-center mb-5`}>
                      <IconComponent className={`w-6 h-6 ${colorClasses.text}`} />
                    </div>
                    <img
                      src={module.image}
                      alt={module.title}
                      className="w-full h-40 object-cover rounded-lg mb-5"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{module.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{module.description}</p>
                  <button
                    onClick={() => openModal(module.id)}
                    className={`inline-flex items-center text-sm font-medium text-gray-900 ${colorClasses.hover} transition-colors`}
                  >
                    En savoir plus
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal Backdrop */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={closeModal}
        />
      )}

      {/* Modals */}
      {modules.map((module) => {
        if (activeModal !== module.id) return null;
        
        const IconComponent = module.icon;
        const colorClasses = getColorClasses(module.color);
        
        return (
          <div key={module.id} className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl transform transition-all">
                <div className="p-8 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-lg ${colorClasses.bg} flex items-center justify-center mr-4`}>
                        <IconComponent className={`w-6 h-6 ${colorClasses.text}`} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                          {module.title}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">{module.subtitle}</p>
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  <img
                    src={module.image}
                    alt={module.title}
                    className="w-full h-56 object-cover rounded-lg mb-6"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{module.description}</h3>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>{module.details}</p>
                    <ul className="space-y-3">
                      {module.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className={`w-5 h-5 ${colorClasses.text} mr-3 mt-0.5 flex-shrink-0`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="p-8 bg-gray-50 rounded-b-2xl flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ModulesSection;