from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime

from ....db.database import get_db
from ....db.models import Employee, PayrollRecord, PayrollConfig
from ....services.payroll_calculator import PayrollCalculator
from ....core.auth import get_current_user

router = APIRouter()

@router.post("/calculate-batch")
async def calculate_batch_payroll(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Calcul par lot des salaires pour une période"""
    try:
        period = payload.get("period")
        employees_data = payload.get("employees", [])
        
        # Si pas d'employés fournis, charger tous les employés actifs
        if not employees_data:
            employees = db.query(Employee).filter(
                Employee.company_id == current_user.company_id,
                Employee.status == "active"
            ).all()
            employees_data = [{"employee_id": emp.id} for emp in employees]
        
        # Charger la configuration de paie
        config = db.query(PayrollConfig).filter(
            PayrollConfig.company_id == current_user.company_id,
            PayrollConfig.is_active == True
        ).first()
        
        calculations = []
        
        for emp_data in employees_data:
            employee_id = emp_data.get("employee_id")
            
            # Charger l'employé
            employee = db.query(Employee).filter(
                Employee.id == employee_id,
                Employee.company_id == current_user.company_id
            ).first()
            
            if not employee or not employee.salary:
                continue
            
            if config:
                # Utiliser le moteur de calcul complexe si config existe
                try:
                    calculator = PayrollCalculator()
                    calculation = calculator.calculate_employee_payroll({
                        "employee_id": employee_id,
                        "employee_name": employee.name,
                        "base_salary": employee.salary,
                        "overtime_hours": emp_data.get("variable_data", {}).get("overtime_hours", 0),
                        "absence_hours": emp_data.get("attendance_data", {}).get("absence_hours", 0),
                        "period": period
                    })
                    
                    calculations.append({
                        "employee_id": employee_id,
                        "employee_name": employee.name,
                        **calculation
                    })
                except Exception:
                    # Fallback vers calcul simple si erreur
                    pass
            
            # Calcul simple par défaut
            if not any(calc["employee_id"] == employee_id for calc in calculations):
                base_salary = employee.salary
                prime_transport = 25000
                prime_fonction = base_salary * 0.1
                gross_salary = base_salary + prime_transport + prime_fonction
                cnss_employee = gross_salary * 0.036
                taxable_income = gross_salary - cnss_employee
                irpp = max(0, (taxable_income - 30000) * 0.05) if taxable_income <= 50000 else 1000 + (taxable_income - 50000) * 0.1
                net_salary = gross_salary - cnss_employee - irpp
                
                calculations.append({
                    "employee_id": employee_id,
                    "employee_name": employee.name,
                    "gross_salary": round(gross_salary),
                    "net_salary": round(net_salary),
                    "total_allowances": round(prime_transport + prime_fonction),
                    "total_deductions": round(cnss_employee + irpp),
                    "taxable_income": round(taxable_income),
                    "tax_amount": round(irpp),
                    "social_contributions": round(cnss_employee),
                    "breakdown": {
                        "salaire_base": base_salary,
                        "prime_transport": prime_transport,
                        "prime_fonction": round(prime_fonction),
                        "cnss_employe": round(cnss_employee),
                        "irpp": round(irpp)
                    }
                })
        
        return {"calculations": calculations}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/validate-batch")
async def validate_batch_payroll(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Validation et sauvegarde des calculs de paie"""
    try:
        period = payload.get("period")
        calculations = payload.get("calculations", [])
        
        for calc in calculations:
            # Supprimer l'ancien enregistrement s'il existe
            existing = db.query(PayrollRecord).filter(
                PayrollRecord.employee_id == calc["employee_id"],
                PayrollRecord.period == period
            ).first()
            
            if existing:
                db.delete(existing)
            
            # Créer le nouvel enregistrement
            record = PayrollRecord(
                employee_id=calc["employee_id"],
                period=period,
                gross_salary=calc["gross_salary"],
                total_allowances=calc.get("total_allowances", 0),
                total_deductions=calc.get("total_deductions", 0),
                taxable_income=calc["taxable_income"],
                tax_amount=calc["tax_amount"],
                social_contributions=calc["social_contributions"],
                net_salary=calc["net_salary"],
                salary_breakdown=calc.get("breakdown", {}),
                status="validated",
                processed_date=datetime.utcnow(),
                validated_date=datetime.utcnow(),
                processed_by_id=current_user.id,
                validated_by_id=current_user.id
            )
            
            db.add(record)
        
        db.commit()
        return {"message": f"Paie validée pour {len(calculations)} employé(s)"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/processing-status/{period}")
async def get_processing_status(
    period: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Statut du traitement pour une période"""
    try:
        # Compter les employés actifs
        total_employees = db.query(Employee).filter(
            Employee.company_id == current_user.company_id,
            Employee.status == "active"
        ).count()
        
        # Compter les enregistrements de paie pour la période
        processed_count = db.query(PayrollRecord).filter(
            PayrollRecord.period == period
        ).join(Employee).filter(
            Employee.company_id == current_user.company_id
        ).count()
        
        validated_count = db.query(PayrollRecord).filter(
            PayrollRecord.period == period,
            PayrollRecord.status == "validated"
        ).join(Employee).filter(
            Employee.company_id == current_user.company_id
        ).count()
        
        return {
            "total_employees": total_employees,
            "processed_count": processed_count,
            "validated_count": validated_count,
            "pending_count": total_employees - processed_count,
            "completion_rate": (processed_count / total_employees * 100) if total_employees > 0 else 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))