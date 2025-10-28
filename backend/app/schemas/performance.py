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

class EvaluationUpdate(BaseModel):
    period: Optional[str] = None
    global_score: Optional[float] = None
    manager_comments: Optional[str] = None
    strengths: Optional[List[str]] = None
    improvements: Optional[List[str]] = None
    next_objectives: Optional[List[str]] = None
    automatic_metrics: Optional[Dict[str, Any]] = None
    manual_evaluation: Optional[Dict[str, Any]] = None

class EvaluationResponse(EvaluationBase):
    id: int
    employee_id: int
    manager_id: int
    
    class Config:
        from_attributes = True