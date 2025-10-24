# NovaCore Backend API

Backend FastAPI pour le système de gestion RH NovaCore.

## Installation

1. Créer un environnement virtuel Python :
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# ou
source venv/bin/activate  # Linux/Mac
```

2. Installer les dépendances :
```bash
pip install -r requirements.txt
```

3. Vérifier les prérequis (optionnel) :
```bash
python check_requirements.py
```

4. Démarrer le serveur :
```bash
python run.py
```

**✨ Automatique au démarrage :**
- ✅ **Création automatique** de la base de données `novacore_db`
- ✅ **Création automatique** des tables
- ✅ **Seeding automatique** des données de test (une seule fois)
- ✅ **Vérifications** et logs détaillés

## Seeding Automatique

Le backend inclut un système de seeding automatique qui :
- ✅ S'exécute automatiquement au premier démarrage
- ✅ Ne se relance pas si déjà exécuté (fichier marqueur `.seed_completed`)
- ✅ Peuple la base avec des données de test complètes

### Réinitialiser le Seeder

Pour forcer une nouvelle exécution du seeder :
```bash
python reset_seed.py
python run.py
```

### Données de Test Incluses

- **Entreprise :** TechCorp
- **Utilisateurs :** 9 comptes (Employeur, RH Admin, Managers, Employés)
- **Départements :** RH, Design, Marketing, Ventes, Support
- **Employés :** 9 profils complets avec documents
- **Tâches :** 5 tâches assignées
- **Congés :** 3 demandes de congés
- **Évaluations :** 3 évaluations de performance
- **Contrats :** Templates et contrats générés

**Mot de passe par défaut :** `NovaCore123`

## Dépannage

### Erreur de connexion MySQL
```bash
# Vérifier que MySQL est démarré
# Windows
net start mysql

# Ou utiliser XAMPP/WAMP
```

### Problème avec mysqlclient
```bash
# Alternative avec pymysql
pip uninstall mysqlclient
pip install pymysql

# Puis modifier .env :
# DATABASE_URL=mysql+pymysql://root:password@localhost:3306/novacore_db
```

### Réinitialiser complètement
```bash
python reset_seed.py  # Supprime le marqueur de seeding
# Supprimer manuellement la base novacore_db si nécessaire
python run.py         # Redémarre tout depuis zéro
```

## Configuration

Copiez `.env.example` vers `.env` et modifiez les valeurs :

- `DATABASE_URL` : URL de connexion à votre base de données MySQL
- `SECRET_KEY` : Clé secrète pour les JWT (générez-en une forte !)
- `ACCESS_TOKEN_EXPIRE_MINUTES` : Durée de validité des tokens

**Important :** Le fichier `.env` est déjà configuré avec des valeurs par défaut pour le développement.

## API Documentation

Une fois le serveur démarré, accédez à :
- Documentation interactive : http://localhost:8000/docs
- Documentation alternative : http://localhost:8000/redoc

## Endpoints principaux

- `POST /api/v1/login/token` : Authentification
- `GET /api/v1/users/me` : Profil utilisateur actuel
- `GET /api/v1/employees/` : Liste des employés
- `GET /api/v1/tasks/` : Liste des tâches

## Structure du projet

```
backend/
├── app/
│   ├── main.py                 # Point d'entrée FastAPI
│   ├── core/                   # Configuration et sécurité
│   ├── db/                     # Modèles et base de données
│   ├── schemas/                # Schémas Pydantic
│   ├── crud/                   # Logique d'accès aux données
│   └── api/                    # Endpoints API
├── .env                        # Variables d'environnement
└── requirements.txt            # Dépendances Python
```

## Développement

Pour ajouter de nouveaux modules :

1. Créer les modèles dans `app/db/models.py`
2. Créer les schémas dans `app/schemas/`
3. Créer la logique CRUD dans `app/crud/`
4. Créer les endpoints dans `app/api/v1/endpoints/`
5. Ajouter le routeur dans `app/api/v1/api.py`