import enum
from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Boolean, Date, DateTime, Float, Enum as SAEnum,
    Text, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from .database import Base

# --- Enums ---
class RoleEnum(str, enum.Enum):
    employer = "employer"
    hr_admin = "hr_admin"
    hr_user = "hr_user"
    manager = "manager"
    employee = "employee"

class TaskStatusEnum(str, enum.Enum):
    todo = "todo"
    in_progress = "in_progress"
    in_review = "in_review"
    completed = "completed"
    cancelled = "cancelled"

class TaskPriorityEnum(str, enum.Enum):
    urgent = "urgent"
    important = "important"
    normal = "normal"
    low = "low"

class LeaveStatusEnum(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class NominationStatusEnum(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    cancelled = "cancelled"


# --- Tables Principales ---

class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True)
    plan = Column(String(50))
    max_employees = Column(Integer, default=-1)
    created_date = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Paramètres stockés en JSON
    settings_smtp = Column(JSON)
    settings_leave_policy = Column(JSON)
    settings_work_schedule = Column(JSON)
    settings_security = Column(JSON)
    settings_appearance = Column(JSON)
    
    # Google Drive configuration per company
    google_drive_config = Column(JSON)  # {"credentials": {...}, "folder_id": "...", "is_active": true}
    
    users = relationship("User", back_populates="company")
    employees = relationship("Employee", back_populates="company")
    departments = relationship("Department", back_populates="company")
    invitations = relationship("Invitation", back_populates="company")
    candidates = relationship("Candidate", back_populates="company")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(50))
    last_name = Column(String(50))
    role = Column(SAEnum(RoleEnum), nullable=False)
    avatar = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_date = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)
    
    company_id = Column(Integer, ForeignKey("companies.id"))
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True) # Lien optionnel
    
    company = relationship("Company", back_populates="users")
    employee = relationship("Employee", back_populates="user", foreign_keys="[User.employee_id]")
    
    # Pour les managers
    managed_departments = relationship("Department", back_populates="manager")
    assigned_tasks = relationship("Task", back_populates="assigned_by")
    proposed_nominations = relationship("ManagerNomination", foreign_keys="[ManagerNomination.proposed_by_id]")
    approved_nominations = relationship("ManagerNomination", foreign_keys="[ManagerNomination.approved_by_id]")

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    
    company_id = Column(Integer, ForeignKey("companies.id"))
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Manager est un User
    
    company = relationship("Company", back_populates="departments")
    manager = relationship("User", back_populates="managed_departments")
    employees = relationship("Employee", back_populates="department")
    candidates = relationship("Candidate", back_populates="department")

class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    role = Column(String(100)) # "role" est le "jobTitle" ici
    status = Column(String(50), default="active")
    avatar = Column(String(255))
    hire_date = Column(Date)
    salary = Column(Float)
    phone = Column(String(50))
    birth_date = Column(Date)
    address = Column(String(255))
    city = Column(String(100))
    postal_code = Column(String(20))
    social_security_number = Column(String(100))
    iban = Column(String(100))
    emergency_contact = Column(String(100))
    emergency_phone = Column(String(50))
    marital_status = Column(String(50))
    
    company_id = Column(Integer, ForeignKey("companies.id"))
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Manager est un User
    
    user = relationship("User", back_populates="employee", uselist=False, foreign_keys="[User.employee_id]")
    company = relationship("Company", back_populates="employees")
    department = relationship("Department", back_populates="employees")
    # manager = relationship("User", foreign_keys=[manager_id]) # Géré par la relation User
    
    documents = relationship("EmployeeDocument", back_populates="employee")
    tasks = relationship("Task", back_populates="assigned_to")
    leave_requests = relationship("LeaveRequest", back_populates="employee")
    evaluations = relationship("Evaluation", back_populates="employee")
    generated_contracts = relationship("GeneratedContract", back_populates="employee")
    assigned_assets = relationship("Asset", back_populates="assigned_to")

class EmployeeDocument(Base):
    __tablename__ = "employee_documents"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    type = Column(String(50))
    upload_date = Column(Date)
    url = Column(String(255)) # Lien vers le stockage (ex: S3)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    
    employee = relationship("Employee", back_populates="documents")

