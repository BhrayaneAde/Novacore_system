from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ....db.database import get_db
from ....core.auth import get_current_user
from ....db.models import User, Evaluation
from ....schemas.performance import EvaluationCreate, EvaluationUpdate, EvaluationResponse

router = APIRouter()

@router.get("/evaluations", response_model=List[EvaluationResponse])
def get_evaluations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all evaluations"""
    evaluations = db.query(Evaluation).offset(skip).limit(limit).all()
    return evaluations

@router.get("/evaluations/test")
def get_evaluations_test(
    db: Session = Depends(get_db)
):
    """Test endpoint without auth"""
    evaluations = db.query(Evaluation).all()
    return {"count": len(evaluations), "evaluations": [{
        "id": e.id,
        "employee_id": e.employee_id,
        "period": e.period,
        "global_score": e.global_score
    } for e in evaluations]}

@router.post("/evaluations", response_model=EvaluationResponse, status_code=status.HTTP_201_CREATED)
def create_evaluation(
    evaluation_in: EvaluationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new evaluation"""
    db_evaluation = Evaluation(**evaluation_in.dict(), manager_id=current_user.id)
    db.add(db_evaluation)
    db.commit()
    db.refresh(db_evaluation)
    return db_evaluation

@router.put("/evaluations/{evaluation_id}", response_model=EvaluationResponse)
def update_evaluation(
    evaluation_id: int,
    evaluation_in: EvaluationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update evaluation"""
    db_evaluation = db.query(Evaluation).filter(Evaluation.id == evaluation_id).first()
    if not db_evaluation:
        raise HTTPException(status_code=404, detail="Évaluation non trouvée")
    
    for field, value in evaluation_in.dict(exclude_unset=True).items():
        setattr(db_evaluation, field, value)
    
    db.commit()
    db.refresh(db_evaluation)
    return db_evaluation