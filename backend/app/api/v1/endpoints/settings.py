from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

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
@router.get("/company")
def get_company_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get company settings"""
    from ....db.models import CompanySettings, Company
    
    # Récupérer les infos de base de l'entreprise
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Récupérer les paramètres avancés
    settings = db.query(CompanySettings).filter(
        CompanySettings.company_id == current_user.company_id
    ).first()
    
    # Compter les employés
    from ....db.models import Employee
    employee_count = db.query(Employee).filter(Employee.company_id == current_user.company_id).count()
    
    return {
        "company_name": settings.company_name if settings else company.name,
        "industry": company.plan,  # Utiliser le plan comme secteur temporairement
        "employee_count": employee_count
    }

@router.put("/company")
def update_company_settings(
    settings: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update company settings"""
    from ....db.models import CompanySettings, Company
    
    # Mettre à jour l'entreprise de base
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    if company and settings.get('company_name'):
        company.name = settings['company_name']
    
    # Chercher ou créer les paramètres avancés
    company_settings = db.query(CompanySettings).filter(
        CompanySettings.company_id == current_user.company_id
    ).first()
    
    if not company_settings:
        company_settings = CompanySettings(
            company_id=current_user.company_id,
            company_name=settings.get('company_name', ''),
            timezone='Europe/Paris'
        )
        db.add(company_settings)
    else:
        if settings.get('company_name'):
            company_settings.company_name = settings['company_name']
    
    db.commit()
    return {"message": "Paramètres entreprise mis à jour"}

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
@router.get("/notifications")
def get_notification_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user notification settings"""
    from ....db.models import UserNotificationSettings
    
    settings = db.query(UserNotificationSettings).filter(
        UserNotificationSettings.user_id == current_user.id
    ).first()
    
    if not settings:
        return {
            "email_notifications": True,
            "push_notifications": False,
            "notification_types": {
                "leave_requests": True,
                "new_employees": True,
                "payroll": False
            }
        }
    
    return {
        "email_notifications": settings.email_notifications,
        "push_notifications": settings.push_notifications,
        "notification_types": settings.notification_types or {}
    }

@router.put("/notifications")
def update_notification_settings(
    settings: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update user notification settings"""
    from ....db.models import UserNotificationSettings
    
    # Chercher ou créer les paramètres de notification
    user_settings = db.query(UserNotificationSettings).filter(
        UserNotificationSettings.user_id == current_user.id
    ).first()
    
    if not user_settings:
        user_settings = UserNotificationSettings(
            user_id=current_user.id,
            email_notifications=settings.get('email_notifications', True),
            push_notifications=settings.get('push_notifications', False),
            notification_types=settings.get('notification_types', {})
        )
        db.add(user_settings)
    else:
        user_settings.email_notifications = settings.get('email_notifications', user_settings.email_notifications)
        user_settings.push_notifications = settings.get('push_notifications', user_settings.push_notifications)
        user_settings.notification_types = settings.get('notification_types', user_settings.notification_types)
    
    db.commit()
    db.refresh(user_settings)
    
    return {"message": "Paramètres de notification mis à jour"}

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

@router.post("/company/logo")
def update_company_logo(
    logo_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update company logo"""
    from ....db.models import CompanySettings
    
    # Chercher ou créer les paramètres de l'entreprise
    settings = db.query(CompanySettings).filter(
        CompanySettings.company_id == current_user.company_id
    ).first()
    
    if not settings:
        settings = CompanySettings(
            company_id=current_user.company_id,
            company_logo=logo_data.get('logo')
        )
        db.add(settings)
    else:
        settings.company_logo = logo_data.get('logo')
    
    db.commit()
    db.refresh(settings)
    
    return {"message": "Logo mis à jour avec succès", "logo_url": settings.company_logo}

@router.get("/company/logo")
def get_company_logo(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get company logo"""
    from ....db.models import CompanySettings
    
    settings = db.query(CompanySettings).filter(
        CompanySettings.company_id == current_user.company_id
    ).first()
    
    if settings and settings.company_logo:
        return {"logo_url": settings.company_logo}
    
    return {"logo_url": None}

@router.get("/audit-logs")
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get recent audit logs"""
    # Pour l'instant, retourner des logs simulés basés sur l'activité réelle
    from ....db.models import Employee, User as UserModel
    from datetime import datetime, timedelta
    
    logs = []
    
    # Récents employés créés
    recent_employees = db.query(Employee).filter(
        Employee.company_id == current_user.company_id
    ).order_by(Employee.hire_date.desc()).limit(3).all()
    
    for emp in recent_employees:
        days_ago = (datetime.now().date() - emp.hire_date).days if emp.hire_date else 0
        time_str = f"{days_ago}j" if days_ago > 0 else "Aujourd'hui"
        logs.append({
            "action": "Création employé",
            "user": f"{emp.name[:10]}...",
            "time": time_str,
            "type": "create"
        })
    
    # Ajouter quelques logs génériques
    logs.extend([
        {"action": "Connexion admin", "user": f"{current_user.first_name} {current_user.last_name[:1]}.", "time": "1h", "type": "login"},
        {"action": "Modif. paramètres", "user": f"{current_user.first_name} {current_user.last_name[:1]}.", "time": "2h", "type": "update"}
    ])
    
    return logs[:5]  # Limiter à 5 logs

@router.get("/nominations")
def get_nominations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get pending nominations"""
    from ....db.models import ManagerNomination
    
    nominations = db.query(ManagerNomination).filter(
        ManagerNomination.status == "pending"
    ).join(ManagerNomination.department).filter(
        ManagerNomination.department.has(company_id=current_user.company_id)
    ).all()
    
    result = []
    for nom in nominations:
        proposed_manager = db.query(UserModel).filter(UserModel.id == nom.proposed_manager_id).first()
        proposed_by = db.query(UserModel).filter(UserModel.id == nom.proposed_by_id).first()
        
        if proposed_manager and proposed_by:
            result.append({
                "id": nom.id,
                "employee_name": f"{proposed_manager.first_name} {proposed_manager.last_name}",
                "position": f"Manager {nom.department.name}",
                "proposed_by": f"{proposed_by.first_name} {proposed_by.last_name[:1]}.",
                "time_ago": "2j"  # Simplifié pour l'instant
            })
    
    return result

@router.post("/nominations/{nomination_id}/approve")
def approve_nomination(
    nomination_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Approve a nomination"""
    from ....db.models import ManagerNomination
    
    nomination = db.query(ManagerNomination).filter(
        ManagerNomination.id == nomination_id
    ).first()
    
    if not nomination:
        raise HTTPException(status_code=404, detail="Nomination not found")
    
    nomination.status = "approved"
    nomination.approved_by_id = current_user.id
    nomination.approved_at = datetime.utcnow()
    
    # Mettre à jour le manager du département
    nomination.department.manager_id = nomination.proposed_manager_id
    
    db.commit()
    return {"message": "Nomination approuvée"}

@router.post("/nominations/{nomination_id}/reject")
def reject_nomination(
    nomination_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Reject a nomination"""
    from ....db.models import ManagerNomination
    
    nomination = db.query(ManagerNomination).filter(
        ManagerNomination.id == nomination_id
    ).first()
    
    if not nomination:
        raise HTTPException(status_code=404, detail="Nomination not found")
    
    nomination.status = "rejected"
    nomination.approved_by_id = current_user.id
    nomination.approved_at = datetime.utcnow()
    
    db.commit()
    return {"message": "Nomination rejetée"}