# --- Modules Spécifiques ---

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    priority = Column(SAEnum(TaskPriorityEnum), default=TaskPriorityEnum.normal)
    status = Column(SAEnum(TaskStatusEnum), default=TaskStatusEnum.todo)
    due_date = Column(DateTime)
    estimated_hours = Column(Float)
    actual_hours = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    assigned_to_id = Column(Integer, ForeignKey("employees.id"))
    assigned_by_id = Column(Integer, ForeignKey("users.id"))
    department_id = Column(Integer, ForeignKey("departments.id"))
    
    assigned_to = relationship("Employee", back_populates="tasks")
    assigned_by = relationship("User", back_populates="assigned_tasks")
    # department = relationship("Department") # Moins crucial

class LeaveRequest(Base):
    __tablename__ = "leave_requests"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50)) # 'vacation', 'sick', etc.
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    days = Column(Float)
    status = Column(SAEnum(LeaveStatusEnum), default=LeaveStatusEnum.pending)
    reason = Column(Text)
    request_date = Column(Date, default=datetime.utcnow)
    
    employee_id = Column(Integer, ForeignKey("employees.id"))
    employee = relationship("Employee", back_populates="leave_requests")

class Evaluation(Base):
    __tablename__ = "evaluations"
    id = Column(Integer, primary_key=True, index=True)
    period = Column(String(50)) # ex: "2025-01"
    global_score = Column(Float)
    manager_comments = Column(Text)
    strengths = Column(JSON) # Stocke la liste
    improvements = Column(JSON) # Stocke la liste
    next_objectives = Column(JSON) # Stocke la liste
    automatic_metrics = Column(JSON)
    manual_evaluation = Column(JSON)
    
    employee_id = Column(Integer, ForeignKey("employees.id"))
    manager_id = Column(Integer, ForeignKey("users.id"))
    
    employee = relationship("Employee", back_populates="evaluations")
    manager = relationship("User", foreign_keys=[manager_id])

class ManagerNomination(Base):
    __tablename__ = "manager_nominations"
    id = Column(Integer, primary_key=True, index=True)
    status = Column(SAEnum(NominationStatusEnum), default=NominationStatusEnum.pending)
    reason = Column(Text)
    comments = Column(Text)
    proposed_at = Column(DateTime, default=datetime.utcnow)
    approved_at = Column(DateTime, nullable=True)
    
    proposed_manager_id = Column(Integer, ForeignKey("users.id")) # Le User proposé
    department_id = Column(Integer, ForeignKey("departments.id"))
    proposed_by_id = Column(Integer, ForeignKey("users.id")) # Le User qui propose
    approved_by_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Le User qui approuve
    
    proposed_manager = relationship("User", foreign_keys=[proposed_manager_id])
    department = relationship("Department")
    proposed_by = relationship("User", foreign_keys=[proposed_by_id], overlaps="proposed_nominations")
    approved_by = relationship("User", foreign_keys=[approved_by_id], overlaps="approved_nominations")

class ContractTemplate(Base):
    __tablename__ = "contract_templates"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    type = Column(String(50))
    category = Column(String(50))
    content = Column(Text)
    variables = Column(JSON) # Liste des variables {key, label, type}

class GeneratedContract(Base):
    __tablename__ = "generated_contracts"
    id = Column(Integer, primary_key=True, index=True)
    status = Column(String(50), default="draft") # draft, sent, signed
    created_date = Column(Date, default=datetime.utcnow)
    variables_values = Column(JSON) # Dictionnaire {key: value}
    
    template_id = Column(Integer, ForeignKey("contract_templates.id"))
    employee_id = Column(Integer, ForeignKey("employees.id"))
    created_by_id = Column(Integer, ForeignKey("users.id"))
    
    template = relationship("ContractTemplate")
    employee = relationship("Employee", back_populates="generated_contracts")
    created_by = relationship("User")

