// 📄 Templates de contrats
export const contractTemplates = [
  {
    id: 1,
    name: "Contrat CDI Standard",
    type: "CDI",
    category: "standard",
    description: "Modèle de contrat à durée indéterminée pour postes permanents",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop",
    content: `CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE

Entre les soussignés :

La société {{companyName}}, SARL au capital de {{companyCapital}} euros, immatriculée au RCS de {{companyCity}} sous le numéro {{companyRCS}}, dont le siège social est situé {{companyAddress}}, représentée par {{employerName}}, en qualité de {{employerTitle}},

Ci-après dénommée « l'Employeur »,

D'une part,

Et {{employeeName}}, né(e) le {{employeeBirthDate}} à {{employeeBirthPlace}}, de nationalité {{employeeNationality}}, demeurant {{employeeAddress}},

Ci-après dénommé(e) « le Salarié »,

D'autre part,

IL A ÉTÉ CONVENU CE QUI SUIT :

ARTICLE 1 - ENGAGEMENT
L'Employeur engage le Salarié en qualité de {{jobTitle}} à compter du {{startDate}}.

ARTICLE 2 - FONCTIONS
Le Salarié exercera les fonctions de {{jobTitle}} et, d'une manière générale, toutes les tâches qui se rattachent à cette fonction.

ARTICLE 3 - LIEU DE TRAVAIL
Le Salarié exercera ses fonctions au {{workLocation}}.

ARTICLE 4 - DURÉE DU TRAVAIL
La durée du travail est fixée à {{weeklyHours}} heures par semaine, réparties du {{workDays}}.

ARTICLE 5 - PÉRIODE D'ESSAI
Le présent contrat est conclu sous réserve d'une période d'essai de {{trialPeriod}}, renouvelable une fois.

ARTICLE 6 - RÉMUNÉRATION
En contrepartie de son travail, le Salarié percevra une rémunération brute annuelle de {{salary}} euros, payable mensuellement.

ARTICLE 7 - CONGÉS PAYÉS
Le Salarié bénéficie de {{annualLeave}} jours de congés payés par an.

Fait à {{contractCity}}, le {{contractDate}}

L'Employeur                    Le Salarié
{{employerName}}              {{employeeName}}`,
    variables: [
      { key: "companyName", label: "Nom de l'entreprise", type: "text", required: true },
      { key: "companyCapital", label: "Capital social", type: "number", required: true },
      { key: "companyCity", label: "Ville du siège", type: "text", required: true },
      { key: "companyRCS", label: "Numéro RCS", type: "text", required: true },
      { key: "companyAddress", label: "Adresse entreprise", type: "textarea", required: true },
      { key: "employerName", label: "Nom employeur", type: "text", required: true },
      { key: "employerTitle", label: "Titre employeur", type: "text", required: true },
      { key: "employeeName", label: "Nom employé", type: "text", required: true },
      { key: "employeeBirthDate", label: "Date de naissance", type: "date", required: true },
      { key: "employeeBirthPlace", label: "Lieu de naissance", type: "text", required: true },
      { key: "employeeNationality", label: "Nationalité", type: "text", required: true },
      { key: "employeeAddress", label: "Adresse employé", type: "textarea", required: true },
      { key: "jobTitle", label: "Poste", type: "text", required: true },
      { key: "startDate", label: "Date de début", type: "date", required: true },
      { key: "workLocation", label: "Lieu de travail", type: "text", required: true },
      { key: "weeklyHours", label: "Heures par semaine", type: "number", required: true },
      { key: "workDays", label: "Jours de travail", type: "text", required: true },
      { key: "trialPeriod", label: "Période d'essai", type: "text", required: true },
      { key: "salary", label: "Salaire annuel brut", type: "number", required: true },
      { key: "annualLeave", label: "Congés payés", type: "number", required: true },
      { key: "contractCity", label: "Ville du contrat", type: "text", required: true },
      { key: "contractDate", label: "Date du contrat", type: "date", required: true }
    ]
  },
  {
    id: 2,
    name: "Contrat CDD",
    type: "CDD",
    category: "temporary",
    description: "Contrat à durée déterminée pour missions temporaires",
    thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=400&fit=crop",
    content: `CONTRAT DE TRAVAIL À DURÉE DÉTERMINÉE

Entre les soussignés :

{{companyName}}, représentée par {{employerName}},
Ci-après dénommée « l'Employeur »,

Et {{employeeName}},
Ci-après dénommé(e) « le Salarié »,

IL A ÉTÉ CONVENU CE QUI SUIT :

ARTICLE 1 - OBJET ET MOTIF
Le présent contrat est conclu pour {{contractReason}}.

ARTICLE 2 - DURÉE
Le contrat prend effet le {{startDate}} et se termine le {{endDate}}.

ARTICLE 3 - FONCTIONS
Le Salarié exercera les fonctions de {{jobTitle}}.

ARTICLE 4 - RÉMUNÉRATION
Salaire mensuel brut : {{monthlySalary}} euros.

ARTICLE 5 - RENOUVELLEMENT
{{renewalClause}}

Fait à {{contractCity}}, le {{contractDate}}

L'Employeur                    Le Salarié`,
    variables: [
      { key: "companyName", label: "Nom de l'entreprise", type: "text", required: true },
      { key: "employerName", label: "Nom employeur", type: "text", required: true },
      { key: "employeeName", label: "Nom employé", type: "text", required: true },
      { key: "contractReason", label: "Motif du CDD", type: "select", options: ["Remplacement", "Surcroît d'activité", "Mission temporaire"], required: true },
      { key: "startDate", label: "Date de début", type: "date", required: true },
      { key: "endDate", label: "Date de fin", type: "date", required: true },
      { key: "jobTitle", label: "Poste", type: "text", required: true },
      { key: "monthlySalary", label: "Salaire mensuel brut", type: "number", required: true },
      { key: "renewalClause", label: "Clause de renouvellement", type: "textarea", required: false },
      { key: "contractCity", label: "Ville du contrat", type: "text", required: true },
      { key: "contractDate", label: "Date du contrat", type: "date", required: true }
    ]
  },
  {
    id: 3,
    name: "Contrat Stage",
    type: "STAGE",
    category: "internship",
    description: "Convention de stage pour étudiants",
    thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300&h=400&fit=crop",
    content: `CONVENTION DE STAGE

Entre :
- L'établissement d'enseignement : {{schoolName}}
- L'entreprise d'accueil : {{companyName}}
- L'étudiant(e) : {{studentName}}

ARTICLE 1 - DURÉE ET PÉRIODE
Stage du {{startDate}} au {{endDate}}.
Durée hebdomadaire : {{weeklyHours}} heures.

ARTICLE 2 - MISSIONS
{{missions}}

ARTICLE 3 - GRATIFICATION
{{gratification}}

ARTICLE 4 - ENCADREMENT
Tuteur entreprise : {{companyTutor}}
Tuteur pédagogique : {{schoolTutor}}

Signatures :
Entreprise : {{employerName}}
Étudiant : {{studentName}}
École : {{schoolRepresentative}}`,
    variables: [
      { key: "schoolName", label: "Nom de l'école", type: "text", required: true },
      { key: "companyName", label: "Nom de l'entreprise", type: "text", required: true },
      { key: "studentName", label: "Nom de l'étudiant", type: "text", required: true },
      { key: "startDate", label: "Date de début", type: "date", required: true },
      { key: "endDate", label: "Date de fin", type: "date", required: true },
      { key: "weeklyHours", label: "Heures par semaine", type: "number", required: true },
      { key: "missions", label: "Missions du stage", type: "textarea", required: true },
      { key: "gratification", label: "Gratification", type: "text", required: false },
      { key: "companyTutor", label: "Tuteur entreprise", type: "text", required: true },
      { key: "schoolTutor", label: "Tuteur pédagogique", type: "text", required: true },
      { key: "employerName", label: "Représentant entreprise", type: "text", required: true },
      { key: "schoolRepresentative", label: "Représentant école", type: "text", required: true }
    ]
  },
  {
    id: 4,
    name: "Contrat Freelance",
    type: "FREELANCE",
    category: "independent",
    description: "Contrat de prestation pour travailleurs indépendants",
    thumbnail: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&h=400&fit=crop",
    content: `CONTRAT DE PRESTATION DE SERVICES

Entre :
{{companyName}}, ci-après « le Client »
{{freelancerName}}, ci-après « le Prestataire »

ARTICLE 1 - OBJET
{{serviceDescription}}

ARTICLE 2 - DURÉE
Du {{startDate}} au {{endDate}}

ARTICLE 3 - TARIFICATION
{{pricing}}

ARTICLE 4 - LIVRABLES
{{deliverables}}

ARTICLE 5 - MODALITÉS DE PAIEMENT
{{paymentTerms}}

Fait le {{contractDate}}

Le Client                    Le Prestataire
{{clientName}}              {{freelancerName}}`,
    variables: [
      { key: "companyName", label: "Nom du client", type: "text", required: true },
      { key: "freelancerName", label: "Nom du prestataire", type: "text", required: true },
      { key: "serviceDescription", label: "Description des services", type: "textarea", required: true },
      { key: "startDate", label: "Date de début", type: "date", required: true },
      { key: "endDate", label: "Date de fin", type: "date", required: true },
      { key: "pricing", label: "Tarification", type: "textarea", required: true },
      { key: "deliverables", label: "Livrables", type: "textarea", required: true },
      { key: "paymentTerms", label: "Modalités de paiement", type: "textarea", required: true },
      { key: "clientName", label: "Représentant client", type: "text", required: true },
      { key: "contractDate", label: "Date du contrat", type: "date", required: true }
    ]
  }
];

