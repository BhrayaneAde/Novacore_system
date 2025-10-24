from pydantic import BaseModel
from typing import Optional
from datetime import date

class AttendanceRecordBase(BaseModel):
    date: date
    status: str
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    break_duration: Optional[int] = 0
    total_hours: Optional[float] = None

class AttendanceRecordCreate(AttendanceRecordBase):
    employee_id: int

class AttendanceRecord(AttendanceRecordBase):
    id: int
    employee_id: int

    model_config = {"from_attributes": True}

class TimeEntryBase(BaseModel):
    date: date
    start_time: str
    end_time: str
    break_duration: Optional[int] = 0
    total_hours: float
    project: Optional[str] = None
    description: Optional[str] = None

class TimeEntryCreate(TimeEntryBase):
    employee_id: int

class TimeEntryUpdate(BaseModel):
    status: Optional[str] = None
    approved_by_id: Optional[int] = None

class TimeEntry(TimeEntryBase):
    id: int
    employee_id: int
    status: str
    approved_by_id: Optional[int] = None

    model_config = {"from_attributes": True}