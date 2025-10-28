from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_
from ..db.models import Role, CompanySettings, SecuritySettings, Integration, UserNotificationSettings, User, Department, Employee
from ..schemas.settings import (
    RoleCreate, RoleUpdate, CompanySettingsUpdate, SecuritySettingsUpdate,
    IntegrationCreate, IntegrationUpdate, NotificationSettingsUpdate,
    DepartmentCreate, DepartmentUpdate
)

class CRUDSettings:
    # Role Management
    def get_roles(self, db: Session) -> List[Role]:
        return db.query(Role).all()
    
    def get_role(self, db: Session, role_id: int) -> Optional[Role]:
        return db.query(Role).filter(Role.id == role_id).first()
    
    def create_role(self, db: Session, role: RoleCreate) -> Role:
        db_role = Role(**role.dict())
        db.add(db_role)
        db.commit()
        db.refresh(db_role)
        return db_role
    
    def update_role(self, db: Session, role_id: int, role_update: RoleUpdate) -> Optional[Role]:
        db_role = self.get_role(db, role_id)
        if not db_role or db_role.is_system_role:
            return None
        
        update_data = role_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_role, field, value)
        
        db.commit()
        db.refresh(db_role)
        return db_role
    
    def delete_role(self, db: Session, role_id: int) -> bool:
        db_role = self.get_role(db, role_id)
        if not db_role or db_role.is_system_role:
            return False
        
        # Check if role is in use
        users_count = db.query(User).filter(User.role == db_role.name).count()
        if users_count > 0:
            return False
        
        db.delete(db_role)
        db.commit()
        return True
    
    # Company Settings
    def get_company_settings(self, db: Session, company_id: int) -> Optional[CompanySettings]:
        return db.query(CompanySettings).filter(CompanySettings.company_id == company_id).first()
    
    def update_company_settings(self, db: Session, company_id: int, settings: CompanySettingsUpdate) -> CompanySettings:
        db_settings = self.get_company_settings(db, company_id)
        
        if not db_settings:
            db_settings = CompanySettings(company_id=company_id)
            db.add(db_settings)
        
        update_data = settings.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_settings, field, value)
        
        db.commit()
        db.refresh(db_settings)
        return db_settings
    
    # Security Settings
    def get_security_settings(self, db: Session, company_id: int) -> Optional[SecuritySettings]:
        return db.query(SecuritySettings).filter(SecuritySettings.company_id == company_id).first()
    
    def update_security_settings(self, db: Session, company_id: int, settings: SecuritySettingsUpdate) -> SecuritySettings:
        db_settings = self.get_security_settings(db, company_id)
        
        if not db_settings:
            db_settings = SecuritySettings(company_id=company_id)
            db.add(db_settings)
        
        update_data = settings.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_settings, field, value)
        
        db.commit()
        db.refresh(db_settings)
        return db_settings
    
    # Integrations
    def get_integrations(self, db: Session, company_id: int) -> List[Integration]:
        return db.query(Integration).filter(Integration.company_id == company_id).all()
    
    def get_integration(self, db: Session, integration_id: int) -> Optional[Integration]:
        return db.query(Integration).filter(Integration.id == integration_id).first()
    
    def create_integration(self, db: Session, company_id: int, integration: IntegrationCreate) -> Integration:
        db_integration = Integration(**integration.dict(), company_id=company_id)
        db.add(db_integration)
        db.commit()
        db.refresh(db_integration)
        return db_integration
    
    def update_integration(self, db: Session, integration_id: int, integration_update: IntegrationUpdate) -> Optional[Integration]:
        db_integration = self.get_integration(db, integration_id)
        if not db_integration:
            return None
        
        update_data = integration_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_integration, field, value)
        
        db.commit()
        db.refresh(db_integration)
        return db_integration
    
    def delete_integration(self, db: Session, integration_id: int) -> bool:
        db_integration = self.get_integration(db, integration_id)
        if not db_integration:
            return False
        
        db.delete(db_integration)
        db.commit()
        return True
    
    # Notification Settings
    def get_notification_settings(self, db: Session, user_id: int) -> Optional[UserNotificationSettings]:
        return db.query(UserNotificationSettings).filter(UserNotificationSettings.user_id == user_id).first()
    
    def update_notification_settings(self, db: Session, user_id: int, settings: NotificationSettingsUpdate) -> UserNotificationSettings:
        db_settings = self.get_notification_settings(db, user_id)
        
        if not db_settings:
            db_settings = UserNotificationSettings(user_id=user_id)
            db.add(db_settings)
        
        update_data = settings.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_settings, field, value)
        
        db.commit()
        db.refresh(db_settings)
        return db_settings
    
    # Departments
    def get_departments(self, db: Session, company_id: int) -> List[Department]:
        return db.query(Department).filter(Department.company_id == company_id).all()
    
    def get_department(self, db: Session, department_id: int) -> Optional[Department]:
        return db.query(Department).filter(Department.id == department_id).first()
    
    def create_department(self, db: Session, company_id: int, department: DepartmentCreate) -> Department:
        db_department = Department(**department.dict(), company_id=company_id)
        db.add(db_department)
        db.commit()
        db.refresh(db_department)
        return db_department
    
    def update_department(self, db: Session, department_id: int, department_update: DepartmentUpdate) -> Optional[Department]:
        db_department = self.get_department(db, department_id)
        if not db_department:
            return None
        
        update_data = department_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_department, field, value)
        
        db.commit()
        db.refresh(db_department)
        return db_department
    
    def delete_department(self, db: Session, department_id: int) -> bool:
        db_department = self.get_department(db, department_id)
        if not db_department:
            return False
        
        # Check if department has employees
        employees_count = db.query(Employee).filter(Employee.department_id == department_id).count()
        if employees_count > 0:
            return False
        
        db.delete(db_department)
        db.commit()
        return True

crud_settings = CRUDSettings()