class JobOpening(Base):
    __tablename__ = "job_openings"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    department = Column(String(100))
    location = Column(String(255))
    type = Column(String(50))  # CDI, CDD, etc.
    status = Column(String(50), default="open")
    description = Column(Text)
    requirements = Column(Text)
    posted_date = Column(Date, default=datetime.utcnow)
    
    # Surveillance email automatique
    email_keywords = Column(JSON)  # ["candidature RH", "poste ressources humaines"]
    auto_screening_enabled = Column(Boolean, default=True)
    screening_criteria = Column(JSON)  # Critères de tri automatique
    candidates_count = Column(Integer, default=0)  # Compteur de candidatures
    
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_by_id = Column(Integer, ForeignKey("users.id"))
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    
    company = relationship("Company")
    created_by = relationship("User")
    department_obj = relationship("Department")
    candidates = relationship("Candidate", back_populates="job_opening")

class CandidateStatus(str, enum.Enum):
    nouveau = "nouveau"
    en_cours = "en_cours"
    entretien = "entretien"
    accepte = "accepte"
    rejete = "rejete"

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    position = Column(String(255), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    
    # Email data
    email_subject = Column(String(500), nullable=False)
    email_content = Column(Text, nullable=True)
    cv_filename = Column(String(255), nullable=True)
    cv_content = Column(Text, nullable=True)  # Base64 encoded
    
    # Status and tracking
    status = Column(SAEnum(CandidateStatus), default=CandidateStatus.nouveau)
    notes = Column(Text, nullable=True)
    received_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Legacy fields for compatibility
    applied_date = Column(Date, default=datetime.utcnow)
    experience = Column(String(100))
    avatar = Column(String(255))
    cv_url = Column(String(255))
    job_opening_id = Column(Integer, ForeignKey("job_openings.id"), nullable=True)
    
    # Relations
    department = relationship("Department")
    company = relationship("Company")
    job_opening = relationship("JobOpening", back_populates="candidates")

class PayrollRecord(Base):
    __tablename__ = "payroll_records"
    id = Column(Integer, primary_key=True, index=True)
    month = Column(String(50), nullable=False)
    base_salary = Column(Float)
    bonus = Column(Float, default=0)
    deductions = Column(Float, default=0)
    net_salary = Column(Float)
    status = Column(String(50), default="pending")
    processed_date = Column(Date)
    
    employee_id = Column(Integer, ForeignKey("employees.id"))
    processed_by_id = Column(Integer, ForeignKey("users.id"))
    
    employee = relationship("Employee")
    processed_by = relationship("User")

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    status = Column(String(50))  # present, absent, remote, leave
    check_in = Column(String(10))
    check_out = Column(String(10))
    break_duration = Column(Integer, default=0)
    total_hours = Column(Float)
    
    employee_id = Column(Integer, ForeignKey("employees.id"))
    
    employee = relationship("Employee")

class TimeEntry(Base):
    __tablename__ = "time_entries"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    start_time = Column(String(10))
    end_time = Column(String(10))
    break_duration = Column(Integer, default=0)
    total_hours = Column(Float)
    project = Column(String(255))
    description = Column(Text)
    status = Column(String(50), default="pending")
    
    employee_id = Column(Integer, ForeignKey("employees.id"))
    approved_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    employee = relationship("Employee")
    approved_by = relationship("User")

class Goal(Base):
    __tablename__ = "goals"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(50))
    priority = Column(String(50))
    start_date = Column(Date)
    due_date = Column(Date)
    progress = Column(Integer, default=0)
    status = Column(String(50), default="active")
    
    employee_id = Column(Integer, ForeignKey("employees.id"))
    created_by_id = Column(Integer, ForeignKey("users.id"))
    
    employee = relationship("Employee")
    created_by = relationship("User")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text)
    type = Column(String(50))  # info, success, warning, error
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    data = Column(JSON)  # Données additionnelles
    
    user_id = Column(Integer, ForeignKey("users.id"))
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    user = relationship("User", foreign_keys=[user_id])
    created_by = relationship("User", foreign_keys=[created_by_id])

class AssetStatus(str, enum.Enum):
    AVAILABLE = "Disponible"
    ASSIGNED = "Assigné"
    MAINTENANCE = "Maintenance"
    OUT_OF_SERVICE = "Hors service"

