from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime

class DepartmentBase(BaseModel):
    name: str
    manager_id: Optional[int] = None

class DepartmentCreate(DepartmentBase):
    company_id: int

class Department(DepartmentBase):
    id: int
    company_id: int

    model_config = {"from_attributes": True}

class CompanyBase(BaseModel):
    name: str
    email: EmailStr
    plan: Optional[str] = None
    max_employees: Optional[int] = -1
    settings_smtp: Optional[Dict[str, Any]] = None
    settings_leave_policy: Optional[Dict[str, Any]] = None
    settings_work_schedule: Optional[Dict[str, Any]] = None
    settings_security: Optional[Dict[str, Any]] = None
    settings_appearance: Optional[Dict[str, Any]] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(CompanyBase):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class Company(CompanyBase):
    id: int
    created_date: datetime
    is_active: bool

    model_config = {"from_attributes": True}