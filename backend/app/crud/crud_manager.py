from sqlalchemy.orm import Session
from typing import Optional, List
from app.db import models
from app.schemas import manager as manager_schema

def get_nomination(db: Session, nomination_id: int) -> Optional[models.ManagerNomination]:
    return db.query(models.ManagerNomination).filter(models.ManagerNomination.id == nomination_id).first()

def get_nominations(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[models.ManagerNomination]:
    return db.query(models.ManagerNomination).join(models.Department).filter(
        models.Department.company_id == company_id
    ).offset(skip).limit(limit).all()

def create_nomination(db: Session, nomination: manager_schema.ManagerNominationCreate) -> models.ManagerNomination:
    db_nomination = models.ManagerNomination(**nomination.dict())
    db.add(db_nomination)
    db.commit()
    db.refresh(db_nomination)
    return db_nomination

def update_nomination(db: Session, db_nomination: models.ManagerNomination, nomination_in: manager_schema.ManagerNominationUpdate) -> models.ManagerNomination:
    update_data = nomination_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_nomination, key, value)
    db.add(db_nomination)
    db.commit()
    db.refresh(db_nomination)
    return db_nomination