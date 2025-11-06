from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class AccountingEntryStatus(str, Enum):
    DRAFT = "draft"
    VALIDATED = "validated"
    POSTED = "posted"
    ERROR = "error"

class AccountingEntriesGenerate(BaseModel):
    period: str = Field(..., description="Période au format YYYY-MM")
    force_regenerate: bool = Field(False, description="Forcer la régénération")

class AccountingEntryCreate(BaseModel):
    account: str = Field(..., description="Numéro de compte comptable")
    account_name: str = Field(..., description="Libellé du compte")
    debit: float = Field(0, description="Montant au débit")
    credit: float = Field(0, description="Montant au crédit")
    description: str = Field(..., description="Description de l'écriture")
    period: str = Field(..., description="Période comptable")

class AccountingEntryResponse(BaseModel):
    id: int
    account: str
    account_name: str
    debit: float
    credit: float
    description: str
    period: str
    status: str
    created_at: str

    class Config:
        from_attributes = True

class AccountingEntriesResponse(BaseModel):
    success: bool
    entries_count: int
    entries: List[Dict[str, Any]]
    period: str

class AccountingSummary(BaseModel):
    total_salaries: float
    total_charges: float
    total_net: float
    entries_count: int
    period: str

class AccountingValidation(BaseModel):
    entry_id: int
    validated_by: str
    validated_at: datetime

class ChartOfAccount(BaseModel):
    account: str
    name: str
    account_type: Optional[str] = None
    parent_account: Optional[str] = None