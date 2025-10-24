# Dashboard RH NovaCore

## 📁 Structure des fichiers créés

```
src/pages/Dashboard/
├── Dashboard.jsx                    # Composant principal du dashboard
└── components/
    ├── Sidebar.jsx                  # Barre latérale de navigation
    ├── Header.jsx                   # En-tête avec recherche et notifications
    ├── StatsCards.jsx              # Cartes de statistiques (4 cartes)
    ├── ActivityFeed.jsx            # Flux d'activités récentes
    ├── QuickActions.jsx            # Actions rapides et raccourcis
    └── DepartmentTable.jsx         # Tableau des départements
```

## 🚀 Accès au Dashboard

Le dashboard est accessible via l'URL : **`/app/dashboard`**

### Authentification requise
- Le dashboard est protégé par le composant `ProtectedRoute`
- Un token d'authentification doit être présent dans `localStorage.getItem('authToken')`
- Sans authentification, l'utilisateur est redirigé vers `/login`

## 🎨 Fonctionnalités

### 1. **Sidebar** (Barre latérale)
- Logo NovaCore
- Navigation avec 7 sections :
  - Tableau de bord (actif)
  - Employés
  - Présence & Congés
  - Paie & Avantages
  - Performance
  - Recrutement
  - Paramètres
- Profil utilisateur en bas

### 2. **Header** (En-tête)
- Barre de recherche globale
- Icône de notifications avec badge
- Icône d'aide

### 3. **StatsCards** (Cartes statistiques)
- **Employés actifs** : 247 (+12%)
- **Taux de présence** : 96.8% (Aujourd'hui)
- **Candidatures en cours** : 34 (12 actifs)
- **Demandes de congés** : 23 (8 en attente)

### 4. **ActivityFeed** (Flux d'activités)
- Affiche les 5 dernières activités
- Types d'activités : nouveaux employés, contrats, congés, évaluations, candidatures
- Horodatage pour chaque activité

### 5. **QuickActions** (Actions rapides)
- 4 boutons d'action :
  - Ajouter un employé
  - Générer un contrat
  - Planifier un entretien
  - Traiter la paie
- Section raccourcis avec liens vers documents

### 6. **DepartmentTable** (Tableau des départements)
- Liste de 5 départements
- Colonnes : Département, Employés, Budget annuel, Performance, Actions
- Indicateurs de tendance (hausse/baisse)

## 🛠️ Technologies utilisées

- **React** : Framework principal
- **React Router DOM** : Gestion des routes
- **Tailwind CSS** : Styles et design
- **Lucide React** : Icônes modernes
- **Vite** : Build tool

## 📝 Notes importantes

1. **Layout indépendant** : Le Dashboard a sa propre mise en page complète (Sidebar + Header), il n'utilise pas le `MainLayout` existant.

2. **Route configurée** : La route `/app/dashboard` est déjà configurée dans `AppRouter.jsx` avec protection d'authentification.

3. **Données mockées** : Toutes les données affichées sont actuellement des données de démonstration. Vous devrez les connecter à votre API backend.

## 🔄 Prochaines étapes

1. **Connecter à l'API** : Remplacer les données mockées par des appels API réels
2. **Rendre la navigation fonctionnelle** : Ajouter les routes pour les autres sections (Employés, Présence, etc.)
3. **Implémenter les actions** : Connecter les boutons d'actions rapides aux formulaires appropriés
4. **Ajouter la gestion d'état** : Utiliser Context API ou Redux pour gérer l'état global
5. **Tests** : Ajouter des tests unitaires et d'intégration

## 🎯 Pour tester

1. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```

2. Pour accéder au dashboard, vous devez :
   - Soit vous connecter via `/login` (si l'authentification est implémentée)
   - Soit ajouter manuellement un token dans localStorage :
     ```javascript
     localStorage.setItem('authToken', 'your-test-token');
     ```

3. Naviguez vers `/app/dashboard`

## 🎨 Personnalisation

Tous les composants utilisent Tailwind CSS et sont facilement personnalisables :
- Modifiez les couleurs dans les classes Tailwind
- Ajustez les données dans les constantes de chaque composant
- Adaptez la mise en page selon vos besoins
