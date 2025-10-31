from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import base64
from datetime import datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
import io

from app.db.database import get_db
from app.core.auth import get_current_user
from app.db.models import User, Company

router = APIRouter()

@router.get("/auth-url")
async def get_google_auth_url(current_user: User = Depends(get_current_user)):
    """Générer l'URL d'authentification Google"""
    # URL simulée - en production, utiliser Google OAuth2
    auth_url = "https://accounts.google.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=https://www.googleapis.com/auth/drive&response_type=code"
    return {"auth_url": auth_url, "status": "ready"}

@router.post("/connect")
async def connect_google_drive(
    auth_code: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Connecter Google Drive avec le code d'autorisation"""
    # Simulation de la connexion
    return {
        "status": "connected",
        "user_email": "user@company.com",
        "drive_space": "15 GB disponible"
    }

@router.get("/files")
async def list_drive_files(
    folder: Optional[str] = "NovaCore-RH",
    current_user: User = Depends(get_current_user)
):
    """Lister les fichiers du dossier RH"""
    # Simulation des fichiers
    files = [
        {
            "id": "1abc123",
            "name": "Contrats_2024.pdf",
            "type": "application/pdf",
            "size": "2.5 MB",
            "modified": "2024-01-15T10:30:00Z",
            "shared": True,
            "url": "https://drive.google.com/file/d/1abc123/view"
        },
        {
            "id": "2def456",
            "name": "Fiches_Paie_Janvier.xlsx",
            "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "size": "1.8 MB",
            "modified": "2024-01-10T14:20:00Z",
            "shared": False,
            "url": "https://drive.google.com/file/d/2def456/view"
        },
        {
            "id": "3ghi789",
            "name": "Photos_Equipe",
            "type": "folder",
            "size": "12 fichiers",
            "modified": "2024-01-08T09:15:00Z",
            "shared": True,
            "url": "https://drive.google.com/drive/folders/3ghi789"
        }
    ]
    
    return {
        "folder": folder,
        "files": files,
        "total": len(files)
    }

@router.post("/upload")
async def upload_to_drive(
    file: UploadFile = File(...),
    folder: Optional[str] = "NovaCore-RH",
    current_user: User = Depends(get_current_user)
):
    """Uploader un fichier vers Google Drive"""
    if file.size > 10 * 1024 * 1024:  # 10MB max
        raise HTTPException(status_code=413, detail="Fichier trop volumineux (max 10MB)")
    
    # Simulation de l'upload
    file_id = f"upload_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    return {
        "status": "uploaded",
        "file_id": file_id,
        "name": file.filename,
        "size": f"{file.size / 1024:.1f} KB",
        "url": f"https://drive.google.com/file/d/{file_id}/view",
        "folder": folder
    }

@router.post("/create-folder")
async def create_drive_folder(
    folder_name: str,
    parent_folder: Optional[str] = "NovaCore-RH",
    current_user: User = Depends(get_current_user)
):
    """Créer un dossier dans Google Drive"""
    folder_id = f"folder_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    return {
        "status": "created",
        "folder_id": folder_id,
        "name": folder_name,
        "parent": parent_folder,
        "url": f"https://drive.google.com/drive/folders/{folder_id}"
    }

@router.delete("/files/{file_id}")
async def delete_drive_file(
    file_id: str,
    current_user: User = Depends(get_current_user)
):
    """Supprimer un fichier de Google Drive"""
    return {
        "status": "deleted",
        "file_id": file_id,
        "message": "Fichier supprimé avec succès"
    }

@router.get("/storage-info")
async def get_storage_info(current_user: User = Depends(get_current_user)):
    """Informations sur l'espace de stockage"""
    return {
        "total_space": "15 GB",
        "used_space": "8.2 GB",
        "available_space": "6.8 GB",
        "usage_percentage": 55,
        "novacore_folder_size": "2.1 GB"
    }