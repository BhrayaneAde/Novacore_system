from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime
import io
import base64

from ....db.database import get_db
from ....db.models import Employee, PayrollRecord, Company
from ....services.pdf_generator import PayslipPDFGenerator as PayslipGenerator
from ....core.auth import get_current_user

router = APIRouter()

@router.get("/payslip/{employee_id}/{period}")
async def generate_payslip(
    employee_id: int,
    period: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Génère le bulletin de paie PDF d'un employé"""
    try:
        # Récupérer l'employé
        employee = db.query(Employee).filter(
            Employee.id == employee_id,
            Employee.company_id == current_user.company_id
        ).first()
        
        if not employee:
            raise HTTPException(status_code=404, detail="Employé non trouvé")
        
        # Récupérer l'enregistrement de paie
        payroll_record = db.query(PayrollRecord).filter(
            PayrollRecord.employee_id == employee_id,
            PayrollRecord.period == period
        ).first()
        
        if not payroll_record:
            raise HTTPException(status_code=404, detail="Enregistrement de paie non trouvé")
        
        # Récupérer les infos entreprise
        company = db.query(Company).filter(Company.id == current_user.company_id).first()
        company_info = {
            'name': company.name if company else 'Entreprise',
            'address': 'Adresse entreprise'
        }
        
        # Préparer les données
        employee_data = {
            'id': employee.id,
            'name': employee.name,
            'role': employee.role,
            'department': employee.department.name if employee.department else '',
            'marital_status': employee.marital_status
        }
        
        payroll_data = {
            'gross_salary': payroll_record.gross_salary,
            'taxable_income': payroll_record.taxable_income,
            'tax_amount': payroll_record.tax_amount,
            'net_salary': payroll_record.net_salary,
            'total_cost': payroll_record.gross_salary + (payroll_record.salary_breakdown or {}).get('cnss_employer', 0),
            'breakdown': payroll_record.salary_breakdown or {}
        }
        
        # Générer le PDF
        generator = PayslipGenerator(company_info)
        pdf_content = generator.generate_payslip(employee_data, payroll_data, period)
        
        return StreamingResponse(
            io.BytesIO(pdf_content),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=bulletin_{employee.name}_{period}.pdf"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/journal/{period}")
async def generate_payroll_journal(
    period: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Génère le journal de paie PDF"""
    try:
        # Récupérer tous les enregistrements de paie de la période
        payroll_records = db.query(PayrollRecord).join(Employee).filter(
            Employee.company_id == current_user.company_id,
            PayrollRecord.period == period
        ).all()
        
        if not payroll_records:
            raise HTTPException(status_code=404, detail="Aucun enregistrement trouvé")
        
        # Préparer les données
        records_data = []
        for record in payroll_records:
            records_data.append({
                'employee_name': record.employee.name,
                'gross_salary': record.gross_salary,
                'tax_amount': record.tax_amount,
                'net_salary': record.net_salary,
                'salary_breakdown': record.salary_breakdown or {}
            })
        
        # Récupérer les infos entreprise
        company = db.query(Company).filter(Company.id == current_user.company_id).first()
        company_info = {
            'name': company.name if company else 'Entreprise',
            'address': 'Adresse entreprise'
        }
        
        # Générer le PDF
        generator = PayslipGenerator(company_info)
        pdf_content = generator.generate_payroll_journal(records_data, period)
        
        return StreamingResponse(
            io.BytesIO(pdf_content),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=journal_paie_{period}.pdf"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/send-payslips/{period}")
async def send_payslips_by_email(
    period: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Envoie les bulletins de paie par email"""
    try:
        # Récupérer tous les employés avec paie validée
        payroll_records = db.query(PayrollRecord).join(Employee).filter(
            Employee.company_id == current_user.company_id,
            PayrollRecord.period == period,
            PayrollRecord.status == "validated"
        ).all()
        
        sent_count = 0
        errors = []
        
        for record in payroll_records:
            try:
                # Générer le bulletin
                employee_data = {
                    'id': record.employee.id,
                    'name': record.employee.name,
                    'role': record.employee.role,
                    'department': record.employee.department.name if record.employee.department else '',
                    'marital_status': record.employee.marital_status
                }
                
                company = db.query(Company).filter(Company.id == current_user.company_id).first()
                company_info = {'name': company.name if company else 'Entreprise', 'address': ''}
                
                payroll_data = {
                    'gross_salary': record.gross_salary,
                    'taxable_income': record.taxable_income,
                    'tax_amount': record.tax_amount,
                    'net_salary': record.net_salary,
                    'total_cost': record.gross_salary + (record.salary_breakdown or {}).get('cnss_employer', 0),
                    'breakdown': record.salary_breakdown or {}
                }
                
                generator = PayslipGenerator(company_info)
                pdf_content = generator.generate_payslip(employee_data, payroll_data, period)
                
                # TODO: Intégrer service email
                # await send_email_with_attachment(
                #     to=record.employee.email,
                #     subject=f"Bulletin de paie {period}",
                #     body="Veuillez trouver ci-joint votre bulletin de paie.",
                #     attachment=pdf_content,
                #     filename=f"bulletin_{record.employee.name}_{period}.pdf"
                # )
                
                sent_count += 1
                
            except Exception as e:
                errors.append(f"{record.employee.name}: {str(e)}")
        
        return {
            "message": f"Bulletins envoyés: {sent_count}",
            "sent_count": sent_count,
            "errors": errors
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics/{period}")
async def get_payroll_analytics(
    period: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Analyse des coûts salariaux par département"""
    try:
        # Récupérer les données par département
        from sqlalchemy import func
        
        results = db.query(
            Employee.department_id,
            func.count(PayrollRecord.id).label('employee_count'),
            func.sum(PayrollRecord.gross_salary).label('total_gross'),
            func.sum(PayrollRecord.net_salary).label('total_net'),
            func.avg(PayrollRecord.net_salary).label('avg_salary')
        ).join(PayrollRecord).filter(
            Employee.company_id == current_user.company_id,
            PayrollRecord.period == period
        ).group_by(Employee.department_id).all()
        
        analytics = []
        for result in results:
            dept = db.query(Employee).filter(Employee.department_id == result.department_id).first()
            dept_name = dept.department.name if dept and dept.department else 'Non assigné'
            
            analytics.append({
                'department': dept_name,
                'employee_count': result.employee_count,
                'total_gross': float(result.total_gross or 0),
                'total_net': float(result.total_net or 0),
                'average_salary': float(result.avg_salary or 0)
            })
        
        return {'analytics': analytics}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/export-accounting/{period}")
async def export_accounting_data(
    period: str,
    format: str = "csv",
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Export des données comptables"""
    try:
        payroll_records = db.query(PayrollRecord).join(Employee).filter(
            Employee.company_id == current_user.company_id,
            PayrollRecord.period == period
        ).all()
        
        if format == "csv":
            import csv
            output = io.StringIO()
            writer = csv.writer(output)
            
            # En-têtes
            writer.writerow([
                'Employé', 'Salaire Brut', 'CNSS Employé', 'IRPP', 
                'Net à Payer', 'CNSS Patronale', 'Coût Total'
            ])
            
            # Données
            for record in payroll_records:
                breakdown = record.salary_breakdown or {}
                writer.writerow([
                    record.employee.name,
                    record.gross_salary,
                    breakdown.get('cnss_employee', 0),
                    record.tax_amount,
                    record.net_salary,
                    breakdown.get('cnss_employer', 0),
                    breakdown.get('cout_total', 0)
                ])
            
            output.seek(0)
            return StreamingResponse(
                io.StringIO(output.getvalue()),
                media_type="text/csv",
                headers={"Content-Disposition": f"attachment; filename=export_paie_{period}.csv"}
            )
        
        return {"message": "Format non supporté"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))