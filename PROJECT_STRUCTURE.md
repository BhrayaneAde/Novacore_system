# 🏗️ NovaCore - Structure du projet

## 📁 Arborescence complète

```
NovaCore/
│
├── 📄 package.json                    # Dépendances (React, Zustand, Tailwind, etc.)
├── 📄 vite.config.js                  # Configuration Vite
├── 📄 tailwind.config.js              # Configuration Tailwind CSS
├── 📄 eslint.config.js                # Configuration ESLint
│
├── 📚 Documentation/
│   ├── QUICK_START.md                 # ⚡ Guide de démarrage rapide
│   ├── MODULES_RH_README.md           # 📖 Documentation complète des modules
│   ├── DASHBOARD_README.md            # 📊 Documentation du dashboard
│   └── PROJECT_STRUCTURE.md           # 🏗️ Ce fichier
│
├── 📂 public/
│   └── vite.svg
│
└── 📂 src/
    │
    ├── 📄 main.jsx                    # Point d'entrée de l'application
    ├── 📄 App.jsx                     # Composant racine
    ├── 📄 index.css                   # Styles globaux + Tailwind
    │
    ├── 📂 components/                 # Composants réutilisables
    │   └── 📂 ui/                     # ✨ Composants UI (5 fichiers)
    │       ├── Button.jsx             # Boutons personnalisables
    │       ├── Card.jsx               # Cartes avec titre/actions
    │       ├── Table.jsx              # Tableaux dynamiques
    │       ├── Modal.jsx              # Fenêtres modales
    │       └── Badge.jsx              # Badges de statut
    │
    ├── 📂 data/                       # 📊 Données mockées
    │   └── mockData.js                # Employés, congés, paie, etc.
    │
    ├── 📂 store/                      # 🧠 Gestion d'état
    │   └── useHRStore.js              # Store Zustand global
    │
    ├── 📂 layouts/                    # 🎨 Layouts
    │   ├── DashboardLayout.jsx        # Layout pour les modules RH
    │   ├── MainLayout.jsx             # Layout principal (avec Outlet)
    │   └── Header.jsx                 # En-tête global
    │
    ├── 📂 routes/                     # 🧭 Configuration des routes
    │   └── AppRouter.jsx              # Toutes les routes + protection
    │
    └── 📂 pages/                      # 📄 Pages de l'application
        │
        ├── 📂 Landing/                # Page d'accueil
        │   └── LandingPage.jsx
        │
        ├── 📂 Auth/                   # Authentification
        │   ├── LoginPage.jsx          # Page de connexion
        │   └── RegisterPage.jsx       # Page d'inscription
        │
        └── 📂 Dashboard/              # 🏢 Modules RH
            │
            ├── Dashboard.jsx          # Dashboard principal
            │
            ├── 📂 components/         # Composants du dashboard
            │   ├── Sidebar.jsx        # ✅ Navigation avec React Router
            │   ├── Header.jsx         # En-tête avec recherche
            │   ├── StatsCards.jsx     # Cartes de statistiques
            │   ├── ActivityFeed.jsx   # Flux d'activités
            │   ├── QuickActions.jsx   # Actions rapides
            │   └── DepartmentTable.jsx # Tableau des départements
            │
            └── 📂 modules/            # 🎯 Pages des modules RH (6 fichiers)
                ├── EmployeesPage.jsx      # 👥 Gestion des employés
                ├── AttendancePage.jsx     # 📅 Présence & Congés
                ├── PayrollPage.jsx        # 💰 Paie & Avantages
                ├── PerformancePage.jsx    # 🎯 Performance
                ├── RecruitmentPage.jsx    # 👔 Recrutement
                └── SettingsPage.jsx       # ⚙️ Paramètres
```

## 📊 Statistiques du projet

### Fichiers créés
- **6 pages modules RH** (Employés, Présence, Paie, Performance, Recrutement, Paramètres)
- **5 composants UI réutilisables** (Button, Card, Table, Modal, Badge)
- **1 store Zustand** avec gestion complète de l'état
- **1 fichier de données mockées** avec 6 catégories
- **1 layout global** réutilisable
- **7 composants Dashboard** (Sidebar, Header, Stats, etc.)
- **1 fichier de routes** avec 10+ routes configurées

### Total: ~40 fichiers créés/modifiés

## 🎯 Routes de l'application

### Routes publiques
```
/                    → LandingPage
/login               → LoginPage
/register            → RegisterPage
```

### Routes protégées (nécessitent authentification)
```
/app                 → Redirection vers /app/dashboard
/app/dashboard       → Dashboard principal
/app/employees       → Gestion des employés
/app/attendance      → Présence & Congés
/app/payroll         → Paie & Avantages
/app/performance     → Performance
/app/recruitment     → Recrutement
/app/settings        → Paramètres
```

