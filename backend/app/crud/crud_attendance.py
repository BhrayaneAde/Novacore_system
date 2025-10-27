from sqlalchemy.orm import Session
from typing import Optional, List
from app.db import models
from app.schemas import attendance as attendance_schema

def get_attendance_record(db: Session, record_id: int) -> Optional[models.AttendanceRecord]:
    return db.query(models.AttendanceRecord).filter(models.AttendanceRecord.id == record_id).first()

def get_attendance_records(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[models.AttendanceRecord]:
    return db.query(models.AttendanceRecord).join(models.Employee).filter(
        models.Employee.company_id == company_id
    ).offset(skip).limit(limit).all()

def create_attendance_record(db: Session, attendance: attendance_schema.AttendanceRecordCreate) -> models.AttendanceRecord:
    db_attendance = models.AttendanceRecord(**attendance.dict())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

def get_time_entry(db: Session, entry_id: int) -> Optional[models.TimeEntry]:
    return db.query(models.TimeEntry).filter(models.TimeEntry.id == entry_id).first()

def get_time_entries(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[models.TimeEntry]:
    return db.query(models.TimeEntry).join(models.Employee).filter(
        models.Employee.company_id == company_id
    ).offset(skip).limit(limit).all()

def create_time_entry(db: Session, time_entry: attendance_schema.TimeEntryCreate) -> models.TimeEntry:
    db_entry = models.TimeEntry(**time_entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

def update_time_entry(db: Session, db_entry: models.TimeEntry, entry_in: attendance_schema.TimeEntryUpdate) -> models.TimeEntry:
    update_data = entry_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_entry, key, value)
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

# Nouvelles méthodes pour le time tracking
def get_active_session(db: Session, employee_id: int) -> Optional[models.AttendanceRecord]:
    """Récupérer la session active d'un employé"""
    return db.query(models.AttendanceRecord).filter(
        models.AttendanceRecord.employee_id == employee_id,
        models.AttendanceRecord.clock_out.is_(None)
    ).first()

def update_attendance_record(db: Session, db_attendance: models.AttendanceRecord, attendance_in: attendance_schema.AttendanceUpdate) -> models.AttendanceRecord:
    """Mettre à jour un enregistrement de présence"""
    update_data = attendance_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_attendance, key, value)
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

def get_attendance_by_date(db: Session, employee_id: int, date):
    """Récupérer les présences d'un employé pour une date"""
    from datetime import datetime
    if isinstance(date, str):
        date = datetime.strptime(date, "%Y-%m-%d").date()
    
    return db.query(models.AttendanceRecord).filter(
        models.AttendanceRecord.employee_id == employee_id,
        models.AttendanceRecord.date == date
    ).all()

def get_attendance_by_week(db: Session, employee_id: int, start_date):
    """Récupérer les présences d'un employé pour une semaine"""
    from datetime import datetime, timedelta
    if isinstance(start_date, str):
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
    
    end_date = start_date + timedelta(days=7)
    
    return db.query(models.AttendanceRecord).filter(
        models.AttendanceRecord.employee_id == employee_id,
        models.AttendanceRecord.date >= start_date,
        models.AttendanceRecord.date < end_date
    ).all()

def get_attendance_by_employee(db: Session, employee_id: int):
    """Récupérer toutes les présences d'un employé"""
    return db.query(models.AttendanceRecord).filter(
        models.AttendanceRecord.employee_id == employee_id
    ).all()