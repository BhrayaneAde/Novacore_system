from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ....db.database import get_db
from ....crud.crud_settings import crud_settings
from ....schemas.settings import (
    RoleCreate, RoleUpdate, RoleResponse, CompanySettingsUpdate, CompanySettingsResponse,
    SecuritySettingsUpdate, SecuritySettingsResponse, IntegrationCreate, IntegrationUpdate, 
    IntegrationResponse, NotificationSettingsUpdate, NotificationSettingsResponse,
    DepartmentCreate, DepartmentUpdate, DepartmentResponse
)
from ....core.auth import get_current_user
from ....db.models import User

router = APIRouter()

# Roles Management
@router.get("/roles", response_model=List[RoleResponse])
def get_roles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all roles"""
    roles = crud_settings.get_roles(db)
    return [
        RoleResponse(
            **role.__dict__,
            users_count=len([u for u in role.users]) if hasattr(role, 'users') else 0
        ) for role in roles
    ]

@router.post("/roles", response_model=RoleResponse)
def create_role(
    role: RoleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new role"""
    db_role = crud_settings.create_role(db, role)
    return RoleResponse(**db_role.__dict__, users_count=0)

@router.put("/roles/{role_id}", response_model=RoleResponse)
def update_role(
    role_id: int,
    role_update: RoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update role"""
    db_role = crud_settings.update_role(db, role_id, role_update)
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found or is system role")
    
    return RoleResponse(
        **db_role.__dict__,
        users_count=len([u for u in db_role.users]) if hasattr(db_role, 'users') else 0
    )

@router.delete("/roles/{role_id}")
def delete_role(
    role_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete role"""
    success = crud_settings.delete_role(db, role_id)
    if not success:
        raise HTTPException(status_code=400, detail="Cannot delete role - it's in use or is system role")
    
    return {"message": "Role deleted successfully"}

# Company Settings
@router.get("/company", response_model=CompanySettingsResponse)
def get_company_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get company settings"""
    settings = crud_settings.get_company_settings(db, current_user.company_id)
    if not settings:
        raise HTTPException(status_code=404, detail="Company settings not found")
    
    return settings

@router.put("/company", response_model=CompanySettingsResponse)
def update_company_settings(
    settings: CompanySettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update company settings"""
    db_settings = crud_settings.update_company_settings(db, current_user.company_id, settings)
    return db_settings

# Security Settings
@router.get("/security", response_model=SecuritySettingsResponse)
def get_security_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get security settings"""
    settings = crud_settings.get_security_settings(db, current_user.company_id)
    if not settings:
        raise HTTPException(status_code=404, detail="Security settings not found")
    
    return settings

@router.put("/security", response_model=SecuritySettingsResponse)
def update_security_settings(
    settings: SecuritySettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update security settings"""
    db_settings = crud_settings.update_security_settings(db, current_user.company_id, settings)
    return db_settings

# Integrations
@router.get("/integrations", response_model=List[IntegrationResponse])
def get_integrations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all integrations"""
    return crud_settings.get_integrations(db, current_user.company_id)

@router.post("/integrations", response_model=IntegrationResponse)
def create_integration(
    integration: IntegrationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new integration"""
    return crud_settings.create_integration(db, current_user.company_id, integration)

@router.put("/integrations/{integration_id}", response_model=IntegrationResponse)
def update_integration(
    integration_id: int,
    integration_update: IntegrationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update integration"""
    db_integration = crud_settings.update_integration(db, integration_id, integration_update)
    if not db_integration:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    return db_integration

@router.delete("/integrations/{integration_id}")
def delete_integration(
    integration_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete integration"""
    success = crud_settings.delete_integration(db, integration_id)
    if not success:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    return {"message": "Integration deleted successfully"}

# Notification Settings
@router.get("/notifications", response_model=NotificationSettingsResponse)
def get_notification_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user notification settings"""
    settings = crud_settings.get_notification_settings(db, current_user.id)
    if not settings:
        # Return default settings
        from ....schemas.settings import NotificationSettingsBase
        default_settings = NotificationSettingsBase()
        return NotificationSettingsResponse(
            id=0,
            user_id=current_user.id,
            **default_settings.dict(),
            updated_at=None
        )
    
    return settings

@router.put("/notifications", response_model=NotificationSettingsResponse)
def update_notification_settings(
    settings: NotificationSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update user notification settings"""
    db_settings = crud_settings.update_notification_settings(db, current_user.id, settings)
    return db_settings

# Departments Management
@router.get("/departments", response_model=List[DepartmentResponse])
def get_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all departments for company"""
    return crud_settings.get_departments(db, current_user.company_id)

@router.post("/departments", response_model=DepartmentResponse)
def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new department"""
    return crud_settings.create_department(db, current_user.company_id, department)

@router.put("/departments/{department_id}", response_model=DepartmentResponse)
def update_department(
    department_id: int,
    department_update: DepartmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update department"""
    db_department = crud_settings.update_department(db, department_id, department_update)
    if not db_department:
        raise HTTPException(status_code=404, detail="Department not found")
    
    return db_department

@router.delete("/departments/{department_id}")
def delete_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete department"""
    success = crud_settings.delete_department(db, department_id)
    if not success:
        raise HTTPException(status_code=404, detail="Department not found or has employees")
    
    return {"message": "Department deleted successfully"}

# SMTP Settings
@router.get("/smtp")
def get_smtp_config(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get SMTP configuration"""
    return {
        "host": "smtp.gmail.com",
        "port": 587,
        "username": "",
        "password": "",
        "use_tls": True
    }

@router.put("/smtp")
def update_smtp_config(
    config: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update SMTP configuration"""
    return config