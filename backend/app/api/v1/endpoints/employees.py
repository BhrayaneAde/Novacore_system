from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.db import models
from app.schemas import employee as employee_schema
from app.crud import crud_employee

router = APIRouter()

@router.get("/", response_model=List[employee_schema.Employee])
async def read_employees(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user) # N'importe quel user connecté
):
    """Récupère la liste des employés de l'entreprise de l'utilisateur."""
    employees = crud_employee.get_employees(db, company_id=current_user.company_id, skip=skip, limit=limit)
    return employees

@router.post("/", response_model=employee_schema.Employee, status_code=status.HTTP_201_CREATED)
async def create_employee(
    employee_in: employee_schema.EmployeeCreate,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin) # Sécurisé
):
    """Crée un nouvel employé (par un admin)."""
    employee = crud_employee.get_employee_by_email(db, email=employee_in.email)
    if employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un employé avec cet email existe déjà.",
        )
    
    # Assure que le nouvel employé est dans la même entreprise que l'admin
    employee_in.company_id = current_admin.company_id
    
    return crud_employee.create_employee(db=db, employee=employee_in)

@router.get("/{employee_id}", response_model=employee_schema.Employee)
async def read_employee(
    employee_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupère un employé spécifique."""
    db_employee = crud_employee.get_employee(db, employee_id=employee_id)
    if db_employee is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employé non trouvé")
    
    # Vérifie que l'employé appartient à la même entreprise que l'utilisateur
    if db_employee.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès non autorisé")
        
    return db_employee

@router.put("/{employee_id}", response_model=employee_schema.Employee)
async def update_employee(
    employee_id: int,
    employee_in: employee_schema.EmployeeUpdate,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin) # Sécurisé
):
    """Met à jour un employé."""
    db_employee = crud_employee.get_employee(db, employee_id=employee_id)
    if db_employee is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employé non trouvé")
    
    if db_employee.company_id != current_admin.company_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès non autorisé")

    # Vérifie si le nouvel email est déjà pris
    if employee_in.email:
        existing_employee = crud_employee.get_employee_by_email(db, email=employee_in.email)
        if existing_employee and existing_employee.id != employee_id:
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cet email est déjà utilisé.",
            )
            
    return crud_employee.update_employee(db=db, db_employee=db_employee, employee_in=employee_in)