from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum

class IntegrationType(str, Enum):
    PAYROLL = "payroll"
    CALENDAR = "calendar"
    RECRUITMENT = "recruitment"
    TIME_TRACKING = "time_tracking"
    EMAIL = "email"
    STORAGE = "storage"

class IntegrationStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ERROR = "error"
    SYNCING = "syncing"

# External Integration schemas
class ExternalIntegrationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: IntegrationType
    provider: str = Field(..., description="Provider name (sage, google, outlook, etc.)")
    config: Dict[str, Any] = Field(default_factory=dict)
    is_active: bool = True
    sync_frequency: Optional[str] = "daily"  # hourly, daily, weekly, manual

class ExternalIntegrationCreate(ExternalIntegrationBase):
    pass

class ExternalIntegrationUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    config: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    sync_frequency: Optional[str] = None

class ExternalIntegrationResponse(ExternalIntegrationBase):
    id: int
    status: IntegrationStatus = IntegrationStatus.INACTIVE
    last_sync: Optional[datetime] = None
    last_error: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    company_id: int

    class Config:
        from_attributes = True

# Sync Log schemas
class SyncLogResponse(BaseModel):
    id: int
    integration_id: int
    status: str
    records_processed: int = 0
    records_success: int = 0
    records_failed: int = 0
    error_message: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    duration_seconds: Optional[float] = None

    class Config:
        from_attributes = True

# Predefined integration configs
INTEGRATION_CONFIGS = {
    "sage": {
        "type": "payroll",
        "fields": {
            "api_url": {"type": "url", "required": True, "label": "URL API Sage"},
            "username": {"type": "text", "required": True, "label": "Nom d'utilisateur"},
            "password": {"type": "password", "required": True, "label": "Mot de passe"},
            "company_code": {"type": "text", "required": True, "label": "Code entreprise"}
        }
    },
    "google_calendar": {
        "type": "calendar",
        "fields": {
            "client_id": {"type": "text", "required": True, "label": "Client ID Google"},
            "client_secret": {"type": "password", "required": True, "label": "Client Secret"},
            "calendar_id": {"type": "text", "required": False, "label": "ID Calendrier (optionnel)"}
        }
    },
    "outlook": {
        "type": "calendar",
        "fields": {
            "tenant_id": {"type": "text", "required": True, "label": "Tenant ID"},
            "client_id": {"type": "text", "required": True, "label": "Client ID"},
            "client_secret": {"type": "password", "required": True, "label": "Client Secret"}
        }
    },
    "linkedin": {
        "type": "recruitment",
        "fields": {
            "client_id": {"type": "text", "required": True, "label": "LinkedIn Client ID"},
            "client_secret": {"type": "password", "required": True, "label": "Client Secret"},
            "company_id": {"type": "text", "required": True, "label": "LinkedIn Company ID"}
        }
    }
}