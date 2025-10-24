from sqlalchemy.orm import Session
from typing import Optional, List

from app.db import models
from app.schemas import employee as employee_schema

def get_employee(db: Session, employee_id: int) -> Optional[models.Employee]:
    """Récupère un employé par ID."""
    return db.query(models.Employee).filter(models.Employee.id == employee_id).first()

def get_employee_by_email(db: Session, email: str) -> Optional[models.Employee]:
    """Récupère un employé par email."""
    return db.query(models.Employee).filter(models.Employee.email == email).first()

def get_employees(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[models.Employee]:
    """Récupère tous les employés d'une entreprise."""
    return db.query(models.Employee).filter(models.Employee.company_id == company_id).offset(skip).limit(limit).all()

def create_employee(db: Session, employee: employee_schema.EmployeeCreate) -> models.Employee:
    """Crée un nouvel employé."""
    db_employee = models.Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def update_employee(
    db: Session, 
    db_employee: models.Employee, 
    employee_in: employee_schema.EmployeeUpdate
) -> models.Employee:
    """Met à jour un employé."""
    update_data = employee_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_employee, key, value)
    
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def delete_employee(db: Session, employee_id: int) -> Optional[models.Employee]:
    """Supprime un employé."""
    db_employee = get_employee(db, employee_id)
    if db_employee:
        db.delete(db_employee)
        db.commit()
    return db_employee