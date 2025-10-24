from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import attendance as attendance_schema
from app.crud import crud_attendance, crud_employee

router = APIRouter()

@router.get("/records", response_model=List[attendance_schema.AttendanceRecord])
async def read_attendance_records(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    return crud_attendance.get_attendance_records(db, company_id=current_user.company_id, skip=skip, limit=limit)

@router.post("/records", response_model=attendance_schema.AttendanceRecord, status_code=status.HTTP_201_CREATED)
async def create_attendance_record(
    attendance_in: attendance_schema.AttendanceRecordCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    employee = crud_employee.get_employee(db, attendance_in.employee_id)
    if not employee or employee.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Employé non trouvé")
    return crud_attendance.create_attendance_record(db=db, attendance=attendance_in)

@router.get("/time-entries", response_model=List[attendance_schema.TimeEntry])
async def read_time_entries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    return crud_attendance.get_time_entries(db, company_id=current_user.company_id, skip=skip, limit=limit)

@router.post("/time-entries", response_model=attendance_schema.TimeEntry, status_code=status.HTTP_201_CREATED)
async def create_time_entry(
    entry_in: attendance_schema.TimeEntryCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    employee = crud_employee.get_employee(db, entry_in.employee_id)
    if not employee or employee.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Employé non trouvé")
    return crud_attendance.create_time_entry(db=db, time_entry=entry_in)

@router.put("/time-entries/{entry_id}", response_model=attendance_schema.TimeEntry)
async def update_time_entry(
    entry_id: int,
    entry_in: attendance_schema.TimeEntryUpdate,
    db: Session = Depends(deps.get_db),
    current_manager: models.User = Depends(deps.get_current_active_manager)
):
    db_entry = crud_attendance.get_time_entry(db, entry_id)
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entrée temps non trouvée")
    return crud_attendance.update_time_entry(db=db, db_entry=db_entry, entry_in=entry_in)