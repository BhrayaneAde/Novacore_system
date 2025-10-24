from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import goals as goals_schema
from app.crud import crud_goals, crud_employee

router = APIRouter()

@router.get("/", response_model=List[goals_schema.Goal])
async def read_goals(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    return crud_goals.get_goals(db, company_id=current_user.company_id, skip=skip, limit=limit)

@router.post("/", response_model=goals_schema.Goal, status_code=status.HTTP_201_CREATED)
async def create_goal(
    goal_in: goals_schema.GoalCreate,
    db: Session = Depends(deps.get_db),
    current_manager: models.User = Depends(deps.get_current_active_manager)
):
    employee = crud_employee.get_employee(db, goal_in.employee_id)
    if not employee or employee.company_id != current_manager.company_id:
        raise HTTPException(status_code=404, detail="Employé non trouvé")
    goal_in.created_by_id = current_manager.id
    return crud_goals.create_goal(db=db, goal=goal_in)

@router.put("/{goal_id}", response_model=goals_schema.Goal)
async def update_goal(
    goal_id: int,
    goal_in: goals_schema.GoalUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    db_goal = crud_goals.get_goal(db, goal_id)
    if not db_goal:
        raise HTTPException(status_code=404, detail="Objectif non trouvé")
    return crud_goals.update_goal(db=db, db_goal=db_goal, goal_in=goal_in)