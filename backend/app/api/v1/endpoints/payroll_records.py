from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.database import get_db
from app.db import models
from app.core.auth import get_current_user

router = APIRouter()

@router.post("/bulk-create")
async def create_payroll_records_bulk(
    records: List[Dict[str, Any]],
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Créer plusieurs enregistrements de paie en lot"""
    try:
        created_records = []
        
        for record_data in records:
            # Vérifier que l'employé appartient à l'entreprise
            employee = db.query(models.Employee).filter(
                models.Employee.id == record_data["employee_id"],
                models.Employee.company_id == current_user.company_id
            ).first()
            
            if not employee:
                continue
            
            # Supprimer l'ancien enregistrement pour la même période
            existing_record = db.query(models.PayrollRecord).filter(
                models.PayrollRecord.employee_id == record_data["employee_id"],
                models.PayrollRecord.period == record_data["period"]
            ).first()
            
            if existing_record:
                db.delete(existing_record)
            
            # Créer le nouvel enregistrement
            payroll_record = models.PayrollRecord(
                employee_id=record_data["employee_id"],
                period=record_data["period"],
                gross_salary=record_data["gross_salary"],
                total_allowances=record_data["total_allowances"],
                total_deductions=record_data["total_deductions"],
                taxable_income=record_data["taxable_income"],
                tax_amount=record_data["tax_amount"],
                social_contributions=record_data["social_contributions"],
                net_salary=record_data["net_salary"],
                salary_breakdown=record_data["salary_breakdown"],
                status=record_data.get("status", "draft"),
                processed_by_id=current_user.id
            )
            
            db.add(payroll_record)
            created_records.append(payroll_record)
        
        db.commit()
        
        return {
            "message": f"{len(created_records)} enregistrements de paie créés",
            "records_count": len(created_records)
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_payroll_records(
    period: str = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Récupérer les enregistrements de paie"""
    try:
        query = db.query(models.PayrollRecord).join(models.Employee).filter(
            models.Employee.company_id == current_user.company_id
        )
        
        if period:
            query = query.filter(models.PayrollRecord.period == period)
        
        records = query.order_by(models.PayrollRecord.created_at.desc()).all()
        
        result = []
        for record in records:
            try:
                result.append({
                    "id": record.id,
                    "employee_id": record.employee_id,
                    "employee_name": record.employee.name if record.employee else "Unknown",
                    "period": record.period,
                    "gross_salary": record.gross_salary,
                    "net_salary": record.net_salary,
                    "total_allowances": record.total_allowances,
                    "total_deductions": record.total_deductions,
                    "status": record.status,
                    "salary_breakdown": record.salary_breakdown,
                    "created_at": record.created_at.isoformat() if record.created_at else None
                })
            except Exception as record_error:
                print(f"Error processing record {record.id}: {record_error}")
                continue
        
        return {"records": result}
        
    except Exception as e:
        print(f"Payroll records error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_payroll_stats(
    period: str = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Statistiques de paie pour le dashboard"""
    try:
        query = db.query(models.PayrollRecord).join(models.Employee).filter(
            models.Employee.company_id == current_user.company_id
        )
        
        if period:
            query = query.filter(models.PayrollRecord.period == period)
        else:
            # Période courante par défaut
            current_period = datetime.now().strftime("%Y-%m")
            query = query.filter(models.PayrollRecord.period == current_period)
        
        records = query.all()
        
        if not records:
            return {
                "total_payroll": 0,
                "employee_count": 0,
                "average_salary": 0,
                "processed_count": 0,
                "pending_count": 0
            }
        
        total_payroll = sum(r.net_salary for r in records)
        employee_count = len(records)
        average_salary = total_payroll / employee_count if employee_count > 0 else 0
        processed_count = len([r for r in records if r.status in ["validated", "paid"]])
        pending_count = len([r for r in records if r.status == "draft"])
        
        return {
            "total_payroll": round(total_payroll),
            "employee_count": employee_count,
            "average_salary": round(average_salary),
            "processed_count": processed_count,
            "pending_count": pending_count
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))