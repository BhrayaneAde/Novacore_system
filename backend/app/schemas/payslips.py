from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class PayslipStatusEnum(str, Enum):
    DRAFT = "draft"
    GENERATED = "generated"
    VALIDATED = "validated"
    SENT = "sent"

class PayslipGenerate(BaseModel):
    period: str = Field(..., description="Période au format YYYY-MM")
    employee_ids: Optional[List[int]] = Field(None, description="IDs des employés (tous si vide)")
    force_regenerate: bool = Field(False, description="Forcer la régénération")

class PayslipCreate(BaseModel):
    employee_id: int
    period: str
    base_salary: float
    gross_salary: float
    net_salary: float
    deductions: float

class PayslipUpdate(BaseModel):
    base_salary: Optional[float] = None
    gross_salary: Optional[float] = None
    net_salary: Optional[float] = None
    deductions: Optional[float] = None

class PayslipStatus(BaseModel):
    status: PayslipStatusEnum

class PayslipResponse(BaseModel):
    id: int
    employee_id: int
    employee_name: str
    period: str
    base_salary: float
    gross_salary: float
    net_salary: float
    deductions: float
    status: str
    generated_at: str
    sent_at: Optional[str] = None

    class Config:
        from_attributes = True