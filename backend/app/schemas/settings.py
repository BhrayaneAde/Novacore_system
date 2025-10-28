from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from datetime import datetime

# Role Schemas
class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None
    permissions: Optional[Dict[str, Any]] = None

class RoleCreate(RoleBase):
    pass

class RoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    permissions: Optional[Dict[str, Any]] = None

class RoleResponse(RoleBase):
    id: int
    is_system_role: bool
    users_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

# Company Settings Schemas
class CompanySettingsBase(BaseModel):
    company_name: Optional[str] = None
    company_email: Optional[str] = None
    company_phone: Optional[str] = None
    company_address: Optional[str] = None
    company_logo: Optional[str] = None
    timezone: Optional[str] = "Europe/Paris"
    date_format: Optional[str] = "DD/MM/YYYY"
    currency: Optional[str] = "EUR"
    language: Optional[str] = "fr"

class CompanySettingsUpdate(CompanySettingsBase):
    pass

class CompanySettingsResponse(CompanySettingsBase):
    id: int
    company_id: int
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

# Security Settings Schemas
class SecuritySettingsBase(BaseModel):
    password_min_length: Optional[int] = 8
    password_require_uppercase: Optional[bool] = True
    password_require_lowercase: Optional[bool] = True
    password_require_numbers: Optional[bool] = True
    password_require_symbols: Optional[bool] = False
    password_expiry_days: Optional[int] = None
    max_login_attempts: Optional[int] = 5
    lockout_duration_minutes: Optional[int] = 30
    session_timeout_minutes: Optional[int] = 480
    two_factor_enabled: Optional[bool] = False
    ip_whitelist: Optional[List[str]] = None

class SecuritySettingsUpdate(SecuritySettingsBase):
    pass

class SecuritySettingsResponse(SecuritySettingsBase):
    id: int
    company_id: int
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

# Integration Schemas
class IntegrationBase(BaseModel):
    name: str
    type: str
    config: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = True

class IntegrationCreate(IntegrationBase):
    pass

class IntegrationUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class IntegrationResponse(IntegrationBase):
    id: int
    company_id: int
    status: str
    last_sync: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

# Notification Settings Schemas
class NotificationSettingsBase(BaseModel):
    email_notifications: Optional[bool] = True
    push_notifications: Optional[bool] = True
    sms_notifications: Optional[bool] = False
    notification_types: Optional[Dict[str, Any]] = None
    quiet_hours_start: Optional[str] = "22:00"
    quiet_hours_end: Optional[str] = "08:00"
    digest_frequency: Optional[str] = "daily"

class NotificationSettingsUpdate(NotificationSettingsBase):
    pass

class NotificationSettingsResponse(NotificationSettingsBase):
    id: int
    user_id: int
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

# Department Schemas
class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    manager_id: Optional[int] = None

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    manager_id: Optional[int] = None

class DepartmentResponse(DepartmentBase):
    id: int
    company_id: int
    manager_id: Optional[int] = None
    employees_count: int = 0

    model_config = {"from_attributes": True}