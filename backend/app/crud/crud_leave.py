from sqlalchemy.orm import Session
from typing import Optional, List
from app.db import models
from app.schemas import leave as leave_schema

def get_leave_request(db: Session, leave_id: int) -> Optional[models.LeaveRequest]:
    return db.query(models.LeaveRequest).filter(models.LeaveRequest.id == leave_id).first()

def get_leave_requests(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[models.LeaveRequest]:
    return db.query(models.LeaveRequest).join(models.Employee).filter(
        models.Employee.company_id == company_id
    ).offset(skip).limit(limit).all()

def get_leave_requests_by_employee(db: Session, employee_id: int) -> List[models.LeaveRequest]:
    return db.query(models.LeaveRequest).filter(models.LeaveRequest.employee_id == employee_id).all()

def create_leave_request(db: Session, leave: leave_schema.LeaveRequestCreate) -> models.LeaveRequest:
    db_leave = models.LeaveRequest(**leave.dict())
    db.add(db_leave)
    db.commit()
    db.refresh(db_leave)
    return db_leave

def update_leave_request(db: Session, db_leave: models.LeaveRequest, leave_in: leave_schema.LeaveRequestUpdate) -> models.LeaveRequest:
    update_data = leave_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_leave, key, value)
    db.add(db_leave)
    db.commit()
    db.refresh(db_leave)
    return db_leave