from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session

from ....db.database import get_db
from ....crud.crud_task import crud_task
from ....schemas.task import (
    TaskCreate, TaskUpdate, TaskResponse, TaskAssignmentCreate, 
    TaskAssignmentResponse, TaskCommentCreate, TaskCommentResponse,
    TaskAnalytics, UserTaskStats
)
from ....core.auth import get_current_user
from ....db.models import User

router = APIRouter()

@router.post("/", response_model=TaskResponse)
def create_task(
    task: TaskCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new task"""
    try:
        db_task = crud_task.create_task(db, task, current_user.id)
        
        # Send notification if assigned
        if db_task.assigned_to:
            background_tasks.add_task(
                _send_task_notification,
                db_task.id,
                "task_assigned",
                db_task.assigned_to
            )
        
        return _format_task_response(db, db_task)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[TaskResponse])
def get_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    assigned_to: Optional[int] = Query(None),
    department_id: Optional[int] = Query(None),
    overdue: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get tasks with filters"""
    filters = {}
    if status:
        filters["status"] = status
    if priority:
        filters["priority"] = priority
    if category:
        filters["category"] = category
    if assigned_to:
        filters["assigned_to"] = assigned_to
    if department_id:
        filters["department_id"] = department_id
    if overdue:
        filters["overdue"] = overdue
    
    tasks = crud_task.get_tasks(db, skip=skip, limit=limit, filters=filters)
    return [_format_task_response(db, task) for task in tasks]

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get task by ID"""
    task = crud_task.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return _format_task_response(db, task)

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update task"""
    original_task = crud_task.get_task(db, task_id)
    if not original_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    updated_task = crud_task.update_task(db, task_id, task_update)
    if not updated_task:
        raise HTTPException(status_code=400, detail="Failed to update task")
    
    # Send notifications for status changes
    if task_update.status and task_update.status != original_task.status:
        if task_update.status == "completed":
            background_tasks.add_task(
                _send_task_notification,
                task_id,
                "task_completed",
                updated_task.created_by
            )
        elif task_update.status == "in_progress":
            background_tasks.add_task(
                _send_task_notification,
                task_id,
                "task_started",
                updated_task.created_by
            )
    
    # Send notification for assignment changes
    if task_update.assigned_to and task_update.assigned_to != original_task.assigned_to:
        background_tasks.add_task(
            _send_task_notification,
            task_id,
            "task_reassigned",
            task_update.assigned_to
        )
    
    return _format_task_response(db, updated_task)

@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete task"""
    success = crud_task.delete_task(db, task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return {"message": "Task deleted successfully"}

@router.post("/{task_id}/assign", response_model=TaskAssignmentResponse)
def assign_task(
    task_id: int,
    assignment: TaskAssignmentCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Assign task to user"""
    task = crud_task.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_assignment = crud_task.assign_task(
        db, 
        task_id, 
        assignment.assigned_to, 
        current_user.id,
        assignment.notes
    )
    
    # Send notification
    background_tasks.add_task(
        _send_task_notification,
        task_id,
        "task_assigned",
        assignment.assigned_to
    )
    
    return db_assignment

@router.post("/{task_id}/comments", response_model=TaskCommentResponse)
def add_task_comment(
    task_id: int,
    comment: TaskCommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add comment to task"""
    task = crud_task.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_comment = crud_task.add_comment(db, comment, current_user.id)
    return db_comment

@router.get("/{task_id}/comments", response_model=List[TaskCommentResponse])
def get_task_comments(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get task comments"""
    task = crud_task.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return crud_task.get_task_comments(db, task_id)

@router.get("/user/{user_id}", response_model=List[TaskResponse])
def get_user_tasks(
    user_id: int,
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get tasks assigned to user"""
    tasks = crud_task.get_user_tasks(db, user_id, status)
    return [_format_task_response(db, task) for task in tasks]

@router.get("/overdue/all", response_model=List[TaskResponse])
def get_overdue_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all overdue tasks"""
    tasks = crud_task.get_overdue_tasks(db)
    return [_format_task_response(db, task) for task in tasks]

@router.get("/analytics/overview", response_model=TaskAnalytics)
def get_task_analytics(
    department_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get task analytics"""
    return crud_task.get_task_analytics(db, department_id)

@router.get("/analytics/user/{user_id}", response_model=UserTaskStats)
def get_user_task_stats(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user task statistics"""
    stats = crud_task.get_user_task_stats(db, user_id)
    
    # Get user info
    from ....crud.crud_employee import crud_employee
    employee = crud_employee.get(db, user_id)
    user_name = employee.name if employee else "Unknown User"
    
    return UserTaskStats(
        user_id=user_id,
        user_name=user_name,
        **stats
    )

@router.post("/bulk-update")
def bulk_update_tasks(
    task_ids: List[int],
    update_data: TaskUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Bulk update multiple tasks"""
    updated_count = 0
    
    for task_id in task_ids:
        task = crud_task.update_task(db, task_id, update_data)
        if task:
            updated_count += 1
            
            # Send notifications for status changes
            if update_data.status:
                background_tasks.add_task(
                    _send_task_notification,
                    task_id,
                    f"task_{update_data.status}",
                    task.assigned_to or task.created_by
                )
    
    return {"message": f"Updated {updated_count} tasks successfully"}

@router.get("/reminders/due-soon")
def get_due_soon_tasks(
    days: int = Query(3, ge=1, le=30),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get tasks due soon for reminders"""
    from datetime import timedelta
    
    due_date = datetime.utcnow() + timedelta(days=days)
    filters = {
        "due_date_to": due_date,
        "status": "pending"
    }
    
    tasks = crud_task.get_tasks(db, filters=filters)
    return [_format_task_response(db, task) for task in tasks]

# Helper functions
def _format_task_response(db: Session, task) -> TaskResponse:
    """Format task for response with additional data"""
    # Calculate if overdue
    is_overdue = (
        task.due_date and 
        task.due_date < datetime.utcnow() and 
        task.status in ["pending", "in_progress"]
    )
    
    # Calculate days until due
    days_until_due = None
    if task.due_date:
        delta = task.due_date - datetime.utcnow()
        days_until_due = delta.days
    
    # Get assigned user info
    assigned_user = None
    if task.assigned_to:
        from ....crud.crud_employee import crud_employee
        employee = crud_employee.get(db, task.assigned_to)
        if employee:
            assigned_user = {
                "id": employee.id,
                "name": employee.name,
                "email": employee.email
            }
    
    # Get department info
    department = None
    if task.department_id:
        from ....crud.crud_department import crud_department
        dept = crud_department.get(db, task.department_id)
        if dept:
            department = {
                "id": dept.id,
                "name": dept.name
            }
    
    return TaskResponse(
        **task.__dict__,
        assigned_user=assigned_user,
        department=department,
        is_overdue=is_overdue,
        days_until_due=days_until_due
    )

def _send_task_notification(task_id: int, notification_type: str, user_id: int):
    """Send task notification (placeholder for notification system)"""
    # This would integrate with your notification system
    print(f"Sending {notification_type} notification for task {task_id} to user {user_id}")
    pass