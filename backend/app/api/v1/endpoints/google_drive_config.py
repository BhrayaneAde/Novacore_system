from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json

from ....db.database import get_db
from ....db.models import Company
from ....core.auth import get_current_user
from ....schemas.user import User

router = APIRouter()

class GoogleOAuthConfig(BaseModel):
    client_id: str
    client_secret: str = None
    folder_id: str = None

@router.post("/configure-oauth")
async def configure_google_oauth(
    config: GoogleOAuthConfig,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Configure Google Drive OAuth for the company"""
    
    # Get company
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    
    # Store OAuth configuration
    google_config = {
        "type": "oauth",
        "client_id": config.client_id,
        "client_secret": config.client_secret,
        "folder_id": config.folder_id,
        "is_active": False,  # Will be activated after OAuth flow
        "redirect_uri": "http://localhost:5173/google-drive/callback"
    }
    
    company.google_drive_config = google_config
    db.commit()
    
    return {
        "message": "Configuration OAuth enregistrée",
        "client_id": config.client_id,
        "auth_url": f"https://accounts.google.com/o/oauth2/auth?client_id={config.client_id}&redirect_uri=http://localhost:5173/google-drive/callback&scope=https://www.googleapis.com/auth/drive&response_type=code&access_type=offline"
    }

@router.get("/config")
async def get_google_drive_config(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current Google Drive configuration"""
    
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    if not company or not company.google_drive_config:
        return {"is_configured": False}
    
    config = company.google_drive_config
    config_type = config.get("type", "service_account")
    
    if config_type == "oauth":
        return {
            "is_configured": True,
            "type": "oauth",
            "is_active": config.get("is_active", False),
            "client_id": config.get("client_id"),
            "folder_id": config.get("folder_id"),
            "auth_url": f"https://accounts.google.com/o/oauth2/auth?client_id={config.get('client_id')}&redirect_uri={config.get('redirect_uri')}&scope=https://www.googleapis.com/auth/drive&response_type=code&access_type=offline" if not config.get("is_active") else None
        }
    else:
        return {
            "is_configured": True,
            "type": "service_account",
            "is_active": config.get("is_active", False),
            "service_account_email": config.get("service_account_email"),
            "folder_id": config.get("folder_id")
        }

@router.post("/oauth-callback")
async def handle_oauth_callback(
    code: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Handle OAuth callback and store tokens"""
    
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    if not company or not company.google_drive_config:
        raise HTTPException(status_code=404, detail="Configuration non trouvée")
    
    config = company.google_drive_config
    
    # In production, exchange code for tokens here
    # For now, simulate successful OAuth
    config["access_token"] = f"mock_token_{code[:10]}"
    config["refresh_token"] = f"mock_refresh_{code[:10]}"
    config["is_active"] = True
    
    company.google_drive_config = config
    db.commit()
    
    return {
        "message": "Google Drive connecté avec succès",
        "is_active": True
    }

@router.put("/toggle")
async def toggle_google_drive(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Enable/disable Google Drive integration"""
    
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    if not company or not company.google_drive_config:
        raise HTTPException(status_code=404, detail="Configuration Google Drive non trouvée")
    
    config = company.google_drive_config
    config["is_active"] = not config.get("is_active", False)
    company.google_drive_config = config
    db.commit()
    
    return {
        "message": f"Google Drive {'activé' if config['is_active'] else 'désactivé'}",
        "is_active": config["is_active"]
    }

@router.delete("/config")
async def delete_google_drive_config(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete Google Drive configuration"""
    
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    
    company.google_drive_config = None
    db.commit()
    
    return {"message": "Configuration Google Drive supprimée"}