from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.email import email_service
from app.api.deps import get_current_user
from app.db import models
from pydantic import BaseModel, EmailStr
import secrets
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()

class InvitationRequest(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: str
    department_id: int = None
    job_title: str = None
    salary: float = None
    manager_id: int = None

class EmailRequest(BaseModel):
    to_email: EmailStr
    subject: str
    content: str

@router.post("/send-invitation")
async def send_invitation(
    invitation: InvitationRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Envoie une invitation par email"""
    try:
        # Vérifier que l'utilisateur a les permissions
        if current_user.role not in ["employer", "hr_admin"]:
            raise HTTPException(status_code=403, detail="Permission insuffisante")
        
        # Générer un token d'invitation
        invitation_token = secrets.token_urlsafe(32)
        
        # Créer l'invitation en base
        db_invitation = models.Invitation(
            email=invitation.email,
            first_name=invitation.first_name,
            last_name=invitation.last_name,
            role=invitation.role,
            company_id=current_user.company_id,
            department_id=invitation.department_id,
            job_title=invitation.job_title,
            salary=invitation.salary,
            manager_id=invitation.manager_id,
            token=invitation_token,
            invited_by_id=current_user.id,
            email_status="pending"
        )
        db.add(db_invitation)
        db.commit()
        
        # Envoyer l'email
        company = db.query(models.Company).filter(models.Company.id == current_user.company_id).first()
        success = email_service.send_invitation_email(
            to_email=invitation.email,
            first_name=invitation.first_name,
            last_name=invitation.last_name,
            company_name=company.name,
            role=invitation.role,
            invitation_token=invitation_token
        )
        
        # Mettre à jour le statut email
        if success:
            db_invitation.email_status = "sent"
            db_invitation.email_sent_at = datetime.utcnow()
        else:
            db_invitation.email_status = "failed"
        
        db.commit()
        
        if not success:
            raise HTTPException(status_code=500, detail="Erreur envoi email")
        
        return {"message": "Invitation envoyée avec succès", "invitation_id": db_invitation.id}
        
    except Exception as e:
        logger.error(f"Erreur envoi invitation: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'envoi de l'invitation")

@router.get("/invitations/pending")
async def get_pending_invitations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Récupère les invitations en attente"""
    invitations = db.query(models.Invitation).filter(
        models.Invitation.company_id == current_user.company_id,
        models.Invitation.accepted_at.is_(None)
    ).all()
    
    return invitations

@router.post("/invitations/{invitation_id}/resend")
async def resend_invitation(
    invitation_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Renvoie une invitation"""
    invitation = db.query(models.Invitation).filter(
        models.Invitation.id == invitation_id,
        models.Invitation.company_id == current_user.company_id
    ).first()
    
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation non trouvée")
    
    # Générer un nouveau token
    invitation.token = secrets.token_urlsafe(32)
    db.commit()
    
    # Renvoyer l'email
    company = db.query(models.Company).filter(models.Company.id == current_user.company_id).first()
    success = email_service.send_invitation_email(
        to_email=invitation.email,
        first_name=invitation.first_name,
        last_name=invitation.last_name,
        company_name=company.name,
        role=invitation.role,
        invitation_token=invitation.token
    )
    
    if not success:
        raise HTTPException(status_code=500, detail="Erreur envoi email")
    
    return {"message": "Invitation renvoyée avec succès"}

@router.delete("/invitations/{invitation_id}")
async def cancel_invitation(
    invitation_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Annule une invitation"""
    invitation = db.query(models.Invitation).filter(
        models.Invitation.id == invitation_id,
        models.Invitation.company_id == current_user.company_id
    ).first()
    
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation non trouvée")
    
    db.delete(invitation)
    db.commit()
    
    return {"message": "Invitation annulée"}

@router.get("/track/{invitation_token}")
async def track_email_opened(
    invitation_token: str,
    db: Session = Depends(get_db)
):
    """Track quand un email d'invitation est ouvert"""
    invitation = db.query(models.Invitation).filter(
        models.Invitation.token == invitation_token
    ).first()
    
    if invitation and not invitation.email_opened_at:
        invitation.email_status = "opened"
        invitation.email_opened_at = datetime.utcnow()
        db.commit()
    
    # Retourner une image 1x1 pixel transparente
    from fastapi.responses import Response
    pixel = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00\x21\xF9\x04\x01\x00\x00\x00\x00\x2C\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x04\x01\x00\x3B'
    return Response(content=pixel, media_type="image/gif")

@router.get("/invitations/stats")
async def get_invitation_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Statistiques des invitations envoyées"""
    invitations = db.query(models.Invitation).filter(
        models.Invitation.company_id == current_user.company_id
    ).all()
    
    stats = {
        "total": len(invitations),
        "pending": len([i for i in invitations if i.email_status == "pending"]),
        "sent": len([i for i in invitations if i.email_status == "sent"]),
        "opened": len([i for i in invitations if i.email_status == "opened"]),
        "accepted": len([i for i in invitations if i.email_status == "accepted"]),  # Compte créé = employé actif
        "failed": len([i for i in invitations if i.email_status == "failed"]),
        "employees_created": len([i for i in invitations if i.accepted_at is not None])  # Nombre d'employés créés
    }
    
    return stats