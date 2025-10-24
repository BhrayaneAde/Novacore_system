from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class EvaluationBase(BaseModel):
    period: str
    global_score: Optional[float] = None
    manager_comments: Optional[str] = None
    strengths: Optional[List[str]] = []
    improvements: Optional[List[str]] = []
    next_objectives: Optional[List[str]] = []
    automatic_metrics: Optional[Dict[str, Any]] = {}
    manual_evaluation: Optional[Dict[str, Any]] = {}

class EvaluationCreate(EvaluationBase):
    employee_id: int
    manager_id: int

class EvaluationUpdate(EvaluationBase):
    pass

class Evaluation(EvaluationBase):
    id: int
    employee_id: int
    manager_id: int

    model_config = {"from_attributes": True}