from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import decode_token
from app.db.database import SessionLocal
from app.db import models
from app.schemas import token as token_schema
from app.schemas import user as user_schema
from app.crud import crud_user
from app.db.models import RoleEnum

# Définit le schéma d'authentification
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_db() -> Generator:
    """Dépendance pour obtenir la session BDD."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> models.User:
    """
    Dépendance pour obtenir l'utilisateur actuel à partir du token JWT.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les identifiants",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception
        
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
        
    token_data = token_schema.TokenData(sub=user_id)
    
    user = crud_user.get_user(db, user_id=int(token_data.sub))
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    """Vérifie si l'utilisateur actuel est actif."""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Compte inactif")
    return current_user

# --- Dépendances de Rôle ---
# Celles-ci peuvent être utilisées pour protéger des endpoints spécifiques

def get_current_active_hr_admin(
    current_user: models.User = Depends(get_current_active_user),
) -> models.User:
    """Vérifie si l'utilisateur est un HR Admin ou plus."""
    if current_user.role not in (RoleEnum.hr_admin, RoleEnum.employer):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Droits insuffisants. Administrateur RH requis.",
        )
    return current_user

def get_current_active_manager(
    current_user: models.User = Depends(get_current_active_user),
) -> models.User:
    """Vérifie si l'utilisateur est un Manager ou plus."""
    if current_user.role not in (RoleEnum.manager, RoleEnum.hr_admin, RoleEnum.employer):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Droits insuffisants. Manager requis.",
        )
    return current_user