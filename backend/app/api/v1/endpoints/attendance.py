from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, date
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

@router.get("/calendar/{employee_id}")
async def get_attendance_calendar(
    employee_id: int,
    month: int,
    year: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupérer les données du calendrier de présence"""
    employee = crud_employee.get_employee(db, employee_id)
    if not employee or employee.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Employé non trouvé")
    
    # Calculer les dates de début et fin du mois
    start_date = date(year, month, 1)
    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)
    
    # Récupérer les présences du mois
    attendance_records = db.query(models.AttendanceRecord).filter(
        models.AttendanceRecord.employee_id == employee_id,
        models.AttendanceRecord.date >= start_date,
        models.AttendanceRecord.date < end_date
    ).all()
    
    # Récupérer les congés du mois
    leave_requests = db.query(models.LeaveRequest).filter(
        models.LeaveRequest.employee_id == employee_id,
        models.LeaveRequest.start_date < end_date,
        models.LeaveRequest.end_date >= start_date,
        models.LeaveRequest.status == "approved"
    ).all()
    
    return {
        "attendance": attendance_records,
        "leaves": leave_requests,
        "statistics": {
            "total_days": len(attendance_records),
            "total_hours": sum([(r.clock_out - r.clock_in).total_seconds() / 3600 for r in attendance_records if r.clock_out]),
            "leave_days": sum([(l.end_date - l.start_date).days + 1 for l in leave_requests])
        }
    }

@router.get("/statistics/{employee_id}")
async def get_attendance_statistics(
    employee_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupérer les statistiques de présence"""
    employee = crud_employee.get_employee(db, employee_id)
    if not employee or employee.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Employé non trouvé")
    
    # Statistiques du mois en cours
    today = datetime.now().date()
    start_month = date(today.year, today.month, 1)
    
    monthly_records = db.query(models.AttendanceRecord).filter(
        models.AttendanceRecord.employee_id == employee_id,
        models.AttendanceRecord.date >= start_month
    ).all()
    
    return {
        "monthly_hours": sum([(r.clock_out - r.clock_in).total_seconds() / 3600 for r in monthly_records if r.clock_out]),
        "monthly_days": len(monthly_records),
        "average_arrival": "09:00",  # Calculer la moyenne réelle
        "overtime_hours": sum([r.overtime_hours or 0 for r in monthly_records])
    }