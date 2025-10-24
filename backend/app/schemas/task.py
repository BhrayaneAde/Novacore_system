from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.db.models import TaskStatusEnum, TaskPriorityEnum

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Optional[TaskPriorityEnum] = TaskPriorityEnum.normal
    status: Optional[TaskStatusEnum] = TaskStatusEnum.todo
    due_date: Optional[datetime] = None
    estimated_hours: Optional[float] = None
    
    assigned_to_id: int
    department_id: Optional[int] = None

class TaskCreate(TaskBase):
    assigned_by_id: int # Défini lors de la création

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[TaskPriorityEnum] = None
    status: Optional[TaskStatusEnum] = None
    due_date: Optional[datetime] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    completed_at: Optional[datetime] = None
    assigned_to_id: Optional[int] = None

class Task(TaskBase):
    id: int
    assigned_by_id: int
    actual_hours: Optional[float] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}