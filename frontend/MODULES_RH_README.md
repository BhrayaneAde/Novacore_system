# 🚀 NovaCore - Structure Modulaire RH Complète

## ✅ Ce qui a été créé

### 📦 1. Gestion d'état avec Zustand
- **Fichier**: `src/store/useHRStore.js`
- **Fonctionnalités**:
  - Gestion des employés (CRUD)
  - Gestion des congés et présences
  - Gestion de la paie
  - Gestion des performances
  - Gestion du recrutement
  - Mode sombre (dark mode)
  - Recherche et filtres

### 📊 2. Données mockées centralisées
- **Fichier**: `src/data/mockData.js`
- **Contenu**:
  - 6 employés avec profils complets
  - Enregistrements de présence
  - Demandes de congés
  - Registres de paie
  - Évaluations de performance
  - Offres d'emploi et candidats
  - Départements

### 🎨 3. Composants UI réutilisables
**Dossier**: `src/components/ui/`

| Composant | Description | Props principales |
|-----------|-------------|-------------------|
| `Button.jsx` | Bouton personnalisable | variant, size, icon, onClick |
| `Card.jsx` | Carte avec titre et actions | title, subtitle, actions |
| `Table.jsx` | Tableau dynamique | columns, data, onRowClick |
| `Modal.jsx` | Fenêtre modale | isOpen, onClose, title, size |
| `Badge.jsx` | Badge de statut | variant, size |

### 🏗️ 4. Layout global réutilisable
- **Fichier**: `src/layouts/DashboardLayout.jsx`
- Intègre automatiquement Sidebar + Header
- Utilisé par toutes les pages modules

### 📄 5. Pages des modules RH

#### 👥 **EmployeesPage** (`/app/employees`)
- Liste complète des employés
- Tableau avec avatar, poste, département, statut
- Modal d'ajout d'employé avec formulaire complet
- Intégration avec le store Zustand

#### 📅 **AttendancePage** (`/app/attendance`)
- Statistiques de présence (taux, demandes en attente)
- Tableau des demandes de congés
- Actions d'approbation/rejet en un clic
- Badges de statut colorés

#### 💰 **PayrollPage** (`/app/payroll`)
- Registre de paie mensuel
- Détails: salaire de base, bonus, déductions, net
- Statistiques: total, traités, en attente
- Actions de téléchargement et envoi

#### 🎯 **PerformancePage** (`/app/performance`)
- Évaluations avec système d'étoiles (1-5)
- Objectifs avec barres de progression
- Feedback et dates d'évaluation
- Statistiques globales (note moyenne, objectifs atteints)

#### 👔 **RecruitmentPage** (`/app/recruitment`)
- Onglets: Candidats / Offres d'emploi
- Tableau des candidats avec statut du processus
- Gestion des offres d'emploi ouvertes/fermées
- Statistiques: postes ouverts, candidatures totales

#### ⚙️ **SettingsPage** (`/app/settings`)
- **Apparence**: Toggle dark mode
- **Notifications**: Email, push, alertes spécifiques
- **Profil**: Nom, email, poste
- **Sécurité**: Changement de mot de passe
- **Entreprise**: Nom, secteur, nombre d'employés

### 🧭 6. Navigation avec React Router

#### Routes configurées dans `AppRouter.jsx`:
```
/                       → LandingPage (publique)
/login                  → LoginPage (publique)
/register               → RegisterPage (publique)
/app                    → Redirection vers /app/dashboard
/app/dashboard          → Dashboard principal (protégée)
/app/employees          → Gestion des employés (protégée)
/app/attendance         → Présence & Congés (protégée)
/app/payroll            → Paie & Avantages (protégée)
/app/performance        → Performance (protégée)
/app/recruitment        → Recrutement (protégée)
/app/settings           → Paramètres (protégée)
```

#### Sidebar mise à jour:
- Utilise `<Link>` de React Router
- Détection automatique de la route active avec `useLocation()`
- Highlight visuel de la page courante

## 🎯 Architecture finale

```
src/
├── components/
│   └── ui/
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Table.jsx
│       ├── Modal.jsx
│       └── Badge.jsx
├── data/
│   └── mockData.js
├── layouts/
│   ├── DashboardLayout.jsx
│   ├── MainLayout.jsx
│   └── Header.jsx
├── pages/
│   ├── Auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   ├── components/
│   │   │   ├── Sidebar.jsx (✅ Mise à jour avec React Router)
│   │   │   ├── Header.jsx
│   │   │   ├── StatsCards.jsx
│   │   │   ├── ActivityFeed.jsx
│   │   │   ├── QuickActions.jsx
│   │   │   └── DepartmentTable.jsx
│   │   └── modules/
│   │       ├── EmployeesPage.jsx
│   │       ├── AttendancePage.jsx
│   │       ├── PayrollPage.jsx
│   │       ├── PerformancePage.jsx
│   │       ├── RecruitmentPage.jsx
│   │       └── SettingsPage.jsx
│   └── Landing/
│       └── LandingPage.jsx
├── routes/
│   └── AppRouter.jsx (✅ Toutes les routes configurées)
└── store/
    └── useHRStore.js
```

