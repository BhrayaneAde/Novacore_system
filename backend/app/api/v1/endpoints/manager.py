from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import manager as manager_schema
from app.crud import crud_manager, crud_company

router = APIRouter()

@router.get("/nominations", response_model=List[manager_schema.ManagerNomination])
async def read_nominations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_hr_admin)
):
    return crud_manager.get_nominations(db, company_id=current_user.company_id, skip=skip, limit=limit)

@router.post("/nominations", response_model=manager_schema.ManagerNomination, status_code=status.HTTP_201_CREATED)
async def create_nomination(
    nomination_in: manager_schema.ManagerNominationCreate,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    department = crud_company.get_department(db, nomination_in.department_id)
    if not department or department.company_id != current_admin.company_id:
        raise HTTPException(status_code=404, detail="Département non trouvé")
    nomination_in.proposed_by_id = current_admin.id
    return crud_manager.create_nomination(db=db, nomination=nomination_in)

@router.put("/nominations/{nomination_id}", response_model=manager_schema.ManagerNomination)
async def update_nomination(
    nomination_id: int,
    nomination_in: manager_schema.ManagerNominationUpdate,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    db_nomination = crud_manager.get_nomination(db, nomination_id)
    if not db_nomination:
        raise HTTPException(status_code=404, detail="Nomination non trouvée")
    return crud_manager.update_nomination(db=db, db_nomination=db_nomination, nomination_in=nomination_in)