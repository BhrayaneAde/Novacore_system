from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from enum import Enum

class WorkflowStatus(str, Enum):
    draft = "draft"
    active = "active"
    completed = "completed"
    cancelled = "cancelled"

class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    skipped = "skipped"

class WorkflowTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    duration_days: int = 30
    is_active: bool = True

class WorkflowTemplateCreate(WorkflowTemplateBase):
    pass

class WorkflowTemplate(WorkflowTemplateBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {"from_attributes": True}

class TaskTemplateBase(BaseModel):
    title: str
    description: Optional[str] = None
    day_offset: int = 0  # Jour relatif au début du workflow
    estimated_hours: Optional[float] = None
    is_mandatory: bool = True
    assigned_role: Optional[str] = None  # "manager", "hr", "buddy", "employee"
    category: Optional[str] = None

class TaskTemplateCreate(TaskTemplateBase):
    workflow_template_id: int

class TaskTemplate(TaskTemplateBase):
    id: int
    workflow_template_id: int
    order_index: int
    
    model_config = {"from_attributes": True}

class WorkflowInstanceBase(BaseModel):
    employee_id: int
    template_id: int
    start_date: date
    expected_end_date: date
    status: WorkflowStatus = WorkflowStatus.active

class WorkflowInstanceCreate(WorkflowInstanceBase):
    pass

class WorkflowInstance(WorkflowInstanceBase):
    id: int
    actual_end_date: Optional[date] = None
    completion_percentage: float = 0.0
    created_at: datetime
    
    model_config = {"from_attributes": True}

class TaskInstanceBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: date
    assigned_to_id: Optional[int] = None
    status: TaskStatus = TaskStatus.pending
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    notes: Optional[str] = None

class TaskInstanceCreate(TaskInstanceBase):
    workflow_instance_id: int
    task_template_id: int

class TaskInstanceUpdate(BaseModel):
    status: Optional[TaskStatus] = None
    assigned_to_id: Optional[int] = None
    actual_hours: Optional[float] = None
    notes: Optional[str] = None
    completed_at: Optional[datetime] = None

class TaskInstance(TaskInstanceBase):
    id: int
    workflow_instance_id: int
    task_template_id: int
    completed_at: Optional[datetime] = None
    created_at: datetime
    
    model_config = {"from_attributes": True}

class WorkflowProgress(BaseModel):
    workflow_id: int
    employee_name: str
    template_name: str
    status: WorkflowStatus
    completion_percentage: float
    tasks_completed: int
    tasks_total: int
    days_remaining: int
    overdue_tasks: int