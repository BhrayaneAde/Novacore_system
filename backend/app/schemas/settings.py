from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List

class SMTPSettings(BaseModel):
    enabled: bool = False
    host: str = ""
    port: int = 587
    secure: bool = False
    auth_user: str = ""
    auth_pass: str = ""
    from_name: str = ""
    from_email: str = ""

class LeavePolicy(BaseModel):
    annual_leave_days: int = 25
    carry_over_days: int = 5
    sick_leave_days: int = 10
    requires_certificate_days: int = 3
    advance_notice_days: int = 15

class WorkSchedule(BaseModel):
    hours_per_week: int = 35
    hours_per_day: int = 7
    work_days: List[str] = ["monday", "tuesday", "wednesday", "thursday", "friday"]
    flex_time_enabled: bool = True
    core_hours_start: str = "10:00"
    core_hours_end: str = "16:00"

class SecuritySettings(BaseModel):
    password_min_length: int = 8
    require_uppercase: bool = True
    require_numbers: bool = True
    session_timeout_minutes: int = 480
    two_factor_enabled: bool = False

class AppearanceSettings(BaseModel):
    dark_mode: bool = False
    primary_color: str = "#3B82F6"
    secondary_color: str = "#1E40AF"
    company_name: str = ""
    logo_url: str = ""