## 🚀 Comment tester

### 1. Démarrer le serveur
```bash
npm run dev
```

### 2. Accéder à l'application

**Option A: Avec authentification simulée**
1. Ouvrir la console du navigateur (F12)
2. Exécuter:
   ```javascript
   localStorage.setItem('authToken', 'test-token-123');
   ```
3. Naviguer vers `http://localhost:5173/app/dashboard`

**Option B: Via la page de connexion**
1. Aller sur `/login`
2. Implémenter la logique d'authentification
3. Redirection automatique vers `/app/dashboard`

### 3. Navigation
- Cliquer sur les éléments de la Sidebar pour naviguer entre les modules
- Chaque page est fonctionnelle avec données mockées
- Tester les actions (ajouter employé, approuver congé, etc.)

## 📋 Fonctionnalités par page

### ✅ Fonctionnalités implémentées

| Page | Fonctionnalités |
|------|----------------|
| **Dashboard** | Vue d'ensemble, stats, activités récentes, actions rapides, tableau départements |
| **Employés** | Liste, ajout via modal, affichage détaillé, badges de statut |
| **Présence** | Stats de présence, validation congés (approuver/rejeter), badges colorés |
| **Paie** | Registre mensuel, calculs (base + bonus - déductions), stats globales |
| **Performance** | Évaluations étoiles, objectifs avec progression, feedback |
| **Recrutement** | Onglets candidats/offres, gestion statuts, stats recrutement |
| **Paramètres** | Dark mode, notifications, profil, sécurité, infos entreprise |

## 🎨 Personnalisation

### Modifier les couleurs
Les composants utilisent Tailwind CSS. Exemples:
```jsx
// Changer la couleur primaire
className="bg-blue-600" → className="bg-purple-600"

// Modifier les badges
<Badge variant="success"> → variant="info" | "warning" | "danger"
```

### Ajouter un nouveau module
1. Créer `src/pages/Dashboard/modules/NouveauModule.jsx`
2. Utiliser `DashboardLayout` comme wrapper
3. Ajouter la route dans `AppRouter.jsx`
4. Ajouter l'entrée dans la Sidebar (`Sidebar.jsx`)

### Connecter à une API réelle
Remplacer les données mockées dans le store:
```javascript
// Au lieu de:
employees: initialEmployees,

// Utiliser:
employees: [],
// Et charger via useEffect + fetch/axios
```

## 🔧 Technologies utilisées

- **React 19** - Framework UI
- **React Router DOM 7** - Navigation
- **Zustand** - Gestion d'état globale
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icônes
- **Vite** - Build tool

## 🎯 Prochaines étapes recommandées

### Phase 1: Backend
- [ ] Créer une API REST (Node.js/Express ou autre)
- [ ] Endpoints CRUD pour chaque module
- [ ] Authentification JWT
- [ ] Base de données (PostgreSQL/MongoDB)

### Phase 2: Intégration
- [ ] Remplacer mockData par appels API
- [ ] Gestion des erreurs et loading states
- [ ] Pagination pour les grandes listes
- [ ] Recherche et filtres avancés

### Phase 3: Fonctionnalités avancées
- [ ] Upload de fichiers (CV, documents)
- [ ] Génération de PDF (contrats, fiches de paie)
- [ ] Notifications en temps réel (WebSocket)
- [ ] Graphiques et analytics (Chart.js/Recharts)
- [ ] Export Excel/CSV
- [ ] Multi-langue (i18n)

### Phase 4: UX/UI
- [ ] Animations (Framer Motion)
- [ ] Dark mode complet
- [ ] Mode responsive mobile
- [ ] Accessibilité (ARIA)
- [ ] Tests (Jest, React Testing Library)

## 💡 Conseils d'utilisation

### Store Zustand
```javascript
// Dans un composant
import { useHRStore } from '../store/useHRStore';

function MonComposant() {
  const { employees, addEmployee } = useHRStore();
  
  const handleAdd = () => {
    addEmployee({ name: "Nouveau", email: "test@test.com" });
  };
}
```

### Composants UI
```javascript
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Plus } from 'lucide-react';

<Card title="Mon titre" actions={
  <Button icon={Plus} onClick={handleClick}>Ajouter</Button>
}>
  Contenu de la carte
</Card>
```

## 🐛 Dépannage

### Erreur: Cannot find module
- Vérifier les imports (chemins relatifs corrects)
- Relancer `npm install`

### Navigation ne fonctionne pas
- Vérifier que `BrowserRouter` entoure bien l'app
- Vérifier les chemins dans `AppRouter.jsx`

### Store ne se met pas à jour
- Utiliser les fonctions du store (pas de mutation directe)
- Vérifier que le composant utilise bien `useHRStore()`

## 📞 Support

Pour toute question ou amélioration, consulter:
- Documentation React Router: https://reactrouter.com
- Documentation Zustand: https://github.com/pmndrs/zustand
- Documentation Tailwind: https://tailwindcss.com

---

**✨ Votre plateforme RH NovaCore est maintenant 100% prête pour le développement fonctionnel !**
