from typing import List, Dict, Any
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.crud import crud_employee, crud_attendance, crud_payroll
import io
import csv
import json

router = APIRouter()

@router.post("/generate")
async def generate_report(
    report_data: Dict[str, Any],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_hr_admin)
):
    """Générer un rapport"""
    report_id = report_data.get("report_id")
    period = report_data.get("period", "month")
    
    if report_id == "employee-overview":
        employees = crud_employee.get_employees_by_company(db, current_user.company_id)
        data = [
            {
                "id": emp.id,
                "name": f"{emp.first_name} {emp.last_name}",
                "department": emp.department,
                "position": emp.position,
                "hire_date": emp.hire_date.isoformat() if emp.hire_date else None,
                "salary": emp.salary,
                "status": emp.status
            }
            for emp in employees
        ]
    elif report_id == "attendance-summary":
        # Récupérer les données de présence
        employees = crud_employee.get_employees_by_company(db, current_user.company_id)
        data = []
        for emp in employees:
            attendance_records = crud_attendance.get_attendance_by_employee(db, emp.id)
            total_hours = sum(
                (record.total_hours or 0) for record in attendance_records
            )
            data.append({
                "employee_id": emp.id,
                "employee_name": f"{emp.first_name} {emp.last_name}",
                "department": emp.department,
                "total_hours": total_hours,
                "attendance_rate": 95.0  # Calcul simplifié
            })
    elif report_id == "payroll-summary":
        # Récupérer les données de paie
        payroll_records = crud_payroll.get_payroll_records(db, current_user.company_id)
        data = [
            {
                "employee_id": record.employee_id,
                "employee_name": record.employee.first_name + " " + record.employee.last_name,
                "gross_salary": record.gross_salary,
                "net_salary": record.net_salary,
                "period": record.pay_period,
                "processed_date": record.processed_date.isoformat() if record.processed_date else None
            }
            for record in payroll_records
        ]
    else:
        raise HTTPException(status_code=400, detail="Type de rapport non supporté")
    
    return {"status": "success", "data": data, "url": f"/reports/view/{report_id}"}

@router.post("/export")
async def export_report(
    export_data: Dict[str, Any],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_hr_admin)
):
    """Exporter un rapport"""
    report_id = export_data.get("report_id")
    format_type = export_data.get("format", "CSV")
    
    # Générer les données
    report_response = await generate_report(export_data, db, current_user)
    data = report_response["data"]
    
    if format_type.upper() == "CSV":
        # Créer un CSV
        output = io.StringIO()
        if data:
            writer = csv.DictWriter(output, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)
        
        csv_content = output.getvalue()
        output.close()
        
        return StreamingResponse(
            io.BytesIO(csv_content.encode('utf-8')),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={report_id}.csv"}
        )
    
    elif format_type.upper() == "JSON":
        json_content = json.dumps(data, indent=2, ensure_ascii=False)
        return StreamingResponse(
            io.BytesIO(json_content.encode('utf-8')),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={report_id}.json"}
        )
    
    else:
        raise HTTPException(status_code=400, detail="Format non supporté")

@router.get("/history")
async def get_report_history(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_hr_admin)
):
    """Récupérer l'historique des rapports"""
    # Pour l'instant, retourner un historique simulé
    return [
        {
            "id": 1,
            "name": "Rapport mensuel des présences",
            "generated_by": f"{current_user.first_name} {current_user.last_name}",
            "date": "2025-01-20",
            "format": "PDF",
            "size": "2.4 MB"
        },
        {
            "id": 2,
            "name": "Analyse des coûts RH Q4",
            "generated_by": f"{current_user.first_name} {current_user.last_name}",
            "date": "2025-01-18",
            "format": "Excel",
            "size": "1.8 MB"
        }
    ]