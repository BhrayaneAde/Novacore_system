from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import leave as leave_schema
from app.crud import crud_leave, crud_employee

router = APIRouter()

@router.get("/", response_model=List[leave_schema.LeaveRequest])
async def read_leave_requests(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    return crud_leave.get_leave_requests(db, company_id=current_user.company_id, skip=skip, limit=limit)

@router.post("/", response_model=leave_schema.LeaveRequest, status_code=status.HTTP_201_CREATED)
async def create_leave_request(
    leave_in: leave_schema.LeaveRequestCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    employee = crud_employee.get_employee(db, leave_in.employee_id)
    if not employee or employee.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Employé non trouvé")
    return crud_leave.create_leave_request(db=db, leave=leave_in)

@router.put("/{leave_id}", response_model=leave_schema.LeaveRequest)
async def update_leave_request(
    leave_id: int,
    leave_in: leave_schema.LeaveRequestUpdate,
    db: Session = Depends(deps.get_db),
    current_manager: models.User = Depends(deps.get_current_active_manager)
):
    db_leave = crud_leave.get_leave_request(db, leave_id)
    if not db_leave:
        raise HTTPException(status_code=404, detail="Demande non trouvée")
    return crud_leave.update_leave_request(db=db, db_leave=db_leave, leave_in=leave_in)

@router.post("/{leave_id}/approve")
async def approve_leave_request(
    leave_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Approuve une demande de congé"""
    db_leave = crud_leave.get_leave_request(db, leave_id)
    if not db_leave:
        raise HTTPException(status_code=404, detail="Demande non trouvée")
    
    # Vérifier permissions (manager, hr_admin, employer)
    if current_user.role not in [models.RoleEnum.manager, models.RoleEnum.hr_admin, models.RoleEnum.employer]:
        raise HTTPException(status_code=403, detail="Permission insuffisante")
    
    # Vérifier que c'est la même entreprise
    if db_leave.employee.company_id != current_user.company_id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    db_leave.status = models.LeaveStatusEnum.approved
    db.commit()
    db.refresh(db_leave)
    
    return {"message": "Demande approuvée", "leave_request": db_leave}

@router.post("/{leave_id}/reject")
async def reject_leave_request(
    leave_id: int,
    reason: str = None,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Rejette une demande de congé"""
    db_leave = crud_leave.get_leave_request(db, leave_id)
    if not db_leave:
        raise HTTPException(status_code=404, detail="Demande non trouvée")
    
    # Vérifier permissions
    if current_user.role not in [models.RoleEnum.manager, models.RoleEnum.hr_admin, models.RoleEnum.employer]:
        raise HTTPException(status_code=403, detail="Permission insuffisante")
    
    # Vérifier que c'est la même entreprise
    if db_leave.employee.company_id != current_user.company_id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    db_leave.status = models.LeaveStatusEnum.rejected
    if reason:
        db_leave.reason = f"{db_leave.reason or ''} - Rejeté: {reason}"
    db.commit()
    db.refresh(db_leave)
    
    return {"message": "Demande rejetée", "leave_request": db_leave}

@router.post("/{leave_id}/cancel")
async def cancel_leave_request(
    leave_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Annule une demande de congé"""
    db_leave = crud_leave.get_leave_request(db, leave_id)
    if not db_leave:
        raise HTTPException(status_code=404, detail="Demande non trouvée")
    
    # Vérifier permissions (propriétaire ou manager)
    if (db_leave.employee.user_id != current_user.id and 
        current_user.role not in [models.RoleEnum.manager, models.RoleEnum.hr_admin, models.RoleEnum.employer]):
        raise HTTPException(status_code=403, detail="Permission insuffisante")
    
    # Vérifier que c'est la même entreprise
    if db_leave.employee.company_id != current_user.company_id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    # Seules les demandes pending peuvent être annulées
    if db_leave.status != models.LeaveStatusEnum.pending:
        raise HTTPException(status_code=400, detail="Seules les demandes en attente peuvent être annulées")
    
    db.delete(db_leave)
    db.commit()
    
    return {"message": "Demande annulée"}