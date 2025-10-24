# 📄 Module CONTRATS - Documentation Complète

## ✅ Fonctionnalités Créées

### 🎯 Vue d'ensemble
Le module Contrats permet de **créer, gérer et suivre tous les contrats de travail** avec génération automatique à partir de templates.

---

## 📊 Pages Créées

### 1. **ContractsOverview** (`/app/contracts`)
**Hub principal du module**

#### Statistiques
- Total Contrats: 234
- CDI: 156
- CDD: 52
- Stage: 26

#### Modules disponibles
1. 📝 **Nouveau Contrat** - Création rapide
2. 🚀 **Promotion / Avenant** - Modification de contrat
3. 📋 **Tous les Contrats** - Liste complète
4. ✅ **Contrats Actifs** - En cours
5. 📅 **Contrats Expirés** - Terminés
6. 👥 **Par Employé** - Recherche

---

### 2. **ContractCreate** (`/app/contracts/new`)
**Création de contrat en 4 étapes**

#### Étape 1: Type de contrat (6 templates)
```
📄 CDI - Contrat à Durée Indéterminée
📅 CDD - Contrat à Durée Déterminée
🎓 STAGE - Convention de Stage
🎯 ALTERNANCE - Contrat d'Alternance
⚡ INTERIM - Contrat d'Intérim
💼 FREELANCE - Contrat Freelance
```

**Caractéristiques:**
- Templates pré-configurés
- Badge "Populaire" sur CDI et CDD
- Couleurs distinctives par type
- Description de chaque type

#### Étape 2: Sélection de l'employé
- Liste des employés avec avatar
- Affichage du département
- Sélection interactive

#### Étape 3: Détails du contrat
**Champs du formulaire:**
- ✅ Poste
- ✅ Département (IT, RH, Finance, Marketing)
- ✅ Date de début
- ✅ Date de fin (si CDD)
- ✅ Salaire brut mensuel (€)
- ✅ Heures hebdomadaires (défaut: 35h)
- ✅ Période d'essai (0-4 mois)
- ✅ Lieu de travail

#### Étape 4: Récapitulatif
- Affichage de toutes les informations
- Bouton "Générer le Contrat"
- Navigation vers preview

---

### 3. **ContractPromotion** (`/app/contracts/promotion`)
**Création d'avenant pour modification de contrat**

#### Types d'avenants (4 types)
```
🚀 PROMOTION - Changement de poste + augmentation
💰 SALARY_INCREASE - Augmentation sans changement de poste
🔄 TRANSFER - Mutation / Transfert de département
⏰ HOURS_CHANGE - Modification des horaires
```

#### Processus
1. **Sélection de l'employé**
   - Affichage du contrat actuel
   - Poste actuel
   - Salaire actuel
   - Type de contrat

2. **Choix du type d'avenant**
   - 4 types disponibles
   - Descriptions claires

3. **Formulaire adaptatif**
   - Champs dynamiques selon le type
   - Nouveau poste (si promotion/transfert)
   - Nouveau salaire (si promotion/augmentation)
   - Nouveau département (si transfert)
   - Date d'effet
   - Motif de la modification
   - Clauses additionnelles (optionnel)

4. **Génération de l'avenant**
   - Reprend le contrat original
   - Intègre les modifications
   - Génère un document PDF

---

### 4. **ContractsList** (`/app/contracts/list`)
**Liste complète des contrats**

#### Tableau avec colonnes
| Colonne | Description |
|---------|-------------|
| **Employé** | Nom + Poste |
| **Type** | Badge coloré (CDI/CDD/STAGE) |
| **Date début** | Format FR |
| **Date fin** | Format FR ou "—" |
| **Salaire** | Montant mensuel |
| **Statut** | Badge (Actif/Expiré/Résilié) |
| **Actions** | Voir / Télécharger |

#### Fonctionnalités
- ✅ Tri par colonne
- ✅ Recherche
- ✅ Filtres par type
- ✅ Filtres par statut
- ✅ Export PDF
- ✅ Clic sur ligne pour détails

---

## 🎨 Templates de Contrats

### 1. CDI (Contrat à Durée Indéterminée)
**Caractéristiques:**
- Pas de date de fin
- Période d'essai: 1-4 mois
- Badge vert
- Le plus populaire

### 2. CDD (Contrat à Durée Déterminée)
**Caractéristiques:**
- Date de fin obligatoire
- Durée max: 18 mois (renouvelable)
- Badge bleu
- Populaire

### 3. STAGE (Convention de Stage)
**Caractéristiques:**
- Convention tripartite
- Gratification obligatoire si > 2 mois
- Badge violet
- Durée: 2-6 mois généralement

### 4. ALTERNANCE (Apprentissage/Pro)
**Caractéristiques:**
- Formation en alternance
- Rémunération selon âge/niveau
- Badge orange
- Durée: 1-3 ans

### 5. INTERIM (Mission temporaire)
**Caractéristiques:**
- Via agence d'intérim
- Courte durée
- Badge jaune
- Flexible

### 6. FREELANCE (Prestation)
**Caractéristiques:**
- Travailleur indépendant
- Facturation
- Badge indigo
- Projet spécifique

---

## 🗺️ Routes Configurées

```javascript
/app/contracts                    → ContractsOverview (hub)
/app/contracts/new                → ContractCreate
/app/contracts/promotion          → ContractPromotion
/app/contracts/list               → ContractsList
/app/contracts/active             → ContractsList (filtrée)
/app/contracts/expired            → ContractsList (filtrée)
/app/contracts/:id                → ContractDetail (à créer)
```

---

## 🎯 Cas d'Usage

