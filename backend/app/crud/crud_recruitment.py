from sqlalchemy.orm import Session
from typing import Optional, List
from app.db import models
from app.schemas import recruitment as recruitment_schema

def get_job_opening(db: Session, job_id: int) -> Optional[models.JobOpening]:
    return db.query(models.JobOpening).filter(models.JobOpening.id == job_id).first()

def get_job_openings(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[models.JobOpening]:
    return db.query(models.JobOpening).filter(models.JobOpening.company_id == company_id).offset(skip).limit(limit).all()

def create_job_opening(db: Session, job: recruitment_schema.JobOpeningCreate) -> models.JobOpening:
    db_job = models.JobOpening(**job.dict())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def get_candidate(db: Session, candidate_id: int) -> Optional[models.Candidate]:
    return db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()

def get_candidates(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[models.Candidate]:
    return db.query(models.Candidate).join(models.JobOpening).filter(
        models.JobOpening.company_id == company_id
    ).offset(skip).limit(limit).all()

def create_candidate(db: Session, candidate: recruitment_schema.CandidateCreate) -> models.Candidate:
    db_candidate = models.Candidate(**candidate.dict())
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

def update_candidate(db: Session, db_candidate: models.Candidate, candidate_in: recruitment_schema.CandidateUpdate) -> models.Candidate:
    update_data = candidate_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_candidate, key, value)
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate