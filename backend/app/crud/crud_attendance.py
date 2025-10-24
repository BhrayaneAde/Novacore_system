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