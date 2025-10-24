from sqlalchemy.orm import Session
from typing import Optional, List
from app.db import models
from app.schemas import performance as performance_schema

def get_evaluation(db: Session, evaluation_id: int) -> Optional[models.Evaluation]:
    return db.query(models.Evaluation).filter(models.Evaluation.id == evaluation_id).first()

def get_evaluations(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[models.Evaluation]:
    return db.query(models.Evaluation).join(models.Employee).filter(
        models.Employee.company_id == company_id
    ).offset(skip).limit(limit).all()

def get_evaluations_by_employee(db: Session, employee_id: int) -> List[models.Evaluation]:
    return db.query(models.Evaluation).filter(models.Evaluation.employee_id == employee_id).all()

def create_evaluation(db: Session, evaluation: performance_schema.EvaluationCreate) -> models.Evaluation:
    db_evaluation = models.Evaluation(**evaluation.dict())
    db.add(db_evaluation)
    db.commit()
    db.refresh(db_evaluation)
    return db_evaluation

def update_evaluation(db: Session, db_evaluation: models.Evaluation, evaluation_in: performance_schema.EvaluationUpdate) -> models.Evaluation:
    update_data = evaluation_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_evaluation, key, value)
    db.add(db_evaluation)
    db.commit()
    db.refresh(db_evaluation)
    return db_evaluation