from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime, date
import asyncio

from app.db.database import get_db
from app.db.models import PayrollVariable, EmployeePayrollData
from app.schemas.payroll_calculation import (
    PayrollCalculationRequest,
    PayrollCalculationResult,
    PayrollCalculationStatus,
    EmployeeCalculation
)
from app.core.auth import get_current_user
from app.services.payroll_calculator import PayrollCalculator as RealPayrollCalculator

router = APIRouter()

@router.post("/calculate", response_model=PayrollCalculationStatus)
async def start_payroll_calculation(
    request: PayrollCalculationRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Lance le calcul de paie avec le vrai moteur"""
    
    calculator = RealPayrollCalculator()
    
    # Données d'employés avec informations complètes
    mock_employees = [
        {
            "employee_id": 1,
            "employee_name": "Jean Dupont",
            "base_salary": 800000,  # 800k FCFA
            "overtime_hours": 10,
            "absence_hours": 0,
            "period": request.period
        },
        {
            "employee_id": 2,
            "employee_name": "Marie Martin",
            "base_salary": 1200000,  # 1.2M FCFA
            "overtime_hours": 5,
            "absence_hours": 8,
            "period": request.period
        },
        {
            "employee_id": 3,
            "employee_name": "Pierre Durand",
            "base_salary": 2500000,  # 2.5M FCFA
            "overtime_hours": 0,
            "absence_hours": 0,
            "period": request.period
        }
    ]
    
    # Filtrage des employés si spécifié
    employees_to_process = [
        emp for emp in mock_employees 
        if not request.employee_ids or emp["employee_id"] in request.employee_ids
    ]
    
    # Calcul batch
    results = calculator.calculate_batch_payroll(employees_to_process)
    
    return PayrollCalculationStatus(
        calculation_id=f"calc_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        status="completed",
        total_employees=results["employees_count"],
        completed_employees=results["employees_count"],
        failed_employees=0,
        calculations=results["calculations"],
        started_at=datetime.now(),
        completed_at=datetime.now()
    )

@router.get("/status/{calculation_id}", response_model=PayrollCalculationStatus)
async def get_calculation_status(
    calculation_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Récupère le statut d'un calcul de paie"""
    
    return PayrollCalculationStatus(
        calculation_id=calculation_id,
        status="completed",
        total_employees=3,
        completed_employees=3,
        failed_employees=0,
        calculations=[],
        started_at=datetime.now(),
        completed_at=datetime.now()
    )

@router.get("/history", response_model=List[PayrollCalculationStatus])
async def get_calculation_history(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Récupère l'historique des calculs de paie"""
    
    return []

@router.get("/irpp-breakdown/{taxable_income}", response_model=List[Dict[str, Any]])
async def get_irpp_breakdown(
    taxable_income: float,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Retourne le détail du calcul IRPP par tranche"""
    
    calculator = RealPayrollCalculator()
    breakdown = calculator.get_irpp_breakdown(taxable_income)
    
    return breakdown

@router.post("/batch-calculate", response_model=Dict[str, Any])
async def batch_calculate_payroll(
    employees_data: List[Dict[str, Any]],
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Calcule la paie pour plusieurs employés"""
    
    calculator = RealPayrollCalculator()
    results = calculator.calculate_batch_payroll(employees_data)
    
    return results

@router.post("/validate", response_model=Dict[str, Any])
async def validate_payroll_data(
    period: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Valide les données avant calcul de paie"""
    
    errors = []
    warnings = []
    
    # Vérification des variables de paie
    variables = db.query(PayrollVariable).filter(
        PayrollVariable.is_active == True
    ).all()
    
    if not variables:
        warnings.append("Aucune variable de paie configurée - utilisation des calculs standards")
    
    return {
        "is_valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "validation_date": datetime.now().isoformat()
    }