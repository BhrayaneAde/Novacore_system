from typing import List, Optional
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import attendance as attendance_schema
from app.crud import crud_attendance

router = APIRouter()

@router.post("/clock-in", response_model=attendance_schema.AttendanceRecord)
async def clock_in(
    attendance_in: attendance_schema.AttendanceCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Pointer l'arrivée"""
    # Vérifier qu'il n'y a pas déjà une session active
    active_session = crud_attendance.get_active_session(db, current_user.employee_id)
    if active_session:
        raise HTTPException(status_code=400, detail="Une session est déjà active")
    
    attendance_in.employee_id = current_user.employee_id
    attendance_in.clock_in = datetime.now()
    return crud_attendance.create_attendance_record(db=db, attendance=attendance_in)

@router.put("/sessions/{session_id}/clock-out")
async def clock_out(
    session_id: int,
    clock_out_data: dict,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Pointer la sortie"""
    session = crud_attendance.get_attendance_record(db, session_id)
    if not session or session.employee_id != current_user.employee_id:
        raise HTTPException(status_code=404, detail="Session non trouvée")
    
    if session.clock_out:
        raise HTTPException(status_code=400, detail="Session déjà fermée")
    
    update_data = attendance_schema.AttendanceUpdate(
        clock_out=datetime.now(),
        location=clock_out_data.get("location"),
        ip_address=clock_out_data.get("ip_address")
    )
    return crud_attendance.update_attendance_record(db=db, db_attendance=session, attendance_in=update_data)

@router.put("/sessions/{session_id}/break-start")
async def start_break(
    session_id: int,
    break_data: dict,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Commencer une pause"""
    session = crud_attendance.get_attendance_record(db, session_id)
    if not session or session.employee_id != current_user.employee_id:
        raise HTTPException(status_code=404, detail="Session non trouvée")
    
    update_data = attendance_schema.AttendanceUpdate(
        break_start=datetime.now()
    )
    return crud_attendance.update_attendance_record(db=db, db_attendance=session, attendance_in=update_data)

@router.put("/sessions/{session_id}/break-end")
async def end_break(
    session_id: int,
    break_data: dict,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Terminer une pause"""
    session = crud_attendance.get_attendance_record(db, session_id)
    if not session or session.employee_id != current_user.employee_id:
        raise HTTPException(status_code=404, detail="Session non trouvée")
    
    update_data = attendance_schema.AttendanceUpdate(
        break_end=datetime.now()
    )
    return crud_attendance.update_attendance_record(db=db, db_attendance=session, attendance_in=update_data)

@router.get("/entries", response_model=List[attendance_schema.AttendanceRecord])
async def get_entries(
    date: Optional[str] = None,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupérer les entrées de temps"""
    target_date = datetime.strptime(date, "%Y-%m-%d").date() if date else datetime.now().date()
    return crud_attendance.get_attendance_by_date(db, current_user.employee_id, target_date)

@router.get("/entries/weekly", response_model=List[attendance_schema.AttendanceRecord])
async def get_weekly_entries(
    start: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupérer les entrées de la semaine"""
    start_date = datetime.strptime(start, "%Y-%m-%d").date()
    return crud_attendance.get_attendance_by_week(db, current_user.employee_id, start_date)