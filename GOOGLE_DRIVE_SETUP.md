# Configuration Google Drive API

## Étapes pour obtenir les identifiants Google Drive

### 1. Google Cloud Console
1. Allez sur https://console.cloud.google.com/
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google Drive :
   - Menu "APIs & Services" > "Library"
   - Recherchez "Google Drive API"
   - Cliquez "ENABLE"

### 2. Créer un Service Account
1. "APIs & Services" > "Credentials"
2. "Create Credentials" > "Service Account"
3. Nom : `novacore-drive-service`
4. Rôle : "Editor" ou "Owner"
5. Téléchargez le fichier JSON

### 3. Configuration
1. Renommez le fichier téléchargé en `google_credentials.json`
2. Placez-le dans le dossier `backend/`
3. Ajoutez à `.env` :
```
GOOGLE_CREDENTIALS_PATH=./google_credentials.json
```

### 4. Partager votre Drive
1. Ouvrez votre Google Drive
2. Partagez le dossier racine avec l'email du service account
3. Email format : `nom-service@projet-id.iam.gserviceaccount.com`

### 5. Test
Redémarrez le backend et testez l'endpoint `/api/v1/google-drive/files`