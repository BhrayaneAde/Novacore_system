from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.email import email_service
from app.api.deps import get_current_user
from app.db import models
from pydantic import BaseModel, EmailStr, Field
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

class TestEmailRequest(BaseModel):
    host: str
    port: int
    user: str
    pass_: str = Field(alias="pass")
    testEmail: EmailStr

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
        company_logo = None
        if company and company.settings_appearance:
            company_logo = company.settings_appearance.get('company_logo')
        
        success = email_service.send_invitation_email(
            to_email=invitation.email,
            first_name=invitation.first_name,
            last_name=invitation.last_name,
            company_name=company.name,
            role=invitation.role,
            invitation_token=invitation_token,
            company_logo=company_logo,
            smtp_config=company.settings_smtp
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
    company_logo = None
    if company and company.settings_appearance:
        company_logo = company.settings_appearance.get('company_logo')
    
    success = email_service.send_invitation_email(
        to_email=invitation.email,
        first_name=invitation.first_name,
        last_name=invitation.last_name,
        company_name=company.name,
        role=invitation.role,
        invitation_token=invitation.token,
        company_logo=company_logo,
        smtp_config=company.settings_smtp
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

@router.get("/smtp-config")
async def get_smtp_config(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Récupère la configuration SMTP de l'entreprise"""
    company = db.query(models.Company).filter(models.Company.id == current_user.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    
    smtp_config = company.settings_smtp or {}
    # Ne pas renvoyer le mot de passe pour la sécurité
    if 'password' in smtp_config:
        smtp_config['password'] = '***'
    
    return smtp_config

@router.post("/smtp-config")
async def save_smtp_config(
    config: dict,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Sauvegarde la configuration SMTP"""
    company = db.query(models.Company).filter(models.Company.id == current_user.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    
    company.settings_smtp = config
    db.commit()
    
    return {"success": True, "message": "Configuration SMTP sauvegardée"}

@router.post("/test-email")
async def test_email_configuration(request: TestEmailRequest):
    """Teste la configuration SMTP en envoyant un email de test"""
    try:
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        # Créer le message de test
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "Test de configuration SMTP - NovaCore"
        msg['From'] = f"NovaCore RH <{request.user}>"
        msg['To'] = request.testEmail
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Test réussi !</h1>
                </div>
                <div class="content">
                    <p>Félicitations ! Votre configuration SMTP fonctionne parfaitement.</p>
                    <p>Vous pouvez maintenant envoyer des emails automatiques depuis NovaCore.</p>
                    <hr>
                    <p><small>Configuration testée :</small></p>
                    <ul>
                        <li>Serveur : {request.host}:{request.port}</li>
                        <li>Utilisateur : {request.user}</li>
                        <li>Email de test : {request.testEmail}</li>
                    </ul>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Test réussi !
        
        Votre configuration SMTP fonctionne parfaitement.
        Vous pouvez maintenant envoyer des emails automatiques depuis NovaCore.
        
        Configuration testée :
        - Serveur : {request.host}:{request.port}
        - Utilisateur : {request.user}
        - Email de test : {request.testEmail}
        """
        
        msg.attach(MIMEText(text_content, 'plain', 'utf-8'))
        msg.attach(MIMEText(html_content, 'html', 'utf-8'))
        
        # Envoyer l'email
        with smtplib.SMTP(request.host, request.port) as server:
            server.starttls()
            server.login(request.user, request.pass_)
            server.send_message(msg)
        
        logger.info(f"Email de test envoyé avec succès à {request.testEmail}")
        return {"success": True, "message": "Email de test envoyé avec succès"}
        
    except Exception as e:
        logger.error(f"Erreur test email: {e}")
        raise HTTPException(status_code=400, detail=f"Erreur configuration SMTP: {str(e)}")