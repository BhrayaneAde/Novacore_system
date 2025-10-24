# 🎯 NovaCore - Flux utilisateur

## 🚀 Scénario 1: Premier accès à l'application

```
┌─────────────────┐
│  Landing Page   │  http://localhost:5173/
│   (Publique)    │
└────────┬────────┘
         │
         │ Clic sur "Se connecter"
         ▼
┌─────────────────┐
│   Login Page    │  /login
│                 │
└────────┬────────┘
         │
         │ Authentification réussie
         │ → Token stocké dans localStorage
         ▼
┌─────────────────┐
│    Dashboard    │  /app/dashboard
│   (Protégée)    │
└─────────────────┘
```

## 👥 Scénario 2: Ajouter un nouvel employé

```
Dashboard (/app/dashboard)
    │
    │ Clic sur "Employés" dans la Sidebar
    ▼
┌──────────────────────────────┐
│     Page Employés            │  /app/employees
│  ┌────────────────────────┐  │
│  │  Liste des employés    │  │
│  │  (6 employés affichés) │  │
│  └────────────────────────┘  │
│                              │
│  [+ Ajouter un employé]      │ ← Clic
└──────────────┬───────────────┘
               │
               │ Modal s'ouvre
               ▼
┌──────────────────────────────┐
│      Modal d'ajout           │
│  ┌────────────────────────┐  │
│  │ Nom: [Jean Dupont]     │  │
│  │ Email: [jean@...]      │  │
│  │ Poste: [Développeur]   │  │
│  │ Département: [Tech]    │  │
│  │ Téléphone: [+33...]    │  │
│  │ Salaire: [50000]       │  │
│  └────────────────────────┘  │
│                              │
│  [Annuler]  [Ajouter] ←──────┤ Clic
└──────────────┬───────────────┘
               │
               │ Store Zustand mis à jour
               │ addEmployee() appelé
               ▼
┌──────────────────────────────┐
│     Page Employés            │
│  ┌────────────────────────┐  │
│  │  Liste des employés    │  │
│  │  (7 employés affichés) │  │ ← Nouvel employé visible
│  │  ✨ Jean Dupont        │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

## 📅 Scénario 3: Approuver une demande de congé

```
Dashboard (/app/dashboard)
    │
    │ Clic sur "Présence & Congés"
    ▼
┌──────────────────────────────────────┐
│     Page Présence                    │  /app/attendance
│  ┌────────────────────────────────┐  │
│  │  Statistiques                  │  │
│  │  Taux: 96.8% | En attente: 2  │  │
│  └────────────────────────────────┘  │
│                                      │
│  Tableau des demandes:               │
│  ┌────────────────────────────────┐  │
│  │ Sophie Martin | Vacances       │  │
│  │ 15-22 Nov | 6 jours            │  │
│  │ [Approuver] [Rejeter] ←────────┼──┤ Clic "Approuver"
│  └────────────────────────────────┘  │
└──────────────┬───────────────────────┘
               │
               │ updateLeaveRequest(id, { status: "approved" })
               │ Store mis à jour
               ▼
┌──────────────────────────────────────┐
│     Page Présence                    │
│  ┌────────────────────────────────┐  │
│  │  Statistiques                  │  │
│  │  Taux: 96.8% | En attente: 1  │  │ ← Compteur mis à jour
│  └────────────────────────────────┘  │
│                                      │
│  Tableau des demandes:               │
│  ┌────────────────────────────────┐  │
│  │ Sophie Martin | Vacances       │  │
│  │ 15-22 Nov | 6 jours            │  │
│  │ ✅ Approuvé                    │  │ ← Badge vert
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

## 👔 Scénario 4: Consulter les candidatures

```
Dashboard (/app/dashboard)
    │
    │ Clic sur "Recrutement"
    ▼
┌──────────────────────────────────────┐
│     Page Recrutement                 │  /app/recruitment
│  ┌────────────────────────────────┐  │
│  │  Statistiques                  │  │
│  │  Postes: 2 | Candidats: 3     │  │
│  └────────────────────────────────┘  │
│                                      │
│  [Candidats] [Offres d'emploi]       │
│      ▲                               │
│      └─ Onglet actif                 │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Alice Dupont                   │  │
│  │ Dev Full Stack | 5 ans         │  │
│  │ 🟡 Entretien                   │  │
│  │ [Voir profil] ←────────────────┼──┤ Clic
│  └────────────────────────────────┘  │
└──────────────┬───────────────────────┘
               │
               │ (À implémenter: page détail candidat)
               ▼
         [Page détail]
```

## ⚙️ Scénario 5: Modifier les paramètres

```
Dashboard (/app/dashboard)
    │
    │ Clic sur "Paramètres"
    ▼
┌──────────────────────────────────────┐
│     Page Paramètres                  │  /app/settings
│                                      │
│  ┌─────────────────────────────┐    │
│  │  Apparence                  │    │
│  │  Mode sombre: [OFF] ←───────┼────┤ Clic sur toggle
│  └─────────────────────────────┘    │
│                                      │
│  ┌─────────────────────────────┐    │
│  │  Notifications              │    │
│  │  Email: [ON]                │    │
│  │  Push: [OFF]                │    │
│  └─────────────────────────────┘    │
└──────────────┬───────────────────────┘
               │
               │ toggleDarkMode() appelé
               │ Store: darkMode = true
               ▼
┌──────────────────────────────────────┐
│     Page Paramètres                  │
│     (Thème sombre activé)            │
│                                      │
│  ┌─────────────────────────────┐    │
│  │  Apparence                  │    │
│  │  Mode sombre: [ON] ✅       │    │
│  └─────────────────────────────┘    │
└──────────────────────────────────────┘
```

