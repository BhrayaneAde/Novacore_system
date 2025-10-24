from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import recruitment as recruitment_schema
from app.crud import crud_recruitment

router = APIRouter()

@router.get("/jobs", response_model=List[recruitment_schema.JobOpening])
async def read_job_openings(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    return crud_recruitment.get_job_openings(db, company_id=current_user.company_id, skip=skip, limit=limit)

@router.post("/jobs", response_model=recruitment_schema.JobOpening, status_code=status.HTTP_201_CREATED)
async def create_job_opening(
    job_in: recruitment_schema.JobOpeningCreate,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    job_in.company_id = current_admin.company_id
    job_in.created_by_id = current_admin.id
    return crud_recruitment.create_job_opening(db=db, job=job_in)

@router.get("/candidates", response_model=List[recruitment_schema.Candidate])
async def read_candidates(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    return crud_recruitment.get_candidates(db, company_id=current_user.company_id, skip=skip, limit=limit)

@router.post("/candidates", response_model=recruitment_schema.Candidate, status_code=status.HTTP_201_CREATED)
async def create_candidate(
    candidate_in: recruitment_schema.CandidateCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_hr_admin)
):
    return crud_recruitment.create_candidate(db=db, candidate=candidate_in)

@router.put("/candidates/{candidate_id}", response_model=recruitment_schema.Candidate)
async def update_candidate(
    candidate_id: int,
    candidate_in: recruitment_schema.CandidateUpdate,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    db_candidate = crud_recruitment.get_candidate(db, candidate_id)
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidat non trouvé")
    return crud_recruitment.update_candidate(db=db, db_candidate=db_candidate, candidate_in=candidate_in)