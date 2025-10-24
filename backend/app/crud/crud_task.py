from sqlalchemy.orm import Session
from typing import Optional, List

from app.db import models
from app.schemas import task as task_schema

def get_task(db: Session, task_id: int) -> Optional[models.Task]:
    """Récupère une tâche par ID."""
    return db.query(models.Task).filter(models.Task.id == task_id).first()

def get_tasks(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[models.Task]:
    """Récupère toutes les tâches d'une entreprise."""
    return db.query(models.Task).join(models.Employee).filter(
        models.Employee.company_id == company_id
    ).offset(skip).limit(limit).all()

def get_tasks_by_employee(db: Session, employee_id: int, skip: int = 0, limit: int = 100) -> List[models.Task]:
    """Récupère les tâches assignées à un employé."""
    return db.query(models.Task).filter(
        models.Task.assigned_to_id == employee_id
    ).offset(skip).limit(limit).all()

def create_task(db: Session, task: task_schema.TaskCreate) -> models.Task:
    """Crée une nouvelle tâche."""
    db_task = models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(
    db: Session, 
    db_task: models.Task, 
    task_in: task_schema.TaskUpdate
) -> models.Task:
    """Met à jour une tâche."""
    update_data = task_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
    
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int) -> Optional[models.Task]:
    """Supprime une tâche."""
    db_task = get_task(db, task_id)
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task