from sqlalchemy.orm import Session
from typing import Optional

from app.db import models
from app.schemas import user as user_schema
from app.core.security import get_password_hash, verify_password

def get_user(db: Session, user_id: int) -> Optional[models.User]:
    """Récupère un utilisateur par ID."""
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    """Récupère un utilisateur par email."""
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> list[models.User]:
    """Récupère tous les utilisateurs d'une entreprise."""
    return db.query(models.User).filter(models.User.company_id == company_id).offset(skip).limit(limit).all()

def create_user(db: Session, user: user_schema.UserCreate) -> models.User:
    """Crée un nouvel utilisateur."""
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role,
        company_id=user.company_id,
        employee_id=user.employee_id,
        is_active=user.is_active,
        avatar=user.avatar
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str) -> Optional[models.User]:
    """Authentifie un utilisateur."""
    user = get_user_by_email(db, email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user