class AssetCondition(str, enum.Enum):
    EXCELLENT = "Excellent"
    GOOD = "Bon"
    AVERAGE = "Moyen"
    REPAIR = "Réparation"

class AssetCategory(str, enum.Enum):
    COMPUTER = "Ordinateur"
    PHONE = "Téléphone"
    PRINTER = "Imprimante"
    MONITOR = "Moniteur"
    FURNITURE = "Mobilier"
    ACCESSORY = "Accessoire"

class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(String(50), unique=True, index=True)
    name = Column(String(200), nullable=False)
    category = Column(SAEnum(AssetCategory), nullable=False)
    brand = Column(String(100))
    model = Column(String(100))
    serial_number = Column(String(100), unique=True)
    purchase_date = Column(Date)
    warranty_end = Column(Date)
    status = Column(SAEnum(AssetStatus), default=AssetStatus.AVAILABLE)
    condition = Column(SAEnum(AssetCondition), default=AssetCondition.EXCELLENT)
    location = Column(String(200))
    value = Column(Float)
    description = Column(Text)
    
    company_id = Column(Integer, ForeignKey("companies.id"))
    assigned_to_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    
    company = relationship("Company")
    assigned_to = relationship("Employee", back_populates="assigned_assets")
    asset_history = relationship("AssetHistory", back_populates="asset", cascade="all, delete-orphan")
    tags = relationship("AssetTag", back_populates="asset", cascade="all, delete-orphan")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AssetHistory(Base):
    __tablename__ = "asset_history"
    
    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"))
    action = Column(String(100))
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    location = Column(String(200))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    asset = relationship("Asset", back_populates="asset_history")
    employee = relationship("Employee")

class AssetTag(Base):
    __tablename__ = "asset_tags"
    
    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"))
    tag_name = Column(String(50))
    
    asset = relationship("Asset", back_populates="tags")

class CompanyAsset(Base):
    __tablename__ = "company_assets"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100))
    serial_number = Column(String(100))
    purchase_date = Column(Date)
    purchase_price = Column(Float)
    status = Column(String(50), default="available")
    condition = Column(String(50))
    
    company_id = Column(Integer, ForeignKey("companies.id"))
    assigned_to_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    
    company = relationship("Company")
    assigned_to = relationship("Employee")

class SharedDocument(Base):
    __tablename__ = "shared_documents"
    id = Column(Integer, primary_key=True, index=True)
    permissions = Column(String(50), default="read")
    share_date = Column(DateTime, default=datetime.utcnow)
    expiry_date = Column(DateTime)
    message = Column(Text)
    is_active = Column(Boolean, default=True)
    access_log = Column(JSON)
    
    document_id = Column(Integer, ForeignKey("employee_documents.id"))
    owner_id = Column(Integer, ForeignKey("employees.id"))
    shared_with_id = Column(Integer, ForeignKey("employees.id"))
    
    document = relationship("EmployeeDocument")
    owner = relationship("Employee", foreign_keys=[owner_id])
    shared_with = relationship("Employee", foreign_keys=[shared_with_id])

class Invitation(Base):
    __tablename__ = "invitations"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), nullable=False, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    role = Column(SAEnum(RoleEnum), nullable=False)
    token = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    accepted_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    
    # Statut email et invitation
    email_status = Column(String(50), default="pending")  # pending, sent, opened, accepted, failed
    email_sent_at = Column(DateTime, nullable=True)
    email_opened_at = Column(DateTime, nullable=True)
    
    # Informations employé
    job_title = Column(String(100), nullable=True)
    salary = Column(Float, nullable=True)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    company_id = Column(Integer, ForeignKey("companies.id"))
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    invited_by_id = Column(Integer, ForeignKey("users.id"))
    
    company = relationship("Company")
    department = relationship("Department")
    invited_by = relationship("User", foreign_keys=[invited_by_id])
    manager = relationship("User", foreign_keys=[manager_id])

class PasswordReset(Base):
    __tablename__ = "password_resets"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), nullable=False, index=True)
    token = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    used_at = Column(DateTime, nullable=True)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User")

