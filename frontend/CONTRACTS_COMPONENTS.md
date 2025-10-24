# 🧩 Composants du Module Contrats

## ✅ 5 Composants Créés

### 1. **ContractTemplate**
**Fichier**: `components/ContractTemplate.jsx`

#### Description
Composant pour afficher un template de contrat sélectionnable.

#### Props
```javascript
{
  type: string,           // "CDI", "CDD", etc.
  name: string,           // "Contrat à Durée Indéterminée"
  description: string,    // Description du type
  icon: string,           // Emoji "📄"
  selected: boolean,      // État de sélection
  onClick: function       // Callback de sélection
}
```

#### Fonctionnalités
- ✅ Affichage avec icône emoji
- ✅ État sélectionné avec ring bleu
- ✅ Checkmark quand sélectionné
- ✅ Hover effects
- ✅ Transition smooth

#### Utilisation
```jsx
<ContractTemplate
  type="CDI"
  name="Contrat à Durée Indéterminée"
  description="Contrat permanent sans date de fin"
  icon="📄"
  selected={selectedType === "CDI"}
  onClick={() => setSelectedType("CDI")}
/>
```

---

### 2. **EmployeeSelector**
**Fichier**: `components/EmployeeSelector.jsx`

#### Description
Composant pour sélectionner un employé dans une liste.

#### Props
```javascript
{
  employees: Array,       // Liste des employés
  selectedId: number,     // ID de l'employé sélectionné
  onSelect: function      // Callback avec employé sélectionné
}
```

#### Structure employé
```javascript
{
  id: number,
  name: string,
  department: string,
  avatar: string,
  currentPosition: string  // Optionnel
}
```

#### Fonctionnalités
- ✅ Avatar circulaire
- ✅ Nom + département
- ✅ Poste actuel (si disponible)
- ✅ Checkmark sur sélection
- ✅ Border bleu sur sélection
- ✅ Hover effects

#### Utilisation
```jsx
<EmployeeSelector
  employees={employeesList}
  selectedId={selectedEmployeeId}
  onSelect={(employee) => {
    setSelectedEmployeeId(employee.id);
    setSelectedEmployeeName(employee.name);
  }}
/>
```

---

### 3. **ContractForm**
**Fichier**: `components/ContractForm.jsx`

#### Description
Formulaire complet pour saisir les détails du contrat.

#### Props
```javascript
{
  formData: object,       // Données du formulaire
  onChange: function,     // Callback de changement
  contractType: string    // Type de contrat (pour champs conditionnels)
}
```

#### Champs du formulaire
```javascript
{
  position: string,           // Poste *
  department: string,         // Département *
  startDate: string,          // Date début *
  endDate: string,            // Date fin (si CDD/Stage/Intérim)
  salary: number,             // Salaire/Gratification *
  workingHours: number,       // Heures hebdo *
  trialPeriod: string,        // Période d'essai (si CDI/CDD)
  workplace: string,          // Lieu de travail *
  specificClauses: string     // Clauses optionnelles
}
```

#### Fonctionnalités
- ✅ Champs conditionnels selon type
- ✅ Validation HTML5
- ✅ Placeholders contextuels
- ✅ Hints et infos légales
- ✅ Labels avec astérisques requis
- ✅ Focus ring bleu

#### Départements disponibles
- IT / Informatique
- Ressources Humaines
- Finance / Comptabilité
- Marketing / Communication
- Commercial / Ventes
- Production
- Logistique

#### Validations
- **Poste**: Requis
- **Département**: Requis
- **Date début**: Requis
- **Date fin**: Requis si CDD/Stage/Intérim
- **Salaire**: Requis, min 0, step 50
- **Heures**: Requis, min 1, max 48
- **Lieu**: Requis

#### Utilisation
```jsx
<ContractForm
  formData={formData}
  onChange={(field, value) => setFormData({...formData, [field]: value})}
  contractType="CDI"
/>
```

---

### 4. **ProgressSteps**
**Fichier**: `components/ProgressSteps.jsx`

#### Description
Barre de progression avec étapes pour processus multi-étapes.

#### Props
```javascript
{
  steps: Array,           // Liste des étapes
  currentStep: number     // Étape actuelle (1-based)
}
```

#### Structure step
```javascript
{
  num: number,            // Numéro de l'étape
  label: string,          // Label affiché
  icon: Component         // Composant icône Lucide
}
```

#### Fonctionnalités
- ✅ Cercles avec icônes
- ✅ Labels sous les cercles
- ✅ Lignes de connexion
- ✅ États: actif/inactif/complété
- ✅ Couleurs: bleu (actif), gris (inactif)
- ✅ Transitions smooth

#### Exemple d'étapes
```javascript
const steps = [
  { num: 1, label: "Type", icon: FileText },
  { num: 2, label: "Employé", icon: User },
  { num: 3, label: "Détails", icon: Calendar },
  { num: 4, label: "Finalisation", icon: CheckCircle },
];
```

#### Utilisation
```jsx
<ProgressSteps
  steps={steps}
  currentStep={2}
/>
```

