from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class DeclarationType(str, Enum):
    CNSS_MONTHLY = "CNSS_MONTHLY"
    IRPP_MONTHLY = "IRPP_MONTHLY"
    DISA_ANNUAL = "DISA_ANNUAL"

class DeclarationStatus(str, Enum):
    DRAFT = "draft"
    GENERATED = "generated"
    SUBMITTED = "submitted"
    PENDING = "pending"

class SocialDeclarationGenerate(BaseModel):
    type: DeclarationType
    period: str = Field(..., description="Période (YYYY-MM pour mensuel, YYYY pour annuel)")
    force_regenerate: bool = Field(False, description="Forcer la régénération")

class CNSSDeclaration(BaseModel):
    total_employees: int
    total_salary: float
    total_cnss_employee: float
    total_cnss_employer: float
    employees_details: List[Dict[str, Any]]

class IRPPDeclaration(BaseModel):
    total_employees: int
    total_taxable_income: float
    total_irpp: float
    employees_details: List[Dict[str, Any]]

class DISADeclaration(BaseModel):
    total_employees: int
    total_annual_salary: float
    total_annual_cnss_employee: float
    total_annual_cnss_employer: float
    total_annual_irpp: float

class SocialDeclarationResponse(BaseModel):
    id: int
    type: str
    type_name: str
    period: str
    status: str
    due_date: str
    created_at: str
    
    # Champs optionnels selon le type
    total_employees: Optional[int] = None
    total_salary: Optional[float] = None
    total_cnss_employee: Optional[float] = None
    total_cnss_employer: Optional[float] = None
    total_taxable_income: Optional[float] = None
    total_irpp: Optional[float] = None
    total_annual_salary: Optional[float] = None

    class Config:
        from_attributes = True