# --- Workflow Models ---

class WorkflowTemplate(Base):
    __tablename__ = "workflow_templates"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    department = Column(String(100))
    position = Column(String(100))
    duration_days = Column(Integer, default=30)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    
    company_id = Column(Integer, ForeignKey("companies.id"))
    
    company = relationship("Company")
    task_templates = relationship("TaskTemplate", back_populates="workflow_template")
    workflow_instances = relationship("WorkflowInstance", back_populates="template")

class TaskTemplate(Base):
    __tablename__ = "task_templates"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    day_offset = Column(Integer, default=0)
    estimated_hours = Column(Float)
    is_mandatory = Column(Boolean, default=True)
    assigned_role = Column(String(50))  # "manager", "hr", "buddy", "employee"
    category = Column(String(100))
    order_index = Column(Integer, default=0)
    
    workflow_template_id = Column(Integer, ForeignKey("workflow_templates.id"))
    
    workflow_template = relationship("WorkflowTemplate", back_populates="task_templates")
    task_instances = relationship("TaskInstance", back_populates="task_template")

class WorkflowInstance(Base):
    __tablename__ = "workflow_instances"
    id = Column(Integer, primary_key=True, index=True)
    start_date = Column(Date, nullable=False)
    expected_end_date = Column(Date, nullable=False)
    actual_end_date = Column(Date)
    status = Column(String(50), default="active")  # draft, active, completed, cancelled
    completion_percentage = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    employee_id = Column(Integer, ForeignKey("employees.id"))
    template_id = Column(Integer, ForeignKey("workflow_templates.id"))
    
    employee = relationship("Employee")
    template = relationship("WorkflowTemplate", back_populates="workflow_instances")
    task_instances = relationship("TaskInstance", back_populates="workflow_instance")

class TaskInstance(Base):
    __tablename__ = "task_instances"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    due_date = Column(Date, nullable=False)
    status = Column(String(50), default="pending")  # pending, in_progress, completed, skipped
    estimated_hours = Column(Float)
    actual_hours = Column(Float)
    notes = Column(Text)
    completed_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    workflow_instance_id = Column(Integer, ForeignKey("workflow_instances.id"))
    task_template_id = Column(Integer, ForeignKey("task_templates.id"))
    assigned_to_id = Column(Integer, ForeignKey("users.id"))
    
    workflow_instance = relationship("WorkflowInstance", back_populates="task_instances")
    task_template = relationship("TaskTemplate", back_populates="task_instances")
    assigned_to = relationship("User")

# Advanced Task Management Models
class AdvancedTask(Base):
    __tablename__ = "advanced_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    priority = Column(String(20), default="medium")
    category = Column(String(50), nullable=False)
    status = Column(String(20), default="pending")
    progress = Column(Integer, default=0)
    due_date = Column(DateTime)
    estimated_hours = Column(Float)
    actual_hours = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("employees.id"))
    department_id = Column(Integer, ForeignKey("departments.id"))
    
    # Relationships
    creator = relationship("User", foreign_keys=[created_by])
    assignee = relationship("Employee", foreign_keys=[assigned_to])
    department = relationship("Department")
    assignments = relationship("TaskAssignment", back_populates="task")
    comments = relationship("TaskComment", back_populates="task")
    tags = relationship("TaskTag", back_populates="task")

class TaskAssignment(Base):
    __tablename__ = "task_assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("advanced_tasks.id"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("employees.id"), nullable=False)
    assigned_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text)
    
    # Relationships
    task = relationship("AdvancedTask", back_populates="assignments")
    assignee = relationship("Employee", foreign_keys=[assigned_to])
    assigner = relationship("User", foreign_keys=[assigned_by])

class TaskComment(Base):
    __tablename__ = "task_comments"
    
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("advanced_tasks.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    task = relationship("AdvancedTask", back_populates="comments")
    author = relationship("User")

class TaskTag(Base):
    __tablename__ = "task_tags"
    
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("advanced_tasks.id"), nullable=False)
    tag_name = Column(String(50), nullable=False)
    
    # Relationships
    task = relationship("AdvancedTask", back_populates="tags")

