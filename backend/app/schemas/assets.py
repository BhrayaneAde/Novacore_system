from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

class AssetStatus(str, Enum):
    AVAILABLE = "Disponible"
    ASSIGNED = "Assigné"
    MAINTENANCE = "Maintenance"
    OUT_OF_SERVICE = "Hors service"

class AssetCondition(str, Enum):
    EXCELLENT = "Excellent"
    GOOD = "Bon"
    AVERAGE = "Moyen"
    REPAIR = "Réparation"

class AssetCategory(str, Enum):
    COMPUTER = "Ordinateur"
    PHONE = "Téléphone"
    PRINTER = "Imprimante"
    MONITOR = "Moniteur"
    FURNITURE = "Mobilier"
    ACCESSORY = "Accessoire"

class AssetTagBase(BaseModel):
    tag_name: str

class AssetTagCreate(AssetTagBase):
    pass

class AssetTag(AssetTagBase):
    id: int
    asset_id: int
    
    model_config = {"from_attributes": True}

class AssetHistoryBase(BaseModel):
    action: str
    location: Optional[str] = None
    notes: Optional[str] = None

class AssetHistoryCreate(AssetHistoryBase):
    employee_id: Optional[int] = None

class AssetHistory(AssetHistoryBase):
    id: int
    asset_id: int
    employee_id: Optional[int] = None
    created_at: datetime
    
    model_config = {"from_attributes": True}

class AssetBase(BaseModel):
    name: str
    category: AssetCategory
    brand: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    purchase_date: Optional[date] = None
    warranty_end: Optional[date] = None
    location: Optional[str] = None
    value: Optional[float] = None
    description: Optional[str] = None

class AssetCreate(AssetBase):
    tags: Optional[List[str]] = []

class AssetUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[AssetCategory] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    purchase_date: Optional[date] = None
    warranty_end: Optional[date] = None
    status: Optional[AssetStatus] = None
    condition: Optional[AssetCondition] = None
    location: Optional[str] = None
    value: Optional[float] = None
    description: Optional[str] = None
    assigned_to_id: Optional[int] = None
    tags: Optional[List[str]] = None

class Asset(AssetBase):
    id: int
    asset_id: str
    status: AssetStatus
    condition: AssetCondition
    company_id: int
    assigned_to_id: Optional[int] = None
    assigned_to: Optional[dict] = None
    tags: List[AssetTag] = []
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}

class AssetWithHistory(Asset):
    asset_history: List[AssetHistory] = []

# Legacy schemas for compatibility
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