from sqlalchemy.orm import Session
from typing import Optional, List
from app.db import models
from app.schemas import payroll as payroll_schema

def get_payroll_record(db: Session, record_id: int) -> Optional[models.PayrollRecord]:
    return db.query(models.PayrollRecord).filter(models.PayrollRecord.id == record_id).first()

def get_payroll_records(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[models.PayrollRecord]:
    return db.query(models.PayrollRecord).join(models.Employee).filter(
        models.Employee.company_id == company_id
    ).offset(skip).limit(limit).all()

def get_payroll_by_employee(db: Session, employee_id: int) -> List[models.PayrollRecord]:
    return db.query(models.PayrollRecord).filter(models.PayrollRecord.employee_id == employee_id).all()

def create_payroll_record(db: Session, payroll: payroll_schema.PayrollRecordCreate) -> models.PayrollRecord:
    db_payroll = models.PayrollRecord(**payroll.dict())
    db.add(db_payroll)
    db.commit()
    db.refresh(db_payroll)
    return db_payroll

def update_payroll_record(db: Session, db_payroll: models.PayrollRecord, payroll_in: payroll_schema.PayrollRecordUpdate) -> models.PayrollRecord:
    update_data = payroll_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_payroll, key, value)
    db.add(db_payroll)
    db.commit()
    db.refresh(db_payroll)
    return db_payroll