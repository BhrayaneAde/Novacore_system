from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import date, datetime

class JobOpeningBase(BaseModel):
    title: str
    department: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    # Nouveaux champs pour surveillance email
    email_keywords: Optional[List[str]] = None
    auto_screening_enabled: Optional[bool] = True
    screening_criteria: Optional[Dict[str, Any]] = None
    department_id: Optional[int] = None

class JobOpeningCreate(JobOpeningBase):
    company_id: Optional[int] = None
    created_by_id: Optional[int] = None

class JobOpening(JobOpeningBase):
    id: int
    status: str
    posted_date: date
    company_id: int
    created_by_id: int
    candidates_count: Optional[int] = 0

    model_config = {"from_attributes": True}

class CandidateBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    position: str
    experience: Optional[str] = None
    avatar: Optional[str] = None
    cv_url: Optional[str] = None
    email_subject: Optional[str] = None
    email_content: Optional[str] = None
    cv_filename: Optional[str] = None
    notes: Optional[str] = None

class CandidateCreate(CandidateBase):
    job_opening_id: Optional[int] = None
    department_id: int
    company_id: int

class CandidateUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class Candidate(CandidateBase):
    id: int
    status: str
    applied_date: Optional[date] = None
    received_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    job_opening_id: Optional[int] = None
    department_id: int
    company_id: int

    model_config = {"from_attributes": True}