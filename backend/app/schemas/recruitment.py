from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date

class JobOpeningBase(BaseModel):
    title: str
    department: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None

class JobOpeningCreate(JobOpeningBase):
    company_id: int
    created_by_id: int

class JobOpening(JobOpeningBase):
    id: int
    status: str
    posted_date: date
    company_id: int
    created_by_id: int

    model_config = {"from_attributes": True}

class CandidateBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    experience: Optional[str] = None
    avatar: Optional[str] = None
    cv_url: Optional[str] = None

class CandidateCreate(CandidateBase):
    job_opening_id: int

class CandidateUpdate(BaseModel):
    status: Optional[str] = None

class Candidate(CandidateBase):
    id: int
    status: str
    applied_date: date
    job_opening_id: int

    model_config = {"from_attributes": True}