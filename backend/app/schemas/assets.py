from pydantic import BaseModel
from typing import Optional
from datetime import date

class CompanyAssetBase(BaseModel):
    name: str
    category: Optional[str] = None
    serial_number: Optional[str] = None
    purchase_date: Optional[date] = None
    purchase_price: Optional[float] = None
    condition: Optional[str] = None

class CompanyAssetCreate(CompanyAssetBase):
    company_id: int

class CompanyAssetUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to_id: Optional[int] = None
    condition: Optional[str] = None

class CompanyAsset(CompanyAssetBase):
    id: int
    company_id: int
    status: str
    assigned_to_id: Optional[int] = None

    model_config = {"from_attributes": True}