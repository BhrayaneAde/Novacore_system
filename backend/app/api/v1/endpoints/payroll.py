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

@router.get("/payslips/{employee_id}/{period}")
async def get_payslip(
    employee_id: int = None,
    period: str = "recent",
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupérer les bulletins de paie"""
    if employee_id:
        return crud_payroll.get_payroll_by_employee(db, employee_id)
    else:
        # Retourner les bulletins récents de l'entreprise
        return crud_payroll.get_payroll_records(db, current_user.company_id, limit=10)

@router.get("/attendance/{year}/{month}")
async def get_attendance_data(
    year: int,
    month: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_hr_admin)
):
    """Récupérer les données de présence pour la paie"""
    from app.crud import crud_attendance
    # Simuler des données de présence pour le calcul de paie
    employees = crud_employee.get_employees_by_company(db, current_user.company_id)
    attendance_data = []
    
    for emp in employees:
        attendance_records = crud_attendance.get_attendance_by_employee(db, emp.id)
        total_hours = sum((record.total_hours or 0) for record in attendance_records)
        attendance_data.append({
            "employee_id": emp.id,
            "total_hours": total_hours,
            "attendance_rate": 95.0  # Simulation
        })
    
    return attendance_data

@router.get("/overtime/{year}/{month}")
async def get_overtime_data(
    year: int,
    month: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_hr_admin)
):
    """Récupérer les données d'heures supplémentaires"""
    employees = crud_employee.get_employees_by_company(db, current_user.company_id)
    overtime_data = []
    
    for emp in employees:
        # Simulation des heures supplémentaires
        overtime_data.append({
            "employee_id": emp.id,
            "total_hours": 5.0  # Simulation
        })
    
    return overtime_data

@router.get("/leaves/{year}/{month}")
async def get_leave_data(
    year: int,
    month: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_hr_admin)
):
    """Récupérer les données de congés pour la paie"""
    from app.crud import crud_leave
    leaves = crud_leave.get_leaves_by_company(db, current_user.company_id)
    
    # Filtrer par mois/année et grouper par employé
    leave_data = []
    for leave in leaves:
        if leave.status == "approved":
            leave_data.append({
                "employee_id": leave.employee_id,
                "leave_type": leave.leave_type,
                "days": leave.days or 1
            })
    
    return leave_data

@router.post("/payslips/generate")
async def generate_payslip(
    payslip_data: dict,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_hr_admin)
):
    """Générer un bulletin de paie"""
    # Créer un enregistrement de paie
    payroll_record = payroll_schema.PayrollRecordCreate(
        employee_id=payslip_data["employee_id"],
        pay_period=payslip_data["period"],
        gross_salary=payslip_data["calculation"]["gross_salary"],
        net_salary=payslip_data["calculation"]["net_salary"],
        processed_by_id=current_user.id
    )
    
    return crud_payroll.create_payroll_record(db=db, payroll=payroll_record)

@router.post("/finalize")
async def finalize_payroll(
    finalize_data: dict,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_hr_admin)
):
    """Finaliser le traitement de la paie"""
    # Marquer la période comme finalisée
    return {
        "status": "finalized",
        "period": finalize_data["period"],
        "total_employees": finalize_data["total_employees"],
        "total_cost": finalize_data["total_cost"]
    }