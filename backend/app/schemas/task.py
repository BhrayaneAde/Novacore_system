from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    OVERDUE = "overdue"

class TaskCategory(str, Enum):
    ADMINISTRATIVE = "administrative"
    TRAINING = "training"
    REVIEW = "review"
    MEETING = "meeting"
    PROJECT = "project"
    MAINTENANCE = "maintenance"

# Base schemas
class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    priority: TaskPriority = TaskPriority.MEDIUM
    category: TaskCategory
    due_date: Optional[datetime] = None
    estimated_hours: Optional[float] = Field(None, ge=0, le=100)
    assigned_to: Optional[int] = None
    department_id: Optional[int] = None
    tags: Optional[List[str]] = []

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    priority: Optional[TaskPriority] = None
    category: Optional[TaskCategory] = None
    status: Optional[TaskStatus] = None
    due_date: Optional[datetime] = None
    estimated_hours: Optional[float] = Field(None, ge=0, le=100)
    assigned_to: Optional[int] = None
    progress: Optional[int] = Field(None, ge=0, le=100)
    tags: Optional[List[str]] = None

class TaskResponse(TaskBase):
    id: int
    status: TaskStatus
    progress: int = 0
    created_at: datetime
    updated_at: datetime
    created_by: int
    assigned_user: Optional[dict] = None
    department: Optional[dict] = None
    is_overdue: bool = False
    days_until_due: Optional[int] = None

    class Config:
        from_attributes = True

# Task assignment schemas
class TaskAssignmentCreate(BaseModel):
    task_id: int
    assigned_to: int
    assigned_by: int
    notes: Optional[str] = None

class TaskAssignmentResponse(BaseModel):
    id: int
    task_id: int
    assigned_to: int
    assigned_by: int
    assigned_at: datetime
    notes: Optional[str] = None
    task: Optional[TaskResponse] = None
    assignee: Optional[dict] = None
    assigner: Optional[dict] = None

    class Config:
        from_attributes = True

# Task comment schemas
class TaskCommentCreate(BaseModel):
    task_id: int
    content: str = Field(..., min_length=1, max_length=500)

class TaskCommentResponse(BaseModel):
    id: int
    task_id: int
    content: str
    created_at: datetime
    created_by: int
    author: Optional[dict] = None

    class Config:
        from_attributes = True

# Task analytics schemas
class TaskAnalytics(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    overdue_tasks: int
    completion_rate: float
    average_completion_time: Optional[float] = None
    tasks_by_priority: dict
    tasks_by_category: dict
    tasks_by_status: dict

class UserTaskStats(BaseModel):
    user_id: int
    user_name: str
    total_assigned: int
    completed: int
    pending: int
    overdue: int
    completion_rate: float
    average_completion_time: Optional[float] = None