// 📋 Contrats générés
export const generatedContracts = [
  {
    id: 1,
    templateId: 1,
    templateName: "Contrat CDI Standard",
    employeeName: "Lucas Bernard",
    employeeId: 6,
    status: "draft",
    createdDate: "2025-01-20",
    createdBy: "Sophie Martin",
    lastModified: "2025-01-20",
    variables: {
      companyName: "TechCorp",
      companyCapital: "50000",
      companyCity: "Paris",
      companyRCS: "123456789",
      companyAddress: "123 Avenue des Champs-Élysées, 75008 Paris",
      employerName: "Marie Lefebvre",
      employerTitle: "Directrice Générale",
      employeeName: "Lucas Bernard",
      employeeBirthDate: "1992-12-15",
      employeeBirthPlace: "Marseille",
      employeeNationality: "Française",
      employeeAddress: "23 Rue de la République, 13001 Marseille",
      jobTitle: "Designer Junior",
      startDate: "2025-02-01",
      workLocation: "123 Avenue des Champs-Élysées, 75008 Paris",
      weeklyHours: "35",
      workDays: "lundi au vendredi",
      trialPeriod: "3 mois",
      salary: "38000",
      annualLeave: "25",
      contractCity: "Paris",
      contractDate: "2025-01-20"
    }
  }
];