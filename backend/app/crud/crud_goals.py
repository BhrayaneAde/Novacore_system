from sqlalchemy.orm import Session
from typing import Optional, List
from app.db import models
from app.schemas import goals as goals_schema

def get_goal(db: Session, goal_id: int) -> Optional[models.Goal]:
    return db.query(models.Goal).filter(models.Goal.id == goal_id).first()

def get_goals(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[models.Goal]:
    return db.query(models.Goal).join(models.Employee).filter(
        models.Employee.company_id == company_id
    ).offset(skip).limit(limit).all()

def get_goals_by_employee(db: Session, employee_id: int) -> List[models.Goal]:
    return db.query(models.Goal).filter(models.Goal.employee_id == employee_id).all()

def create_goal(db: Session, goal: goals_schema.GoalCreate) -> models.Goal:
    db_goal = models.Goal(**goal.dict())
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

def update_goal(db: Session, db_goal: models.Goal, goal_in: goals_schema.GoalUpdate) -> models.Goal:
    update_data = goal_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_goal, key, value)
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal