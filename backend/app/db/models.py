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
    
    users = relationship("User", back_populates="company")
    employees = relationship("Employee", back_populates="company")
    departments = relationship("Department", back_populates="company")

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
    
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_by_id = Column(Integer, ForeignKey("users.id"))
    
    company = relationship("Company")
    created_by = relationship("User")
    candidates = relationship("Candidate", back_populates="job_opening")

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(50))
    status = Column(String(50), default="applied")  # applied, screening, interview, offer, hired, rejected
    applied_date = Column(Date, default=datetime.utcnow)
    experience = Column(String(100))
    avatar = Column(String(255))
    cv_url = Column(String(255))
    
    job_opening_id = Column(Integer, ForeignKey("job_openings.id"))
    
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