---

### 5. **ContractSummary**
**Fichier**: `components/ContractSummary.jsx`

#### Description
Affichage récapitulatif des informations du contrat avant génération.

#### Props
```javascript
{
  contractData: object    // Toutes les données du contrat
}
```

#### Données affichées
```javascript
{
  contractType: string,       // Type de contrat
  employeeName: string,       // Nom employé
  position: string,           // Poste
  department: string,         // Département
  salary: number,             // Salaire
  workingHours: number,       // Heures
  startDate: string,          // Date début
  endDate: string,            // Date fin (optionnel)
  workplace: string,          // Lieu
  trialPeriod: string,        // Période essai (optionnel)
  specificClauses: string     // Clauses (optionnel)
}
```

#### Fonctionnalités
- ✅ Cartes avec icônes colorées
- ✅ Formatage des dates en français
- ✅ Traduction des types de contrat
- ✅ Affichage conditionnel
- ✅ Section spéciale pour clauses
- ✅ Design avec fond gris clair

#### Icônes par section
- 📄 FileText → Type de contrat (bleu)
- 👤 User → Employé (violet)
- 📝 FileText → Poste (vert)
- 💰 DollarSign → Rémunération (orange)
- 📅 Calendar → Dates (cyan)
- 📍 MapPin → Lieu (indigo)
- ⏱️ Clock → Période d'essai (rose)

#### Utilisation
```jsx
<ContractSummary
  contractData={formData}
/>
```

---

## 📁 Structure des Fichiers

```
src/pages/Contracts/
├── ContractsOverview.jsx
├── ContractCreate.jsx
├── ContractPromotion.jsx
├── ContractsList.jsx
└── components/
    ├── ContractTemplate.jsx       ← Sélection template
    ├── EmployeeSelector.jsx       ← Sélection employé
    ├── ContractForm.jsx           ← Formulaire détails
    ├── ProgressSteps.jsx          ← Barre progression
    └── ContractSummary.jsx        ← Récapitulatif
```

---

## 🎨 Design System

### Couleurs
```css
/* États */
Selected:   border-blue-500, ring-blue-500, bg-blue-50
Hover:      border-blue-300, shadow-md
Default:    border-gray-200

/* Icônes */
Blue:       text-blue-600
Purple:     text-purple-600
Green:      text-green-600
Orange:     text-orange-600
Cyan:       text-cyan-600
Indigo:     text-indigo-600
Pink:       text-pink-600
```

### Espacements
```css
Gap:        gap-3, gap-4
Padding:    p-4
Margin:     mb-1, mb-2, mt-1
Rounded:    rounded-lg
```

### Transitions
```css
transition-all
duration-200
hover:scale-105
```

---

## 🔄 Flux d'Utilisation

### Dans ContractCreate.jsx

```jsx
import ContractTemplate from './components/ContractTemplate';
import EmployeeSelector from './components/EmployeeSelector';
import ContractForm from './components/ContractForm';
import ProgressSteps from './components/ProgressSteps';
import ContractSummary from './components/ContractSummary';

// Étape 1: Templates
<ContractTemplate ... />

// Étape 2: Employé
<EmployeeSelector ... />

// Étape 3: Formulaire
<ContractForm ... />

// Étape 4: Récapitulatif
<ContractSummary ... />

// Progress bar (toujours visible)
<ProgressSteps steps={steps} currentStep={step} />
```

---

## ✅ Avantages des Composants

### Réutilisabilité
- ✅ Utilisables dans ContractCreate
- ✅ Utilisables dans ContractPromotion
- ✅ Utilisables dans d'autres modules

### Maintenabilité
- ✅ Code isolé et testable
- ✅ Props bien définies
- ✅ Logique séparée

### Cohérence
- ✅ Design uniforme
- ✅ Comportements identiques
- ✅ Styles partagés

### Performance
- ✅ Composants légers
- ✅ Re-renders optimisés
- ✅ Pas de logique lourde

---

## 🎯 Prochaines Étapes

### Composants additionnels à créer
- [ ] **ContractPreview** - Aperçu PDF du contrat
- [ ] **ContractSignature** - Zone de signature électronique
- [ ] **ContractHistory** - Historique des modifications
- [ ] **ContractStatus** - Badge de statut avec tooltip
- [ ] **ContractActions** - Menu d'actions (télécharger, modifier, etc.)

### Améliorations possibles
- [ ] Validation avancée des formulaires
- [ ] Auto-completion des champs
- [ ] Suggestions de salaire selon poste
- [ ] Calcul automatique des charges
- [ ] Preview en temps réel

---

## 🎉 Résultat

**5 composants réutilisables créés avec succès !**

✅ **ContractTemplate** - Sélection de template
✅ **EmployeeSelector** - Sélection d'employé  
✅ **ContractForm** - Formulaire complet
✅ **ProgressSteps** - Barre de progression
✅ **ContractSummary** - Récapitulatif

**Le module Contrats est maintenant complet avec ses composants ! 🚀**
