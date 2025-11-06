from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.db import models
from app.core.auth import get_current_user

router = APIRouter()

@router.get("/employees")
async def get_employees_for_payroll(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Récupérer tous les employés avec leurs données de paie"""
    try:
        employees = db.query(models.Employee).filter(
            models.Employee.company_id == current_user.company_id,
            models.Employee.status == "active"
        ).all()
        
        # Récupérer les variables actives
        variables = db.query(models.PayrollVariable).filter(
            models.PayrollVariable.company_id == current_user.company_id,
            models.PayrollVariable.is_active == True
        ).order_by(models.PayrollVariable.display_order).all()
        
        result = []
        for emp in employees:
            # Récupérer les données de paie existantes
            payroll_data = db.query(models.EmployeePayrollData).filter(
                models.EmployeePayrollData.employee_id == emp.id
            ).all()
            
            emp_data = {
                "id": emp.id,
                "name": emp.name,
                "email": emp.email,
                "role": emp.role,
                "department": emp.department.name if emp.department else None,
                "hire_date": emp.hire_date.isoformat() if emp.hire_date else None,
                "salary": emp.salary,
                "payroll_variables": {}
            }
            
            # Organiser les données par variable
            for data in payroll_data:
                emp_data["payroll_variables"][data.variable_code] = data.value
            
            result.append(emp_data)
        
        return {
            "employees": result,
            "variables": [
                {
                    "code": v.code,
                    "name": v.name,
                    "type": v.variable_type,
                    "calculation_method": v.calculation_method,
                    "is_mandatory": v.is_mandatory
                } for v in variables
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/employees/{employee_id}/payroll")
async def update_employee_payroll(
    employee_id: int,
    payroll_data: Dict[str, float],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Mettre à jour les données de paie d'un employé"""
    try:
        # Vérifier que l'employé appartient à l'entreprise
        employee = db.query(models.Employee).filter(
            models.Employee.id == employee_id,
            models.Employee.company_id == current_user.company_id
        ).first()
        
        if not employee:
            raise HTTPException(status_code=404, detail="Employé non trouvé")
        
        # Supprimer les anciennes données
        db.query(models.EmployeePayrollData).filter(
            models.EmployeePayrollData.employee_id == employee_id
        ).delete()
        
        # Ajouter les nouvelles données
        for variable_code, value in payroll_data.items():
            if value is not None and value != 0:
                new_data = models.EmployeePayrollData(
                    employee_id=employee_id,
                    variable_code=variable_code,
                    value=value,
                    period="current"
                )
                db.add(new_data)
        
        db.commit()
        return {"message": "Données de paie mises à jour"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/bulk-update")
async def bulk_update_payroll(
    updates: List[Dict[str, Any]],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Mise à jour en lot des données de paie"""
    try:
        for update in updates:
            employee_id = update["employee_id"]
            payroll_data = update["payroll_data"]
            
            # Vérifier l'employé
            employee = db.query(models.Employee).filter(
                models.Employee.id == employee_id,
                models.Employee.company_id == current_user.company_id
            ).first()
            
            if employee:
                # Supprimer anciennes données
                db.query(models.EmployeePayrollData).filter(
                    models.EmployeePayrollData.employee_id == employee_id
                ).delete()
                
                # Ajouter nouvelles données
                for variable_code, value in payroll_data.items():
                    if value is not None and value != 0:
                        new_data = models.EmployeePayrollData(
                            employee_id=employee_id,
                            variable_code=variable_code,
                            value=value,
                            period="current"
                        )
                        db.add(new_data)
        
        db.commit()
        return {"message": f"{len(updates)} employés mis à jour"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))