## 🔄 Flux de navigation complet

```
                    ┌─────────────────┐
                    │  Landing Page   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │                             │
              ▼                             ▼
      ┌─────────────┐              ┌─────────────┐
      │   Login     │              │  Register   │
      └──────┬──────┘              └──────┬──────┘
             │                            │
             └──────────┬─────────────────┘
                        │
                        │ Authentification
                        ▼
              ┌──────────────────┐
              │    Dashboard     │ ← Page principale
              │   /app/dashboard │
              └────────┬─────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
    ┌─────────┐  ┌──────────┐  ┌──────────┐
    │Employés │  │Présence  │  │  Paie    │
    └─────────┘  └──────────┘  └──────────┘
         │             │             │
         ▼             ▼             ▼
    ┌─────────┐  ┌──────────┐  ┌──────────┐
    │Perform. │  │Recrutem. │  │Paramètres│
    └─────────┘  └──────────┘  └──────────┘
```

## 📊 Interactions avec le Store Zustand

### Flux de données unidirectionnel

```
┌──────────────────────────────────────────────────────┐
│                    Composant React                   │
│                                                      │
│  const { employees, addEmployee } = useHRStore();   │
│                                                      │
│  const handleAdd = () => {                          │
│    addEmployee({ name: "Jean", ... });              │
│  };                                                  │
└────────────────────┬─────────────────────────────────┘
                     │
                     │ Action déclenchée
                     ▼
┌──────────────────────────────────────────────────────┐
│                   Store Zustand                      │
│                                                      │
│  addEmployee: (employee) =>                         │
│    set((state) => ({                                │
│      employees: [...state.employees, employee]      │
│    }))                                              │
└────────────────────┬─────────────────────────────────┘
                     │
                     │ State mis à jour
                     ▼
┌──────────────────────────────────────────────────────┐
│                Tous les composants                   │
│              qui utilisent useHRStore()              │
│                  se re-rendent                       │
│                                                      │
│  ✨ UI mise à jour automatiquement                  │
└──────────────────────────────────────────────────────┘
```

## 🎨 Exemple de flux UI complet

### Ajouter un employé (détaillé)

```
1. État initial
   ┌────────────────────────────┐
   │ Page Employés              │
   │ employees.length = 6       │
   │ [+ Ajouter un employé]     │
   └────────────────────────────┘

2. Clic sur le bouton
   ┌────────────────────────────┐
   │ setIsModalOpen(true)       │
   │ Modal apparaît             │
   └────────────────────────────┘

3. Remplissage du formulaire
   ┌────────────────────────────┐
   │ setNewEmployee({           │
   │   name: "Jean Dupont",     │
   │   email: "jean@...",       │
   │   ...                      │
   │ })                         │
   └────────────────────────────┘

4. Clic sur "Ajouter"
   ┌────────────────────────────┐
   │ addEmployee(newEmployee)   │
   │ ↓                          │
   │ Store Zustand mis à jour   │
   │ ↓                          │
   │ employees.length = 7       │
   └────────────────────────────┘

5. Fermeture du modal
   ┌────────────────────────────┐
   │ setIsModalOpen(false)      │
   │ setNewEmployee({})         │
   │ ↓                          │
   │ Modal disparaît            │
   └────────────────────────────┘

6. UI mise à jour
   ┌────────────────────────────┐
   │ Page Employés              │
   │ employees.length = 7       │
   │ ✨ Nouvel employé visible  │
   └────────────────────────────┘
```

## 🔐 Flux d'authentification

```
┌─────────────────────────────────────────────────────┐
│                    Utilisateur                      │
└────────────────────┬────────────────────────────────┘
                     │
                     │ Visite /app/dashboard
                     ▼
┌─────────────────────────────────────────────────────┐
│                 ProtectedRoute                      │
│                                                     │
│  useEffect(() => {                                  │
│    const token = localStorage.getItem('authToken'); │
│    setIsAuthenticated(!!token);                    │
│  }, []);                                           │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   Token existe?              Token absent?
        │                         │
        │ OUI                     │ NON
        ▼                         ▼
┌──────────────┐         ┌──────────────┐
│  Dashboard   │         │ Redirection  │
│   affiché    │         │ vers /login  │
└──────────────┘         └──────────────┘
```

## 🎯 Points clés du flux

### ✅ Ce qui fonctionne actuellement
- Navigation entre toutes les pages
- Ajout/modification de données via le store
- Mise à jour automatique de l'UI
- Protection des routes
- Détection de la route active dans la Sidebar

### 🚧 À implémenter
- Authentification réelle avec API
- Validation des formulaires
- Messages de confirmation/erreur
- Loading states
- Pagination des listes
- Recherche et filtres avancés

---

**💡 Tous les flux sont fonctionnels avec les données mockées !**