## 🔧 Technologies & Dépendances

### Core
- **React 19.1.1** - Framework UI
- **Vite 7.1.7** - Build tool ultra-rapide

### Routing & State
- **React Router DOM 7.9.4** - Navigation
- **Zustand 5.x** - Gestion d'état légère

### Styling
- **Tailwind CSS 4.1.14** - Framework CSS utility-first
- **Lucide React 0.546.0** - Bibliothèque d'icônes modernes

### Dev Tools
- **ESLint** - Linting
- **PostCSS** - Transformation CSS

## 📦 Composants UI - Référence rapide

| Composant | Props | Variantes |
|-----------|-------|-----------|
| **Button** | variant, size, icon, onClick | primary, secondary, success, danger, outline |
| **Card** | title, subtitle, actions | - |
| **Table** | columns, data, onRowClick | - |
| **Modal** | isOpen, onClose, title, size | sm, md, lg, xl |
| **Badge** | variant, size | default, success, warning, danger, info, purple |

## 🧠 Store Zustand - Actions disponibles

### Employés
- `addEmployee(employee)` - Ajouter un employé
- `updateEmployee(id, updates)` - Mettre à jour
- `deleteEmployee(id)` - Supprimer

### Congés
- `addLeaveRequest(request)` - Nouvelle demande
- `updateLeaveRequest(id, updates)` - Modifier statut

### Paie
- `addPayrollRecord(record)` - Ajouter un enregistrement
- `updatePayrollRecord(id, updates)` - Mettre à jour

### Performance
- `addPerformanceReview(review)` - Nouvelle évaluation
- `updatePerformanceReview(id, updates)` - Modifier

### Recrutement
- `addJobOpening(job)` - Nouvelle offre
- `updateJobOpening(id, updates)` - Modifier offre
- `addCandidate(candidate)` - Ajouter candidat
- `updateCandidate(id, updates)` - Modifier candidat

### Autres
- `toggleDarkMode()` - Basculer mode sombre
- `setSearchQuery(query)` - Définir recherche

## 🎨 Design System

### Couleurs principales
- **Primary**: Blue 600 (`bg-blue-600`)
- **Success**: Green 600 (`bg-green-600`)
- **Warning**: Amber 600 (`bg-amber-600`)
- **Danger**: Red 600 (`bg-red-600`)
- **Info**: Purple 600 (`bg-purple-600`)

### Espacements
- **Padding pages**: `p-8`
- **Gap grilles**: `gap-6`
- **Espacement sections**: `space-y-6`

### Bordures
- **Radius cards**: `rounded-xl`
- **Radius buttons**: `rounded-lg`
- **Border color**: `border-gray-200`

## 📱 Responsive Design

Toutes les pages utilisent les breakpoints Tailwind:
- **Mobile**: Par défaut
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)

Exemple:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

## 🚀 Commandes npm

```bash
# Développement
npm run dev          # Démarrer le serveur de dev

# Production
npm run build        # Build pour production
npm run preview      # Prévisualiser le build

# Qualité
npm run lint         # Linter le code
```

## 📝 Conventions de code

### Nommage
- **Composants**: PascalCase (`EmployeesPage.jsx`)
- **Fichiers utilitaires**: camelCase (`mockData.js`)
- **Constantes**: UPPER_SNAKE_CASE

### Structure des composants
```jsx
import React from "react";
import { useHRStore } from "../store/useHRStore";
import DashboardLayout from "../layouts/DashboardLayout";

const MonComposant = () => {
  // Hooks
  const { data } = useHRStore();
  
  // Handlers
  const handleClick = () => {};
  
  // Render
  return (
    <DashboardLayout>
      {/* Contenu */}
    </DashboardLayout>
  );
};

export default MonComposant;
```

## 🔐 Authentification

### Système actuel
- Token stocké dans `localStorage`
- Vérification dans `ProtectedRoute`
- Redirection automatique si non authentifié

### À implémenter
- [ ] API d'authentification
- [ ] Refresh token
- [ ] Gestion des rôles/permissions
- [ ] Session timeout

## 🎯 Roadmap suggérée

### Court terme (1-2 semaines)
- [ ] Connecter à une API backend
- [ ] Implémenter l'authentification réelle
- [ ] Ajouter la pagination
- [ ] Améliorer la recherche/filtres

### Moyen terme (1 mois)
- [ ] Upload de fichiers
- [ ] Génération de PDF
- [ ] Graphiques et analytics
- [ ] Notifications en temps réel

### Long terme (3+ mois)
- [ ] Application mobile (React Native)
- [ ] Multi-tenant
- [ ] Intégrations tierces (Slack, etc.)
- [ ] IA pour recommandations RH

---

**✨ Structure complète et prête pour le développement !**
