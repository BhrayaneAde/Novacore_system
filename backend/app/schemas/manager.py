from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.db.models import NominationStatusEnum

class ManagerNominationBase(BaseModel):
    reason: Optional[str] = None
    comments: Optional[str] = None

class ManagerNominationCreate(ManagerNominationBase):
    proposed_manager_id: int
    department_id: int
    proposed_by_id: int

class ManagerNominationUpdate(BaseModel):
    status: Optional[NominationStatusEnum] = None
    comments: Optional[str] = None

class ManagerNomination(ManagerNominationBase):
    id: int
    proposed_manager_id: int
    department_id: int
    proposed_by_id: int
    approved_by_id: Optional[int] = None
    status: NominationStatusEnum
    proposed_at: datetime
    approved_at: Optional[datetime] = None

    model_config = {"from_attributes": True}