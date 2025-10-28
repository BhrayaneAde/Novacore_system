from typing import Dict, List

# Templates de contrats suivant la structure frontend
contract_templates = [
    {
        "id": 1,
        "name": "Contrat CDI Standard",
        "type": "CDI",
        "category": "standard",
        "description": "Modèle de contrat à durée indéterminée pour postes permanents",
        "thumbnail": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop",
        "content": """CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE

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
{{employerName}}              {{employeeName}}""",
        "variables": [
            {"key": "companyName", "label": "Nom de l'entreprise", "type": "text", "required": True},
            {"key": "companyCapital", "label": "Capital social", "type": "number", "required": True},
            {"key": "companyCity", "label": "Ville du siège", "type": "text", "required": True},
            {"key": "companyRCS", "label": "Numéro RCS", "type": "text", "required": True},
            {"key": "companyAddress", "label": "Adresse entreprise", "type": "textarea", "required": True},
            {"key": "employerName", "label": "Nom employeur", "type": "text", "required": True},
            {"key": "employerTitle", "label": "Titre employeur", "type": "text", "required": True},
            {"key": "employeeName", "label": "Nom employé", "type": "text", "required": True},
            {"key": "employeeBirthDate", "label": "Date de naissance", "type": "date", "required": True},
            {"key": "employeeBirthPlace", "label": "Lieu de naissance", "type": "text", "required": True},
            {"key": "employeeNationality", "label": "Nationalité", "type": "text", "required": True},
            {"key": "employeeAddress", "label": "Adresse employé", "type": "textarea", "required": True},
            {"key": "jobTitle", "label": "Poste", "type": "text", "required": True},
            {"key": "startDate", "label": "Date de début", "type": "date", "required": True},
            {"key": "workLocation", "label": "Lieu de travail", "type": "text", "required": True},
            {"key": "weeklyHours", "label": "Heures par semaine", "type": "number", "required": True},
            {"key": "workDays", "label": "Jours de travail", "type": "text", "required": True},
            {"key": "trialPeriod", "label": "Période d'essai", "type": "text", "required": True},
            {"key": "salary", "label": "Salaire annuel brut", "type": "number", "required": True},
            {"key": "annualLeave", "label": "Congés payés", "type": "number", "required": True},
            {"key": "contractCity", "label": "Ville du contrat", "type": "text", "required": True},
            {"key": "contractDate", "label": "Date du contrat", "type": "date", "required": True}
        ]
    },
    {
        "id": 2,
        "name": "Contrat CDD",
        "type": "CDD",
        "category": "temporary",
        "description": "Contrat à durée déterminée pour missions temporaires",
        "thumbnail": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=400&fit=crop",
        "content": """CONTRAT DE TRAVAIL À DURÉE DÉTERMINÉE

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

L'Employeur                    Le Salarié""",
        "variables": [
            {"key": "companyName", "label": "Nom de l'entreprise", "type": "text", "required": True},
            {"key": "employerName", "label": "Nom employeur", "type": "text", "required": True},
            {"key": "employeeName", "label": "Nom employé", "type": "text", "required": True},
            {"key": "contractReason", "label": "Motif du CDD", "type": "select", "options": ["Remplacement", "Surcroît d'activité", "Mission temporaire"], "required": True},
            {"key": "startDate", "label": "Date de début", "type": "date", "required": True},
            {"key": "endDate", "label": "Date de fin", "type": "date", "required": True},
            {"key": "jobTitle", "label": "Poste", "type": "text", "required": True},
            {"key": "monthlySalary", "label": "Salaire mensuel brut", "type": "number", "required": True},
            {"key": "renewalClause", "label": "Clause de renouvellement", "type": "textarea", "required": False},
            {"key": "contractCity", "label": "Ville du contrat", "type": "text", "required": True},
            {"key": "contractDate", "label": "Date du contrat", "type": "date", "required": True}
        ]
    },
    {
        "id": 3,
        "name": "Contrat Stage",
        "type": "STAGE",
        "category": "internship",
        "description": "Convention de stage pour étudiants",
        "thumbnail": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300&h=400&fit=crop",
        "content": """CONVENTION DE STAGE

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
École : {{schoolRepresentative}}""",
        "variables": [
            {"key": "schoolName", "label": "Nom de l'école", "type": "text", "required": True},
            {"key": "companyName", "label": "Nom de l'entreprise", "type": "text", "required": True},
            {"key": "studentName", "label": "Nom de l'étudiant", "type": "text", "required": True},
            {"key": "startDate", "label": "Date de début", "type": "date", "required": True},
            {"key": "endDate", "label": "Date de fin", "type": "date", "required": True},
            {"key": "weeklyHours", "label": "Heures par semaine", "type": "number", "required": True},
            {"key": "missions", "label": "Missions du stage", "type": "textarea", "required": True},
            {"key": "gratification", "label": "Gratification", "type": "text", "required": False},
            {"key": "companyTutor", "label": "Tuteur entreprise", "type": "text", "required": True},
            {"key": "schoolTutor", "label": "Tuteur pédagogique", "type": "text", "required": True},
            {"key": "employerName", "label": "Représentant entreprise", "type": "text", "required": True},
            {"key": "schoolRepresentative", "label": "Représentant école", "type": "text", "required": True}
        ]
    },
    {
        "id": 4,
        "name": "Contrat Freelance",
        "type": "FREELANCE",
        "category": "independent",
        "description": "Contrat de prestation pour travailleurs indépendants",
        "thumbnail": "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&h=400&fit=crop",
        "content": """CONTRAT DE PRESTATION DE SERVICES

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
{{clientName}}              {{freelancerName}}""",
        "variables": [
            {"key": "companyName", "label": "Nom du client", "type": "text", "required": True},
            {"key": "freelancerName", "label": "Nom du prestataire", "type": "text", "required": True},
            {"key": "serviceDescription", "label": "Description des services", "type": "textarea", "required": True},
            {"key": "startDate", "label": "Date de début", "type": "date", "required": True},
            {"key": "endDate", "label": "Date de fin", "type": "date", "required": True},
            {"key": "pricing", "label": "Tarification", "type": "textarea", "required": True},
            {"key": "deliverables", "label": "Livrables", "type": "textarea", "required": True},
            {"key": "paymentTerms", "label": "Modalités de paiement", "type": "textarea", "required": True},
            {"key": "clientName", "label": "Représentant client", "type": "text", "required": True},
            {"key": "contractDate", "label": "Date du contrat", "type": "date", "required": True}
        ]
    },
    {
        "id": 5,
        "name": "CDI Cadre - Manager",
        "type": "CDI",
        "category": "manager",
        "description": "Contrat CDI pour postes de management avec forfait jours",
        "thumbnail": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
        "content": """CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE - CADRE

Entre :
{{companyName}}, représentée par {{employerName}}
Et {{employeeName}}, cadre dirigeant

ARTICLE 1 - ENGAGEMENT
Engagement en qualité de {{jobTitle}} - Statut Cadre

ARTICLE 2 - FORFAIT JOURS
Forfait annuel de {{annualDays}} jours

ARTICLE 3 - RESPONSABILITÉS
{{responsibilities}}

ARTICLE 4 - OBJECTIFS
{{objectives}}

ARTICLE 5 - RÉMUNÉRATION
Salaire fixe : {{fixedSalary}} euros
Variable : {{variableSalary}} euros
Avantages : {{benefits}}

Fait à {{contractCity}}, le {{contractDate}}""",
        "variables": [
            {"key": "companyName", "label": "Nom de l'entreprise", "type": "text", "required": True},
            {"key": "employerName", "label": "Nom employeur", "type": "text", "required": True},
            {"key": "employeeName", "label": "Nom employé", "type": "text", "required": True},
            {"key": "jobTitle", "label": "Poste de management", "type": "text", "required": True},
            {"key": "annualDays", "label": "Forfait jours annuel", "type": "number", "required": True},
            {"key": "responsibilities", "label": "Responsabilités", "type": "textarea", "required": True},
            {"key": "objectives", "label": "Objectifs", "type": "textarea", "required": True},
            {"key": "fixedSalary", "label": "Salaire fixe", "type": "number", "required": True},
            {"key": "variableSalary", "label": "Part variable", "type": "number", "required": False},
            {"key": "benefits", "label": "Avantages en nature", "type": "textarea", "required": False},
            {"key": "contractCity", "label": "Ville du contrat", "type": "text", "required": True},
            {"key": "contractDate", "label": "Date du contrat", "type": "date", "required": True}
        ]
    },
    {
        "id": 6,
        "name": "CDI Standard Bénin",
        "type": "CDI",
        "category": "benin",
        "description": "Contrat CDI selon la législation béninoise",
        "thumbnail": "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=400&fit=crop",
        "content": """CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE
(Selon le Code du Travail du Bénin)

Entre :
{{companyName}}, société de droit béninois
Registre du Commerce : {{companyRCCM}}
Siège social : {{companyAddress}}
Représentée par : {{employerName}}

Et :
{{employeeName}}
Né(e) le {{employeeBirthDate}} à {{employeeBirthPlace}}
Carte d'identité N° : {{employeeIdCard}}
Domicilié(e) à : {{employeeAddress}}

ARTICLE 1 - ENGAGEMENT
Engagement en qualité de {{jobTitle}} à compter du {{startDate}}

ARTICLE 2 - PÉRIODE D'ESSAI
Période d'essai de {{trialPeriod}} mois maximum

ARTICLE 3 - SALAIRE
Salaire mensuel brut : {{salary}} FCFA

ARTICLE 4 - SÉCURITÉ SOCIALE
Affiliation CNSS obligatoire
Cotisations : 3,6% salarié + 15,4% employeur

ARTICLE 5 - CONGÉS
Congés annuels : {{annualLeave}} jours ouvrables

Fait à {{contractCity}}, le {{contractDate}}

L'Employeur                    Le Salarié
{{employerName}}              {{employeeName}}""",
        "variables": [
            {"key": "companyName", "label": "Nom de l'entreprise", "type": "text", "required": True},
            {"key": "companyRCCM", "label": "Numéro RCCM", "type": "text", "required": True},
            {"key": "companyAddress", "label": "Adresse entreprise", "type": "textarea", "required": True},
            {"key": "employerName", "label": "Nom employeur", "type": "text", "required": True},
            {"key": "employeeName", "label": "Nom employé", "type": "text", "required": True},
            {"key": "employeeBirthDate", "label": "Date de naissance", "type": "date", "required": True},
            {"key": "employeeBirthPlace", "label": "Lieu de naissance", "type": "text", "required": True},
            {"key": "employeeIdCard", "label": "N° Carte d'identité", "type": "text", "required": True},
            {"key": "employeeAddress", "label": "Adresse employé", "type": "textarea", "required": True},
            {"key": "jobTitle", "label": "Poste", "type": "text", "required": True},
            {"key": "startDate", "label": "Date de début", "type": "date", "required": True},
            {"key": "trialPeriod", "label": "Période d'essai (mois)", "type": "number", "required": True},
            {"key": "salary", "label": "Salaire mensuel (FCFA)", "type": "number", "required": True},
            {"key": "annualLeave", "label": "Congés annuels", "type": "number", "required": True},
            {"key": "contractCity", "label": "Ville du contrat", "type": "text", "required": True},
            {"key": "contractDate", "label": "Date du contrat", "type": "date", "required": True}
        ]
    }
]

# Fonctions utilitaires
def get_template_by_id(template_id: int) -> Dict:
    """Récupère un template par son ID"""
    return next((t for t in contract_templates if t["id"] == template_id), None)

def get_templates_by_type(contract_type: str) -> List[Dict]:
    """Récupère les templates par type"""
    return [t for t in contract_templates if t["type"] == contract_type]

def get_templates_by_category(category: str) -> List[Dict]:
    """Récupère les templates par catégorie"""
    return [t for t in contract_templates if t["category"] == category]

def get_all_templates() -> List[Dict]:
    """Récupère tous les templates"""
    return contract_templates

def get_available_types() -> List[str]:
    """Liste des types de contrats disponibles"""
    return list(set(t["type"] for t in contract_templates))

def get_available_categories() -> List[str]:
    """Liste des catégories disponibles"""
    return list(set(t["category"] for t in contract_templates))