from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class CalculationStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class PayrollCalculationRequest(BaseModel):
    period: str = Field(..., description="Période de calcul (YYYY-MM)")
    employee_ids: Optional[List[int]] = Field(None, description="IDs des employés à traiter (tous si vide)")
    force_recalculation: bool = Field(False, description="Forcer le recalcul même si déjà fait")

class EmployeeCalculation(BaseModel):
    employee_id: int
    employee_name: Optional[str] = None
    period: str
    base_salary: float
    gross_salary: float
    total_additions: float
    total_deductions: float
    net_salary: float
    calculation_details: List[Dict[str, Any]]
    calculated_at: str
    status: str = "completed"

class PayrollCalculationResult(BaseModel):
    calculation_id: str
    employee_id: int
    period: str
    base_salary: float
    gross_salary: float
    net_salary: float
    deductions: float
    status: str
    calculated_at: datetime

class PayrollCalculationStatus(BaseModel):
    calculation_id: str
    status: CalculationStatus
    total_employees: int
    completed_employees: int
    failed_employees: int
    calculations: List[Dict[str, Any]] = []
    started_at: datetime
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None

class PayrollValidationResult(BaseModel):
    is_valid: bool
    errors: List[str]
    warnings: List[str]
    validation_date: str