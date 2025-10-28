from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date, timedelta
from app.db import models
from app.schemas import workflow as workflow_schema

# Workflow Templates
def create_workflow_template(db: Session, template: workflow_schema.WorkflowTemplateCreate) -> models.WorkflowTemplate:
    db_template = models.WorkflowTemplate(**template.dict())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

def get_workflow_templates(db: Session, company_id: int) -> List[models.WorkflowTemplate]:
    return db.query(models.WorkflowTemplate).filter(
        models.WorkflowTemplate.company_id == company_id,
        models.WorkflowTemplate.is_active == True
    ).all()

def get_workflow_template(db: Session, template_id: int) -> Optional[models.WorkflowTemplate]:
    return db.query(models.WorkflowTemplate).filter(models.WorkflowTemplate.id == template_id).first()

# Task Templates
def create_task_template(db: Session, task: workflow_schema.TaskTemplateCreate) -> models.TaskTemplate:
    # Calculer l'ordre automatiquement
    max_order = db.query(models.TaskTemplate).filter(
        models.TaskTemplate.workflow_template_id == task.workflow_template_id
    ).count()
    
    db_task = models.TaskTemplate(**task.dict(), order_index=max_order + 1)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_task_templates(db: Session, template_id: int) -> List[models.TaskTemplate]:
    return db.query(models.TaskTemplate).filter(
        models.TaskTemplate.workflow_template_id == template_id
    ).order_by(models.TaskTemplate.order_index).all()

# Workflow Instances
def create_workflow_instance(db: Session, workflow: workflow_schema.WorkflowInstanceCreate) -> models.WorkflowInstance:
    db_workflow = models.WorkflowInstance(**workflow.dict())
    db.add(db_workflow)
    db.commit()
    db.refresh(db_workflow)
    
    # Créer les tâches automatiquement
    template = get_workflow_template(db, workflow.template_id)
    if template:
        task_templates = get_task_templates(db, template.id)
        for task_template in task_templates:
            due_date = workflow.start_date + timedelta(days=task_template.day_offset)
            
            task_instance = models.TaskInstance(
                workflow_instance_id=db_workflow.id,
                task_template_id=task_template.id,
                title=task_template.title,
                description=task_template.description,
                due_date=due_date,
                estimated_hours=task_template.estimated_hours,
                status="pending"
            )
            db.add(task_instance)
        
        db.commit()
    
    return db_workflow

def get_workflow_instances(db: Session, company_id: int, status: Optional[str] = None) -> List[models.WorkflowInstance]:
    query = db.query(models.WorkflowInstance).join(models.Employee).filter(
        models.Employee.company_id == company_id
    )
    
    if status:
        query = query.filter(models.WorkflowInstance.status == status)
    
    return query.order_by(models.WorkflowInstance.created_at.desc()).all()

def get_workflow_instance(db: Session, workflow_id: int) -> Optional[models.WorkflowInstance]:
    return db.query(models.WorkflowInstance).filter(models.WorkflowInstance.id == workflow_id).first()

# Task Instances
def update_task_instance(db: Session, task_id: int, task_update: workflow_schema.TaskInstanceUpdate) -> Optional[models.TaskInstance]:
    db_task = db.query(models.TaskInstance).filter(models.TaskInstance.id == task_id).first()
    if not db_task:
        return None
    
    update_data = task_update.dict(exclude_unset=True)
    
    # Si la tâche est marquée comme complétée, ajouter la date
    if update_data.get('status') == 'completed' and not db_task.completed_at:
        update_data['completed_at'] = datetime.utcnow()
    
    for key, value in update_data.items():
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    
    # Mettre à jour le pourcentage de completion du workflow
    update_workflow_progress(db, db_task.workflow_instance_id)
    
    return db_task

def get_task_instances(db: Session, workflow_id: int) -> List[models.TaskInstance]:
    return db.query(models.TaskInstance).filter(
        models.TaskInstance.workflow_instance_id == workflow_id
    ).order_by(models.TaskInstance.due_date).all()

def update_workflow_progress(db: Session, workflow_id: int):
    """Mettre à jour le pourcentage de completion d'un workflow"""
    tasks = get_task_instances(db, workflow_id)
    if not tasks:
        return
    
    completed_tasks = len([t for t in tasks if t.status == 'completed'])
    total_tasks = len(tasks)
    completion_percentage = (completed_tasks / total_tasks) * 100
    
    workflow = get_workflow_instance(db, workflow_id)
    if workflow:
        workflow.completion_percentage = completion_percentage
        
        # Si toutes les tâches sont complétées, marquer le workflow comme terminé
        if completion_percentage == 100:
            workflow.status = 'completed'
            workflow.actual_end_date = date.today()
        
        db.commit()

def get_workflow_progress(db: Session, company_id: int) -> List[workflow_schema.WorkflowProgress]:
    """Obtenir le progrès de tous les workflows actifs"""
    workflows = get_workflow_instances(db, company_id, status="active")
    progress_list = []
    
    for workflow in workflows:
        tasks = get_task_instances(db, workflow.id)
        completed_tasks = len([t for t in tasks if t.status == 'completed'])
        overdue_tasks = len([t for t in tasks if t.due_date < date.today() and t.status != 'completed'])
        
        days_remaining = (workflow.expected_end_date - date.today()).days
        
        employee = db.query(models.Employee).filter(models.Employee.id == workflow.employee_id).first()
        template = get_workflow_template(db, workflow.template_id)
        
        progress = workflow_schema.WorkflowProgress(
            workflow_id=workflow.id,
            employee_name=f"{employee.first_name} {employee.last_name}" if employee else "Inconnu",
            template_name=template.name if template else "Template supprimé",
            status=workflow.status,
            completion_percentage=workflow.completion_percentage,
            tasks_completed=completed_tasks,
            tasks_total=len(tasks),
            days_remaining=days_remaining,
            overdue_tasks=overdue_tasks
        )
        progress_list.append(progress)
    
    return progress_list