from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ....db.database import get_db
from ....core.auth import get_current_user
from ....db.models import User, Employee

router = APIRouter()

@router.get("/")
def get_employees(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère la liste des employés de l'entreprise de l'utilisateur."""
    employees = db.query(Employee).filter(Employee.company_id == current_user.company_id).offset(skip).limit(limit).all()
    return employees

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_employee(
    employee_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée un nouvel employé."""
    existing_employee = db.query(Employee).filter(Employee.email == employee_data.get('email')).first()
    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un employé avec cet email existe déjà.",
        )
    
    employee_data['company_id'] = current_user.company_id
    employee = Employee(**employee_data)
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee

@router.get("/{employee_id}")
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère un employé spécifique."""
    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.company_id == current_user.company_id
    ).first()
    
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employé non trouvé")
        
    return employee

@router.put("/{employee_id}")
def update_employee(
    employee_id: int,
    employee_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour un employé."""
    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.company_id == current_user.company_id
    ).first()
    
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employé non trouvé")

    # Vérifie si le nouvel email est déjà pris
    if 'email' in employee_data:
        existing_employee = db.query(Employee).filter(
            Employee.email == employee_data['email'],
            Employee.id != employee_id
        ).first()
        if existing_employee:
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cet email est déjà utilisé.",
            )
    
    for field, value in employee_data.items():
        setattr(employee, field, value)
    
    db.commit()
    db.refresh(employee)
    return employee

@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprime un employé."""
    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.company_id == current_user.company_id
    ).first()
    
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employé non trouvé")
    
    db.delete(employee)
    db.commit()
    return {"message": "Employé supprimé avec succès"}

