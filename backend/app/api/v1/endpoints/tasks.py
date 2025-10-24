from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.db import models
from app.schemas import task as task_schema
from app.crud import crud_task, crud_employee

router = APIRouter()

@router.get("/", response_model=List[task_schema.Task])
async def read_tasks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupère la liste des tâches de l'entreprise."""
    tasks = crud_task.get_tasks(db, company_id=current_user.company_id, skip=skip, limit=limit)
    return tasks

@router.post("/", response_model=task_schema.Task, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: task_schema.TaskCreate,
    db: Session = Depends(deps.get_db),
    current_manager: models.User = Depends(deps.get_current_active_manager) # Sécurisé
):
    """Crée une nouvelle tâche (par un manager)."""
    # Vérifie que l'employé assigné existe et appartient à la même entreprise
    employee = crud_employee.get_employee(db, task_in.assigned_to_id)
    if not employee or employee.company_id != current_manager.company_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employé non trouvé dans cette entreprise.",
        )
    
    # Assigne automatiquement le créateur de la tâche
    task_in.assigned_by_id = current_manager.id
    
    return crud_task.create_task(db=db, task=task_in)

@router.get("/{task_id}", response_model=task_schema.Task)
async def read_task(
    task_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupère une tâche spécifique."""
    db_task = crud_task.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tâche non trouvée")
    
    # Vérifie que la tâche appartient à la même entreprise que l'utilisateur
    if db_task.assigned_to.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès non autorisé")
        
    return db_task

@router.put("/{task_id}", response_model=task_schema.Task)
async def update_task(
    task_id: int,
    task_in: task_schema.TaskUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Met à jour une tâche."""
    db_task = crud_task.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tâche non trouvée")
    
    # Vérifie les permissions (créateur ou assigné peut modifier)
    if (db_task.assigned_by_id != current_user.id and 
        db_task.assigned_to.user_id != current_user.id and
        current_user.role not in (models.RoleEnum.hr_admin, models.RoleEnum.employer)):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès non autorisé")
            
    return crud_task.update_task(db=db, db_task=db_task, task_in=task_in)

@router.post("/{task_id}/complete")
async def complete_task(
    task_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Marque une tâche comme terminée"""
    db_task = crud_task.get_task(db, task_id=task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Tâche non trouvée")
    
    # Vérifier permissions
    if (db_task.assigned_to.user_id != current_user.id and 
        db_task.assigned_by_id != current_user.id):
        raise HTTPException(status_code=403, detail="Permission insuffisante")
    
    db_task.status = models.TaskStatusEnum.completed
    db_task.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(db_task)
    
    return {"message": "Tâche terminée", "task": db_task}

@router.post("/{task_id}/assign")
async def assign_task(
    task_id: int,
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Assigne une tâche à un utilisateur"""
    db_task = crud_task.get_task(db, task_id=task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Tâche non trouvée")
    
    # Vérifier permissions (manager ou créateur)
    if (db_task.assigned_by_id != current_user.id and 
        current_user.role not in [models.RoleEnum.manager, models.RoleEnum.hr_admin, models.RoleEnum.employer]):
        raise HTTPException(status_code=403, detail="Permission insuffisante")
    
    # Vérifier que l'employé existe
    employee = crud_employee.get_employee(db, user_id)
    if not employee or employee.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Employé non trouvé")
    
    db_task.assigned_to_id = user_id
    db.commit()
    db.refresh(db_task)
    
    return {"message": "Tâche assignée", "task": db_task}

@router.put("/{task_id}/status")
async def update_task_status(
    task_id: int,
    status: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Met à jour le statut d'une tâche"""
    db_task = crud_task.get_task(db, task_id=task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Tâche non trouvée")
    
    # Vérifier permissions
    if (db_task.assigned_to.user_id != current_user.id and 
        db_task.assigned_by_id != current_user.id):
        raise HTTPException(status_code=403, detail="Permission insuffisante")
    
    # Valider le statut
    valid_statuses = ["todo", "in_progress", "in_review", "completed", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Statut invalide")
    
    db_task.status = status
    if status == "completed":
        db_task.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(db_task)
    
    return {"message": "Statut mis à jour", "task": db_task}