from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import performance as performance_schema
from app.crud import crud_performance, crud_employee

router = APIRouter()

@router.get("/", response_model=List[performance_schema.Evaluation])
async def read_evaluations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    return crud_performance.get_evaluations(db, company_id=current_user.company_id, skip=skip, limit=limit)

@router.post("/", response_model=performance_schema.Evaluation, status_code=status.HTTP_201_CREATED)
async def create_evaluation(
    evaluation_in: performance_schema.EvaluationCreate,
    db: Session = Depends(deps.get_db),
    current_manager: models.User = Depends(deps.get_current_active_manager)
):
    employee = crud_employee.get_employee(db, evaluation_in.employee_id)
    if not employee or employee.company_id != current_manager.company_id:
        raise HTTPException(status_code=404, detail="Employé non trouvé")
    evaluation_in.manager_id = current_manager.id
    return crud_performance.create_evaluation(db=db, evaluation=evaluation_in)

@router.put("/{evaluation_id}", response_model=performance_schema.Evaluation)
async def update_evaluation(
    evaluation_id: int,
    evaluation_in: performance_schema.EvaluationUpdate,
    db: Session = Depends(deps.get_db),
    current_manager: models.User = Depends(deps.get_current_active_manager)
):
    db_evaluation = crud_performance.get_evaluation(db, evaluation_id)
    if not db_evaluation:
        raise HTTPException(status_code=404, detail="Évaluation non trouvée")
    return crud_performance.update_evaluation(db=db, db_evaluation=db_evaluation, evaluation_in=evaluation_in)