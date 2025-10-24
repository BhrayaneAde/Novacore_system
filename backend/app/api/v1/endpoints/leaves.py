from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import leave as leave_schema
from app.crud import crud_leave, crud_employee

router = APIRouter()

@router.get("/", response_model=List[leave_schema.LeaveRequest])
async def read_leave_requests(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    return crud_leave.get_leave_requests(db, company_id=current_user.company_id, skip=skip, limit=limit)

@router.post("/", response_model=leave_schema.LeaveRequest, status_code=status.HTTP_201_CREATED)
async def create_leave_request(
    leave_in: leave_schema.LeaveRequestCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    employee = crud_employee.get_employee(db, leave_in.employee_id)
    if not employee or employee.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Employé non trouvé")
    return crud_leave.create_leave_request(db=db, leave=leave_in)

@router.put("/{leave_id}", response_model=leave_schema.LeaveRequest)
async def update_leave_request(
    leave_id: int,
    leave_in: leave_schema.LeaveRequestUpdate,
    db: Session = Depends(deps.get_db),
    current_manager: models.User = Depends(deps.get_current_active_manager)
):
    db_leave = crud_leave.get_leave_request(db, leave_id)
    if not db_leave:
        raise HTTPException(status_code=404, detail="Demande non trouvée")
    return crud_leave.update_leave_request(db=db, db_leave=db_leave, leave_in=leave_in)