from datetime import timedelta, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas import token as token_schema
from app.crud import crud_user
from app.core import security
from app.core.config import settings
import secrets
from app.db import models
from app.core.email import email_service
from pydantic import BaseModel, EmailStr

router = APIRouter()

class RegisterRequest(BaseModel):
    # Données entreprise
    company_name: str
    company_email: EmailStr
    industry: str = None
    company_size: str = None
    
    # Données employeur
    admin_first_name: str
    admin_last_name: str
    admin_email: EmailStr
    admin_password: str

class AcceptInvitationRequest(BaseModel):
    token: str
    password: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr

class ConfirmResetRequest(BaseModel):
    token: str
    new_password: str

@router.post("/login", response_model=token_schema.Token)
async def login_for_access_token(
    db: Session = Depends(deps.get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    Fournit un token JWT après authentification.
    """
    user = crud_user.authenticate_user(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Compte inactif",
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register")
async def register_company(
    register_data: RegisterRequest,
    db: Session = Depends(deps.get_db)
):
    """
    Inscription d'une nouvelle entreprise avec son employeur
    """
    # Vérifier si l'email existe déjà
    existing_user = crud_user.get_user_by_email(db, register_data.admin_email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Un compte avec cet email existe déjà"
        )
    
    # Créer l'entreprise
    company = models.Company(
        name=register_data.company_name,
        email=register_data.company_email,
        plan="basic",
        max_employees=50,
        is_active=True
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    
    # Créer l'employeur (admin)
    hashed_password = security.get_password_hash(register_data.admin_password)
    admin_user = models.User(
        email=register_data.admin_email,
        hashed_password=hashed_password,
        first_name=register_data.admin_first_name,
        last_name=register_data.admin_last_name,
        role=models.RoleEnum.employer,
        company_id=company.id,
        is_active=True
    )
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    
    # Envoyer email de bienvenue
    email_service.send_welcome_email(
        to_email=admin_user.email,
        first_name=admin_user.first_name,
        company_name=company.name
    )
    
    return {
        "message": "Entreprise créée avec succès",
        "company_id": company.id,
        "user_id": admin_user.id
    }

@router.post("/accept-invitation")
async def accept_invitation(
    request: AcceptInvitationRequest,
    db: Session = Depends(deps.get_db)
):
    """Accepte une invitation et crée le compte utilisateur"""
    # Trouver l'invitation
    invitation = db.query(models.Invitation).filter(
        models.Invitation.token == request.token,
        models.Invitation.accepted_at.is_(None)
    ).first()
    
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation non trouvée ou expirée")
    
    # Vérifier si l'email existe déjà
    existing_user = crud_user.get_user_by_email(db, invitation.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Un compte avec cet email existe déjà")
    
    # Créer l'utilisateur
    hashed_password = security.get_password_hash(request.password)
    new_user = models.User(
        email=invitation.email,
        hashed_password=hashed_password,
        first_name=invitation.first_name,
        last_name=invitation.last_name,
        role=invitation.role,
        company_id=invitation.company_id,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Créer automatiquement l'employé
    new_employee = models.Employee(
        name=f"{invitation.first_name} {invitation.last_name}",
        email=invitation.email,
        role=invitation.job_title or invitation.role,
        status="active",
        hire_date=datetime.utcnow().date(),
        salary=invitation.salary,
        company_id=invitation.company_id,
        department_id=invitation.department_id,
        manager_id=invitation.manager_id
    )
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    
    # Lier l'utilisateur à l'employé
    new_user.employee_id = new_employee.id
    
    # Marquer l'invitation comme acceptée et l'utilisateur comme employé actif
    invitation.accepted_at = datetime.utcnow()
    invitation.email_status = "accepted"  # Statut final : compte créé et validé
    
    db.commit()
    db.refresh(new_user)
    
    # Créer un token de connexion automatique
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=new_user.id, expires_delta=access_token_expires
    )
    
    return {
        "message": "Invitation acceptée avec succès",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "first_name": new_user.first_name,
            "last_name": new_user.last_name,
            "role": new_user.role
        }
    }

@router.post("/reset-password")
async def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(deps.get_db)
):
    """Demande de réinitialisation de mot de passe"""
    # Trouver l'utilisateur
    user = crud_user.get_user_by_email(db, request.email)
    if not user:
        # Ne pas révéler si l'email existe ou non
        return {"message": "Si cet email existe, un lien de réinitialisation a été envoyé"}
    
    # Générer un token de réinitialisation
    import secrets
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)  # Expire dans 1h
    
    # Supprimer les anciens tokens de cet utilisateur
    db.query(models.PasswordReset).filter(
        models.PasswordReset.user_id == user.id,
        models.PasswordReset.used_at.is_(None)
    ).delete()
    
    # Créer le nouveau token
    password_reset = models.PasswordReset(
        email=user.email,
        token=reset_token,
        expires_at=expires_at,
        user_id=user.id
    )
    db.add(password_reset)
    db.commit()
    
    # Envoyer l'email de réinitialisation
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
    email_service.send_password_reset_email(
        to_email=user.email,
        first_name=user.first_name,
        reset_link=reset_link
    )
    
    return {"message": "Si cet email existe, un lien de réinitialisation a été envoyé"}

@router.post("/confirm-reset")
async def confirm_reset_password(
    request: ConfirmResetRequest,
    db: Session = Depends(deps.get_db)
):
    """Confirme la réinitialisation avec le nouveau mot de passe"""
    # Trouver le token de réinitialisation
    reset_request = db.query(models.PasswordReset).filter(
        models.PasswordReset.token == request.token,
        models.PasswordReset.used_at.is_(None),
        models.PasswordReset.expires_at > datetime.utcnow()
    ).first()
    
    if not reset_request:
        raise HTTPException(status_code=400, detail="Token invalide ou expiré")
    
    # Mettre à jour le mot de passe
    user = reset_request.user
    user.hashed_password = security.get_password_hash(request.new_password)
    
    # Marquer le token comme utilisé
    reset_request.used_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Mot de passe réinitialisé avec succès"}