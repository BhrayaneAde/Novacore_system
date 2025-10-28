from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import workflow as workflow_schema
from app.crud import crud_workflow, crud_employee

router = APIRouter()

# Workflow Templates
@router.get("/templates", response_model=List[workflow_schema.WorkflowTemplate])
async def get_workflow_templates(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupérer tous les templates de workflow"""
    return crud_workflow.get_workflow_templates(db, current_user.company_id)

@router.post("/templates", response_model=workflow_schema.WorkflowTemplate, status_code=status.HTTP_201_CREATED)
async def create_workflow_template(
    template_in: workflow_schema.WorkflowTemplateCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_manager)
):
    """Créer un nouveau template de workflow"""
    template_in.company_id = current_user.company_id
    return crud_workflow.create_workflow_template(db, template_in)

@router.get("/templates/{template_id}", response_model=workflow_schema.WorkflowTemplate)
async def get_workflow_template(
    template_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupérer un template spécifique"""
    template = crud_workflow.get_workflow_template(db, template_id)
    if not template or template.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Template non trouvé")
    return template

# Task Templates
@router.get("/templates/{template_id}/tasks", response_model=List[workflow_schema.TaskTemplate])
async def get_task_templates(
    template_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupérer les tâches d'un template"""
    template = crud_workflow.get_workflow_template(db, template_id)
    if not template or template.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Template non trouvé")
    
    return crud_workflow.get_task_templates(db, template_id)

@router.post("/templates/{template_id}/tasks", response_model=workflow_schema.TaskTemplate, status_code=status.HTTP_201_CREATED)
async def create_task_template(
    template_id: int,
    task_in: workflow_schema.TaskTemplateCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_manager)
):
    """Ajouter une tâche à un template"""
    template = crud_workflow.get_workflow_template(db, template_id)
    if not template or template.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Template non trouvé")
    
    task_in.workflow_template_id = template_id
    return crud_workflow.create_task_template(db, task_in)

# Workflow Instances
@router.get("/instances", response_model=List[workflow_schema.WorkflowInstance])
async def get_workflow_instances(
    status: str = None,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupérer les instances de workflow"""
    return crud_workflow.get_workflow_instances(db, current_user.company_id, status)

@router.post("/instances", response_model=workflow_schema.WorkflowInstance, status_code=status.HTTP_201_CREATED)
async def create_workflow_instance(
    workflow_in: workflow_schema.WorkflowInstanceCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_manager)
):
    """Démarrer un nouveau workflow pour un employé"""
    # Vérifier que l'employé existe et appartient à la même entreprise
    employee = crud_employee.get_employee(db, workflow_in.employee_id)
    if not employee or employee.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Employé non trouvé")
    
    # Vérifier que le template existe
    template = crud_workflow.get_workflow_template(db, workflow_in.template_id)
    if not template or template.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Template non trouvé")
    
    return crud_workflow.create_workflow_instance(db, workflow_in)

@router.get("/instances/{workflow_id}", response_model=workflow_schema.WorkflowInstance)
async def get_workflow_instance(
    workflow_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupérer une instance spécifique"""
    workflow = crud_workflow.get_workflow_instance(db, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow non trouvé")
    
    # Vérifier les permissions
    employee = crud_employee.get_employee(db, workflow.employee_id)
    if not employee or employee.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Workflow non trouvé")
    
    return workflow

# Task Instances
@router.get("/instances/{workflow_id}/tasks", response_model=List[workflow_schema.TaskInstance])
async def get_workflow_tasks(
    workflow_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupérer les tâches d'un workflow"""
    workflow = crud_workflow.get_workflow_instance(db, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow non trouvé")
    
    return crud_workflow.get_task_instances(db, workflow_id)

@router.put("/tasks/{task_id}", response_model=workflow_schema.TaskInstance)
async def update_task(
    task_id: int,
    task_update: workflow_schema.TaskInstanceUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Mettre à jour une tâche"""
    task = crud_workflow.update_task_instance(db, task_id, task_update)
    if not task:
        raise HTTPException(status_code=404, detail="Tâche non trouvée")
    
    return task

# Progress & Analytics
@router.get("/progress", response_model=List[workflow_schema.WorkflowProgress])
async def get_workflow_progress(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupérer le progrès de tous les workflows"""
    return crud_workflow.get_workflow_progress(db, current_user.company_id)

@router.get("/analytics")
async def get_workflow_analytics(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Statistiques des workflows"""
    workflows = crud_workflow.get_workflow_instances(db, current_user.company_id)
    
    total_workflows = len(workflows)
    active_workflows = len([w for w in workflows if w.status == 'active'])
    completed_workflows = len([w for w in workflows if w.status == 'completed'])
    
    # Calcul du temps moyen de completion
    completed = [w for w in workflows if w.status == 'completed' and w.actual_end_date]
    avg_completion_days = 0
    if completed:
        total_days = sum([(w.actual_end_date - w.start_date).days for w in completed])
        avg_completion_days = total_days / len(completed)
    
    return {
        "total_workflows": total_workflows,
        "active_workflows": active_workflows,
        "completed_workflows": completed_workflows,
        "completion_rate": (completed_workflows / total_workflows * 100) if total_workflows > 0 else 0,
        "avg_completion_days": round(avg_completion_days, 1)
    }