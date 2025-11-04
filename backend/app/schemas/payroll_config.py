from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class PayrollVariableBase(BaseModel):
    code: str
    name: str
    variable_type: str
    is_mandatory: bool = False
    is_active: bool = True
    calculation_method: Optional[str] = None
    fixed_amount: Optional[float] = None
    percentage_rate: Optional[float] = None
    formula: Optional[str] = None
    description: Optional[str] = None
    display_order: int = 0

class PayrollVariableCreate(PayrollVariableBase):
    company_id: int

class PayrollVariableUpdate(BaseModel):
    name: Optional[str] = None
    is_active: Optional[bool] = None
    calculation_method: Optional[str] = None
    fixed_amount: Optional[float] = None
    percentage_rate: Optional[float] = None
    formula: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = None

class PayrollVariable(PayrollVariableBase):
    id: int
    company_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class PayrollConfigBase(BaseModel):
    company_type: str
    country_code: str = "BJ"
    currency_code: str = "XOF"
    payroll_variables: Optional[Dict[str, Any]] = None
    tax_rates: Optional[Dict[str, Any]] = None
    formulas: Optional[Dict[str, Any]] = None

class PayrollConfigCreate(PayrollConfigBase):
    company_id: int

class PayrollConfigUpdate(BaseModel):
    company_type: Optional[str] = None
    payroll_variables: Optional[Dict[str, Any]] = None
    tax_rates: Optional[Dict[str, Any]] = None
    formulas: Optional[Dict[str, Any]] = None

class PayrollConfig(PayrollConfigBase):
    id: int
    company_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class PayrollTemplateResponse(BaseModel):
    name: str
    description: str
    variables: List[Dict[str, Any]]

class CompanyPayrollSetup(BaseModel):
    company_type: str
    selected_variables: List[str]
    custom_variables: Optional[List[PayrollVariableCreate]] = None
    tax_settings: Optional[Dict[str, Any]] = None

class EmployeePayrollDataBase(BaseModel):
    variable_code: str
    value: float
    period: str  # YYYY-MM

class EmployeePayrollDataCreate(EmployeePayrollDataBase):
    employee_id: int

class EmployeePayrollData(EmployeePayrollDataBase):
    id: int
    employee_id: int
    created_at: datetime

    model_config = {"from_attributes": True}

class PayrollCalculationRequest(BaseModel):
    employee_id: int
    period: str
    variable_values: Dict[str, float]  # code -> value
    
class PayrollCalculationResult(BaseModel):
    employee_id: int
    period: str
    gross_salary: float
    total_allowances: float
    total_deductions: float
    taxable_income: float
    tax_amount: float
    social_contributions: float
    net_salary: float
    salary_breakdown: Dict[str, Any]