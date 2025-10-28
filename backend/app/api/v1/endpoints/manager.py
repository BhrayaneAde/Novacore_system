from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ....db.database import get_db
from ....core.auth import get_current_user
from ....db.models import User, Employee

router = APIRouter()

@router.get("/")
def get_managers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all managers"""
    managers = db.query(User).filter(User.role.in_(["manager", "hr_admin", "employer"])).all()
    return [
        {
            "id": m.id,
            "first_name": m.first_name,
            "last_name": m.last_name,
            "email": m.email,
            "position": f"Manager {m.role.replace('_', ' ').title()}",
            "avatar": "https://via.placeholder.com/40",
            "department": {
                "name": "Management",
                "employees": 5,
                "performance": "+10%"
            },
            "created_at": m.created_date.isoformat() if m.created_date else None
        } for m in managers
    ]

@router.get("/nominations")
def get_nominations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get manager nominations"""
    return []

@router.get("/nominations/pending")
def get_pending_nominations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get pending manager nominations"""
    return []

@router.post("/nominations")
def create_nomination(
    nomination_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create manager nomination"""
    return {"id": 1, "status": "pending", **nomination_data}

@router.put("/nominations/{nomination_id}")
def update_nomination(
    nomination_id: int,
    nomination_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update manager nomination"""
    return {"id": nomination_id, "status": "updated", **nomination_data}

@router.get("/test")
def get_managers_test(
    db: Session = Depends(get_db)
):
    """Test endpoint without auth"""
    managers = db.query(User).filter(User.role.in_(["manager", "hr_admin", "employer"])).all()
    return {
        "count": len(managers),
        "managers": [
            {
                "id": m.id,
                "first_name": m.first_name,
                "last_name": m.last_name,
                "email": m.email,
                "role": m.role
            } for m in managers
        ]
    }