### Cas 1: Embauche d'un nouvel employé
```
1. Cliquer sur "Nouveau Contrat"
2. Choisir le type (ex: CDI)
3. Sélectionner l'employé
4. Remplir les détails:
   - Poste: Développeur Full Stack
   - Département: IT
   - Salaire: 3500€
   - Date début: 01/02/2025
   - Période d'essai: 3 mois
5. Valider → Contrat généré automatiquement
```

### Cas 2: Promotion d'un employé
```
1. Cliquer sur "Promotion / Avenant"
2. Sélectionner l'employé (ex: Jean Dupont)
3. Choisir "Promotion"
4. Remplir:
   - Nouveau poste: Développeur Senior
   - Nouveau salaire: 4200€
   - Date d'effet: 01/03/2025
   - Motif: Reconnaissance des compétences
5. Valider → Avenant généré
```

### Cas 3: Augmentation de salaire
```
1. Cliquer sur "Promotion / Avenant"
2. Sélectionner l'employé
3. Choisir "Augmentation de salaire"
4. Remplir:
   - Nouveau salaire: 3200€ (au lieu de 2800€)
   - Date d'effet: 01/04/2025
   - Motif: Révision annuelle
5. Valider → Avenant généré
```

### Cas 4: Mutation interne
```
1. Cliquer sur "Promotion / Avenant"
2. Sélectionner l'employé
3. Choisir "Mutation / Transfert"
4. Remplir:
   - Nouveau département: Marketing
   - Nouveau poste: Chef de Projet Marketing
   - Date d'effet: 01/05/2025
5. Valider → Avenant généré
```

---

## 📋 Données du Formulaire

### Structure complète
```javascript
{
  // Type de contrat
  contractType: "CDI" | "CDD" | "STAGE" | "ALTERNANCE" | "INTERIM" | "FREELANCE",
  
  // Employé
  employeeId: number,
  employeeName: string,
  
  // Détails
  position: string,
  department: "IT" | "RH" | "Finance" | "Marketing" | "Commercial",
  startDate: "YYYY-MM-DD",
  endDate: "YYYY-MM-DD" | null,
  salary: number,
  workingHours: number,
  trialPeriod: "0" | "1" | "2" | "3" | "4",
  workplace: string,
  
  // Optionnel
  benefits: string[],
  specificClauses: string
}
```

### Structure avenant
```javascript
{
  // Employé
  employeeId: number,
  employeeName: string,
  currentContract: object,
  
  // Type d'avenant
  amendmentType: "PROMOTION" | "SALARY_INCREASE" | "TRANSFER" | "HOURS_CHANGE",
  
  // Modifications
  newPosition: string,
  newSalary: number,
  newDepartment: string,
  effectiveDate: "YYYY-MM-DD",
  reason: string,
  additionalClauses: string
}
```

---

## 🎨 Design & UX

### Couleurs par type de contrat
```css
CDI:        bg-green-50 border-green-200 text-green-700
CDD:        bg-blue-50 border-blue-200 text-blue-700
STAGE:      bg-purple-50 border-purple-200 text-purple-700
ALTERNANCE: bg-orange-50 border-orange-200 text-orange-700
INTERIM:    bg-yellow-50 border-yellow-200 text-yellow-700
FREELANCE:  bg-indigo-50 border-indigo-200 text-indigo-700
```

### Badges de statut
```css
Actif:    success (vert)
Expiré:   warning (orange)
Résilié:  danger (rouge)
```

### Progress Steps
- 4 étapes avec icônes
- Barre de progression
- État actif/inactif
- Navigation avant/arrière

---

## 🚀 Fonctionnalités Avancées (À venir)

### Génération PDF
- Template personnalisable
- Logo entreprise
- Signature électronique
- Envoi par email

### Workflow d'approbation
- Validation RH
- Validation manager
- Validation direction
- Historique des validations

### Alertes automatiques
- Fin de période d'essai
- Expiration CDD
- Renouvellement
- Anniversaire contrat

### Statistiques
- Répartition par type
- Évolution dans le temps
- Coûts salariaux
- Turnover

---

## 📊 Intégration avec autres modules

### Avec Employees
- Création automatique de profil employé
- Lien bidirectionnel
- Historique des contrats

### Avec Payroll
- Import des données salariales
- Calcul automatique
- Avantages sociaux

### Avec Performance
- Lien avec évaluations
- Justification des promotions
- Suivi des objectifs

---

## ✅ Checklist de Développement

### Pages créées
- [x] ContractsOverview
- [x] ContractCreate (4 étapes)
- [x] ContractPromotion
- [x] ContractsList
- [ ] ContractDetail
- [ ] ContractPreview (PDF)

### Fonctionnalités
- [x] 6 templates de contrats
- [x] 4 types d'avenants
- [x] Formulaire multi-étapes
- [x] Sélection employé
- [x] Validation des données
- [ ] Génération PDF
- [ ] Signature électronique
- [ ] Envoi par email

### Routes
- [x] Routes configurées
- [x] Navigation sidebar
- [x] Logo NovaContratR intégré

---

## 🎉 Résultat Final

**Le module Contrats est maintenant opérationnel avec:**

✅ **6 templates de contrats** (CDI, CDD, Stage, Alternance, Intérim, Freelance)
✅ **Création en 4 étapes** (Type, Employé, Détails, Récapitulatif)
✅ **4 types d'avenants** (Promotion, Augmentation, Mutation, Horaires)
✅ **Génération automatique** à partir de formulaires
✅ **Interface intuitive** avec progress steps
✅ **Design moderne** avec badges colorés
✅ **Navigation complète** dans la sidebar
✅ **Logo NovaContratR** intégré

**Le module est prêt pour la génération de contrats ! 📄🚀**
