#!/usr/bin/env python3
"""Serveur simple pour tester la configuration Google Drive"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

app = FastAPI(title="NovaCore API - Test")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Stockage temporaire en mémoire
configs = {}

class GoogleOAuthConfig(BaseModel):
    client_id: str
    client_secret: str = None
    folder_id: str = None

@app.get("/")
def read_root():
    return {"message": "NovaCore API Test", "status": "running"}

@app.post("/api/v1/google-drive-config/configure-oauth")
def configure_oauth(config: GoogleOAuthConfig):
    """Configure Google Drive OAuth"""
    
    auth_url = f"https://accounts.google.com/o/oauth2/auth?client_id={config.client_id}&redirect_uri=http://localhost:5173/google-drive/callback&scope=https://www.googleapis.com/auth/drive&response_type=code&access_type=offline"
    
    # Stocker la config
    configs["google_oauth"] = {
        "client_id": config.client_id,
        "client_secret": config.client_secret,
        "folder_id": config.folder_id,
        "is_active": False,
        "auth_url": auth_url
    }
    
    return {
        "message": "Configuration OAuth enregistrée",
        "client_id": config.client_id,
        "auth_url": auth_url
    }

@app.get("/api/v1/google-drive-config/config")
def get_config():
    """Get current config"""
    if "google_oauth" not in configs:
        return {"is_configured": False}
    
    config = configs["google_oauth"]
    return {
        "is_configured": True,
        "type": "oauth",
        "is_active": config.get("is_active", False),
        "client_id": config.get("client_id"),
        "folder_id": config.get("folder_id"),
        "auth_url": config.get("auth_url") if not config.get("is_active") else None
    }

@app.post("/api/v1/google-drive-config/oauth-callback")
def oauth_callback(code: str):
    """Handle OAuth callback"""
    if "google_oauth" not in configs:
        raise HTTPException(status_code=404, detail="Configuration non trouvée")
    
    # Simuler la connexion réussie
    configs["google_oauth"]["is_active"] = True
    configs["google_oauth"]["access_token"] = f"mock_token_{code[:10]}"
    
    return {
        "message": "Google Drive connecté avec succès",
        "is_active": True
    }

# Endpoints pour éviter les erreurs 404
@app.get("/api/v1/companies/me")
def get_company():
    return {"id": 1, "name": "Test Company"}

@app.get("/api/v1/users/me")
def get_user():
    return {"id": 1, "email": "test@test.com", "role": "employer"}

if __name__ == "__main__":
    import uvicorn
    print("Demarrage du serveur de test...")
    print("URL: http://127.0.0.1:8000")
    print("Docs: http://127.0.0.1:8000/docs")
    uvicorn.run(app, host="127.0.0.1", port=8000)