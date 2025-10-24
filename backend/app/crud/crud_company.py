from sqlalchemy.orm import Session
from typing import Optional, List
from app.db import models
from app.schemas import company as company_schema

def get_company(db: Session, company_id: int) -> Optional[models.Company]:
    return db.query(models.Company).filter(models.Company.id == company_id).first()

def get_company_by_email(db: Session, email: str) -> Optional[models.Company]:
    return db.query(models.Company).filter(models.Company.email == email).first()

def create_company(db: Session, company: company_schema.CompanyCreate) -> models.Company:
    db_company = models.Company(**company.dict())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

def get_department(db: Session, department_id: int) -> Optional[models.Department]:
    return db.query(models.Department).filter(models.Department.id == department_id).first()

def get_departments(db: Session, company_id: int) -> List[models.Department]:
    return db.query(models.Department).filter(models.Department.company_id == company_id).all()

def create_department(db: Session, department: company_schema.DepartmentCreate) -> models.Department:
    db_department = models.Department(**department.dict())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department