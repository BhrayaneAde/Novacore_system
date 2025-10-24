from pydantic import BaseModel
from typing import Optional
from datetime import date

class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    start_date: Optional[date] = None
    due_date: Optional[date] = None
    progress: Optional[int] = 0

class GoalCreate(GoalBase):
    employee_id: int
    created_by_id: int

class GoalUpdate(BaseModel):
    progress: Optional[int] = None
    status: Optional[str] = None

class Goal(GoalBase):
    id: int
    employee_id: int
    created_by_id: int
    status: str

    model_config = {"from_attributes": True}