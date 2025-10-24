from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date

# --- EmployeeDocument Schemas ---
class EmployeeDocumentBase(BaseModel):
    name: str
    type: str
    url: str

class EmployeeDocumentCreate(EmployeeDocumentBase):
    pass

class EmployeeDocument(EmployeeDocumentBase):
    id: int
    upload_date: date

    model_config = {"from_attributes": True}

# --- Employee Schemas ---
class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    role: Optional[str] = None # Job title
    status: Optional[str] = "active"
    avatar: Optional[str] = None
    hire_date: Optional[date] = None
    salary: Optional[float] = None
    phone: Optional[str] = None
    birth_date: Optional[date] = None
    department_id: Optional[int] = None
    manager_id: Optional[int] = None
    
    # Autres champs de mockData
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    social_security_number: Optional[str] = None
    iban: Optional[str] = None
    emergency_contact: Optional[str] = None
    emergency_phone: Optional[str] = None
    marital_status: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    company_id: int

class EmployeeUpdate(EmployeeBase):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    # Tous les champs sont optionnels pour la mise à jour
    pass

class Employee(EmployeeBase):
    id: int
    company_id: int
    documents: List[EmployeeDocument] = []

    model_config = {"from_attributes": True}