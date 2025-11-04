from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import payroll as payroll_schema
from app.schemas import payroll_config as config_schema
from app.crud import crud_payroll, crud_employee
from app.core.payroll_engine import PayrollCalculationEngine
from app.core.auth import get_current_user

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

@router.post("/calculate", response_model=config_schema.PayrollCalculationResult)
async def calculate_employee_payroll(
    calculation_request: config_schema.PayrollCalculationRequest,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Calculer la paie d'un employé avec le moteur dynamique"""
    
    # Vérifier que l'employé appartient à l'entreprise
    employee = db.query(models.Employee).filter(
        models.Employee.id == calculation_request.employee_id,
        models.Employee.company_id == current_user.company_id
    ).first()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employé non trouvé")
    
    # Initialiser le moteur de calcul
    engine = PayrollCalculationEngine(db, current_user.company_id)
    
    # Valider les entrées
    validation_errors = engine.validate_calculation_inputs(calculation_request.variable_values)
    if validation_errors:
        raise HTTPException(status_code=400, detail={"errors": validation_errors})
    
    # Calculer la paie
    try:
        result = engine.calculate_payroll(
            calculation_request.employee_id,
            calculation_request.period,
            calculation_request.variable_values
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur de calcul: {str(e)}")

@router.post("/calculate/batch")
async def calculate_batch_payroll(
    employee_ids: List[int],
    period: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Calculer la paie pour plusieurs employés"""
    
    engine = PayrollCalculationEngine(db, current_user.company_id)
    results = []
    errors = []
    
    for employee_id in employee_ids:
        try:
            # Récupérer les valeurs par défaut de l'employé
            employee_data = db.query(models.EmployeePayrollData).filter(
                models.EmployeePayrollData.employee_id == employee_id,
                models.EmployeePayrollData.period == period
            ).all()
            
            variable_values = {data.variable_code: data.value for data in employee_data}
            
            # Ajouter le salaire de base depuis l'employé
            employee = db.query(models.Employee).filter(
                models.Employee.id == employee_id
            ).first()
            
            if employee and employee.salary:
                variable_values["SB"] = employee.salary
            
            result = engine.calculate_payroll(employee_id, period, variable_values)
            results.append(result)
            
        except Exception as e:
            errors.append({"employee_id": employee_id, "error": str(e)})
    
    return {
        "period": period,
        "successful_calculations": len(results),
        "errors": len(errors),
        "results": results,
        "error_details": errors
    }

@router.post("/save-calculation", response_model=payroll_schema.PayrollRecord)
async def save_payroll_calculation(
    calculation_result: config_schema.PayrollCalculationResult,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Sauvegarder un calcul de paie en base"""
    
    # Vérifier si un enregistrement existe déjà
    existing = db.query(models.PayrollRecord).filter(
        models.PayrollRecord.employee_id == calculation_result.employee_id,
        models.PayrollRecord.period == calculation_result.period
    ).first()
    
    if existing:
        # Mettre à jour
        existing.gross_salary = calculation_result.gross_salary
        existing.total_allowances = calculation_result.total_allowances
        existing.total_deductions = calculation_result.total_deductions
        existing.taxable_income = calculation_result.taxable_income
        existing.tax_amount = calculation_result.tax_amount
        existing.social_contributions = calculation_result.social_contributions
        existing.net_salary = calculation_result.net_salary
        existing.salary_breakdown = calculation_result.salary_breakdown
        existing.processed_by_id = current_user.id
        
        db.commit()
        db.refresh(existing)
        return existing
    else:
        # Créer nouveau
        new_record = models.PayrollRecord(
            employee_id=calculation_result.employee_id,
            period=calculation_result.period,
            gross_salary=calculation_result.gross_salary,
            total_allowances=calculation_result.total_allowances,
            total_deductions=calculation_result.total_deductions,
            taxable_income=calculation_result.taxable_income,
            tax_amount=calculation_result.tax_amount,
            social_contributions=calculation_result.social_contributions,
            net_salary=calculation_result.net_salary,
            salary_breakdown=calculation_result.salary_breakdown,
            processed_by_id=current_user.id
        )
        
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return new_record

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