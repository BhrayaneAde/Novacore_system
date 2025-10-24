from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.db import models
from app.schemas import user as user_schema
from app.crud import crud_user, crud_employee

router = APIRouter()

@router.get("/me", response_model=user_schema.User)
async def read_users_me(
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """Récupère l'utilisateur actuellement connecté."""
    return current_user

@router.post("/", response_model=user_schema.User, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_in: user_schema.UserCreate,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin) # Sécurisé
):
    """Crée un nouvel utilisateur (par un admin)."""
    user = crud_user.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un utilisateur avec cet email existe déjà.",
        )
    
    # Assure que le nouvel utilisateur est dans la même entreprise que l'admin
    user_in.company_id = current_admin.company_id
    
    # Si un employee_id est fourni, vérifie qu'il existe
    if user_in.employee_id:
        emp = crud_employee.get_employee(db, user_in.employee_id)
        if not emp or emp.company_id != current_admin.company_id:
             raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employé non trouvé dans cette entreprise.",
            )

    return crud_user.create_user(db=db, user=user_in)

@router.get("/", response_model=List[user_schema.User])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_hr_admin) # Sécurisé
):
    """Récupère la liste des utilisateurs de l'entreprise."""
    users = crud_user.get_users(db, company_id=current_user.company_id, skip=skip, limit=limit)
    return users