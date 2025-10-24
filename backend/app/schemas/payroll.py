from pydantic import BaseModel
from typing import Optional
from datetime import date

class PayrollRecordBase(BaseModel):
    month: str
    base_salary: float
    bonus: Optional[float] = 0
    deductions: Optional[float] = 0
    net_salary: float

class PayrollRecordCreate(PayrollRecordBase):
    employee_id: int
    processed_by_id: int

class PayrollRecordUpdate(BaseModel):
    status: Optional[str] = None
    processed_date: Optional[date] = None

class PayrollRecord(PayrollRecordBase):
    id: int
    employee_id: int
    processed_by_id: int
    status: str
    processed_date: Optional[date] = None

    model_config = {"from_attributes": True}