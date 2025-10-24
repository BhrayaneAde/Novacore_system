from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import payroll as payroll_schema
from app.crud import crud_payroll, crud_employee

router = APIRouter()

@router.get("/", response_model=List[payroll_schema.PayrollRecord])
async def read_payroll_records(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_hr_admin)
):
    return crud_payroll.get_payroll_records(db, company_id=current_user.company_id, skip=skip, limit=limit)

@router.post("/", response_model=payroll_schema.PayrollRecord, status_code=status.HTTP_201_CREATED)
async def create_payroll_record(
    payroll_in: payroll_schema.PayrollRecordCreate,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    employee = crud_employee.get_employee(db, payroll_in.employee_id)
    if not employee or employee.company_id != current_admin.company_id:
        raise HTTPException(status_code=404, detail="Employé non trouvé")
    payroll_in.processed_by_id = current_admin.id
    return crud_payroll.create_payroll_record(db=db, payroll=payroll_in)

@router.put("/{payroll_id}", response_model=payroll_schema.PayrollRecord)
async def update_payroll_record(
    payroll_id: int,
    payroll_in: payroll_schema.PayrollRecordUpdate,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    db_payroll = crud_payroll.get_payroll_record(db, payroll_id)
    if not db_payroll:
        raise HTTPException(status_code=404, detail="Enregistrement paie non trouvé")
    return crud_payroll.update_payroll_record(db=db, db_payroll=db_payroll, payroll_in=payroll_in)