# Settings Models
class Role(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True)
    description = Column(String(200))
    permissions = Column(JSON)
    is_system_role = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    # users = relationship("User", back_populates="role_obj")  # Commented out - no corresponding relation in User

class CompanySettings(Base):
    __tablename__ = "company_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    company_name = Column(String(100))
    company_email = Column(String(100))
    company_phone = Column(String(20))
    company_address = Column(String(200))
    company_logo = Column(String(255))
    timezone = Column(String(50), default="Europe/Paris")
    date_format = Column(String(20), default="DD/MM/YYYY")
    currency = Column(String(10), default="EUR")
    language = Column(String(10), default="fr")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company")

class SecuritySettings(Base):
    __tablename__ = "security_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    password_min_length = Column(Integer, default=8)
    password_require_uppercase = Column(Boolean, default=True)
    password_require_lowercase = Column(Boolean, default=True)
    password_require_numbers = Column(Boolean, default=True)
    password_require_symbols = Column(Boolean, default=False)
    password_expiry_days = Column(Integer)
    max_login_attempts = Column(Integer, default=5)
    lockout_duration_minutes = Column(Integer, default=30)
    session_timeout_minutes = Column(Integer, default=480)
    two_factor_enabled = Column(Boolean, default=False)
    ip_whitelist = Column(JSON)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company")

class Integration(Base):
    __tablename__ = "integrations"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(50), nullable=False)
    type = Column(String(50), nullable=False)
    config = Column(JSON)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_sync = Column(DateTime)
    status = Column(String(20), default="active")
    
    # Relationships
    company = relationship("Company")

class UserNotificationSettings(Base):
    __tablename__ = "user_notification_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    email_notifications = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=True)
    sms_notifications = Column(Boolean, default=False)
    notification_types = Column(JSON)
    quiet_hours_start = Column(String(10), default="22:00")
    quiet_hours_end = Column(String(10), default="08:00")
    digest_frequency = Column(String(20), default="daily")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User")

# Payroll Configuration Models
class PayrollConfig(Base):
    __tablename__ = "payroll_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    country_code = Column(String(3), nullable=False)
    country_name = Column(String(100), nullable=False)
    currency_code = Column(String(3), nullable=False)
    currency_symbol = Column(String(5), nullable=False)
    
    # Payroll Settings
    payroll_frequency = Column(String(20), default="monthly")
    minimum_wage = Column(Float)
    working_hours_per_week = Column(Float, default=40.0)
    working_days_per_week = Column(Integer, default=5)
    
    # Tax Settings
    tax_calculation_method = Column(String(20), default="progressive")
    tax_year_start_month = Column(Integer, default=1)
    
    # Compliance Flags
    requires_social_security = Column(Boolean, default=True)
    requires_income_tax = Column(Boolean, default=True)
    requires_pension = Column(Boolean, default=True)
    
    # Formatting
    date_format = Column(String(20), default="DD/MM/YYYY")
    decimal_places = Column(Integer, default=2)
    
    # Configuration Data
    social_contributions = Column(JSON)
    income_tax_rules = Column(JSON)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company")

# External Integrations Models
class ExternalIntegration(Base):
    __tablename__ = "external_integrations"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)
    provider = Column(String(50), nullable=False)
    config = Column(JSON)
    is_active = Column(Boolean, default=True)
    status = Column(String(20), default="inactive")
    sync_frequency = Column(String(20), default="daily")
    last_sync = Column(DateTime)
    last_error = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company")
    sync_logs = relationship("IntegrationSyncLog", back_populates="integration")

class IntegrationSyncLog(Base):
    __tablename__ = "integration_sync_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    integration_id = Column(Integer, ForeignKey("external_integrations.id"), nullable=False)
    status = Column(String(20), nullable=False)
    records_processed = Column(Integer, default=0)
    records_success = Column(Integer, default=0)
    records_failed = Column(Integer, default=0)
    error_message = Column(Text)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    duration_seconds = Column(Float)
    
    # Relationships
    integration = relationship("ExternalIntegration", back_populates="sync_logs")