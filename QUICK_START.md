# 🚀 NovaCore - Guide de démarrage rapide

## ⚡ Démarrage en 3 étapes

### 1️⃣ Installer les dépendances (si pas déjà fait)
```bash
npm install
```

### 2️⃣ Démarrer le serveur de développement
```bash
npm run dev
```

### 3️⃣ Accéder à l'application

**Dans votre navigateur:**
1. Ouvrir la console (F12)
2. Exécuter cette commande pour simuler l'authentification:
   ```javascript
   localStorage.setItem('authToken', 'demo-token');
   ```
3. Naviguer vers: `http://localhost:5173/app/dashboard`

## 🎯 Routes disponibles

| URL | Page | Description |
|-----|------|-------------|
| `/` | Landing | Page d'accueil publique |
| `/login` | Connexion | Page de connexion |
| `/register` | Inscription | Page d'inscription |
| `/app/dashboard` | Dashboard | Vue d'ensemble RH |
| `/app/employees` | Employés | Gestion des employés |
| `/app/attendance` | Présence | Congés et présences |
| `/app/payroll` | Paie | Gestion de la paie |
| `/app/performance` | Performance | Évaluations |
| `/app/recruitment` | Recrutement | Offres et candidats |
| `/app/settings` | Paramètres | Configuration |

## 📦 Ce qui est inclus

✅ **7 pages modules RH** complètes et fonctionnelles  
✅ **Store Zustand** pour la gestion d'état  
✅ **Données mockées** prêtes à l'emploi  
✅ **5 composants UI** réutilisables (Button, Card, Table, Modal, Badge)  
✅ **Navigation React Router** avec routes protégées  
✅ **Sidebar dynamique** avec détection de route active  
✅ **Design moderne** avec Tailwind CSS  

## 🎨 Composants UI - Exemples d'utilisation

### Button
```jsx
import Button from './components/ui/Button';
import { Plus } from 'lucide-react';

<Button variant="primary" icon={Plus} onClick={handleClick}>
  Ajouter
</Button>
```

### Card
```jsx
import Card from './components/ui/Card';

<Card title="Mon titre" subtitle="Sous-titre">
  Contenu de la carte
</Card>
```

### Table
```jsx
import Table from './components/ui/Table';

const columns = [
  { header: "Nom", accessor: "name" },
  { header: "Email", accessor: "email" }
];

<Table columns={columns} data={employees} />
```

### Modal
```jsx
import Modal from './components/ui/Modal';

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Mon modal">
  Contenu du modal
</Modal>
```

### Badge
```jsx
import Badge from './components/ui/Badge';

<Badge variant="success">Actif</Badge>
<Badge variant="warning">En attente</Badge>
<Badge variant="danger">Rejeté</Badge>
```

## 🔧 Store Zustand - Utilisation

```jsx
import { useHRStore } from './store/useHRStore';

function MonComposant() {
  // Récupérer les données et actions
  const { employees, addEmployee, updateEmployee } = useHRStore();
  
  // Ajouter un employé
  const handleAdd = () => {
    addEmployee({
      name: "Jean Dupont",
      email: "jean@novacore.com",
      role: "Développeur",
      department: "Tech"
    });
  };
  
  // Mettre à jour un employé
  const handleUpdate = (id) => {
    updateEmployee(id, { status: "on_leave" });
  };
  
  return (
    <div>
      <p>Total: {employees.length} employés</p>
      <button onClick={handleAdd}>Ajouter</button>
    </div>
  );
}
```

## 📊 Données mockées disponibles

Le fichier `src/data/mockData.js` contient:
- **6 employés** avec profils complets
- **6 enregistrements de présence**
- **3 demandes de congés**
- **3 registres de paie**
- **2 évaluations de performance**
- **3 offres d'emploi**
- **3 candidats**
- **5 départements**

## 🎯 Tester les fonctionnalités

### Page Employés
1. Aller sur `/app/employees`
2. Cliquer sur "Ajouter un employé"
3. Remplir le formulaire
4. Voir l'employé ajouté dans la liste

### Page Présence
1. Aller sur `/app/attendance`
2. Voir les demandes de congés
3. Cliquer sur "Approuver" ou "Rejeter"
4. Le statut se met à jour instantanément

### Page Recrutement
1. Aller sur `/app/recruitment`
2. Basculer entre les onglets "Candidats" et "Offres d'emploi"
3. Voir les statistiques en temps réel

### Page Paramètres
1. Aller sur `/app/settings`
2. Activer/désactiver le mode sombre
3. Gérer les notifications
4. Modifier le profil

## 🌙 Activer le Dark Mode

Le toggle est disponible dans la page Paramètres (`/app/settings`).  
Le state est géré par Zustand dans `useHRStore`.

Pour l'appliquer globalement, ajouter dans `tailwind.config.js`:
```js
module.exports = {
  darkMode: 'class',
  // ...
}
```

## 📱 Structure des fichiers

```
src/
├── components/ui/          # Composants réutilisables
├── data/mockData.js        # Données de test
├── layouts/                # Layouts (Dashboard, Main)
├── pages/
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   ├── components/     # Composants du dashboard
│   │   └── modules/        # Pages des modules RH
│   ├── Auth/               # Login, Register
│   └── Landing/            # Page d'accueil
├── routes/AppRouter.jsx    # Configuration des routes
└── store/useHRStore.js     # Store Zustand
```

## 🐛 Problèmes courants

### La navigation ne fonctionne pas
➡️ Vérifier que vous avez bien un token dans localStorage:
```javascript
localStorage.setItem('authToken', 'demo-token');
```

### Les données ne s'affichent pas
➡️ Vérifier la console pour les erreurs  
➡️ Vérifier que le store est bien importé

### Erreur de module
➡️ Relancer `npm install`  
➡️ Redémarrer le serveur `npm run dev`

## 📚 Documentation complète

Pour plus de détails, consulter:
- **MODULES_RH_README.md** - Documentation complète des modules
- **DASHBOARD_README.md** - Documentation du dashboard principal

## 🎉 C'est tout !

Votre application NovaCore est prête à être utilisée et développée.  
Toutes les pages sont fonctionnelles avec des données mockées.  
Vous pouvez maintenant:
- Tester toutes les fonctionnalités
- Personnaliser le design
- Connecter à une API backend
- Ajouter de nouvelles fonctionnalités

**Bon développement ! 🚀**
