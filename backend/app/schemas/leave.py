from pydantic import BaseModel
from typing import Optional
from datetime import date
from app.db.models import LeaveStatusEnum

class LeaveRequestBase(BaseModel):
    type: str
    start_date: date
    end_date: date
    days: Optional[float] = None
    reason: Optional[str] = None

class LeaveRequestCreate(LeaveRequestBase):
    employee_id: int

class LeaveRequestUpdate(BaseModel):
    status: Optional[LeaveStatusEnum] = None
    reason: Optional[str] = None

class LeaveRequest(LeaveRequestBase):
    id: int
    employee_id: int
    status: LeaveStatusEnum
    request_date: date

    model_config = {"from_attributes": True}