from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import io

from app.db.database import get_db
from app.db.models import PayrollVariable, EmployeePayrollData
from app.schemas.payslips import (
    PayslipCreate,
    PayslipResponse,
    PayslipUpdate,
    PayslipStatus,
    PayslipGenerate
)
from app.core.auth import get_current_user

router = APIRouter()

@router.post("/generate", response_model=dict)
async def generate_payslips(
    request: PayslipGenerate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Génère les bulletins de paie pour une période donnée"""
    
    # Simulation de génération
    mock_employees = [
        {"id": 1, "name": "Jean Dupont", "base_salary": 50000},
        {"id": 2, "name": "Marie Martin", "base_salary": 45000},
        {"id": 3, "name": "Pierre Durand", "base_salary": 60000}
    ]
    
    generated_payslips = []
    
    for employee in mock_employees:
        if not request.employee_ids or employee["id"] in request.employee_ids:
            payslip = {
                "id": f"{employee['id']}_{request.period}",
                "employee_id": employee["id"],
                "employee_name": employee["name"],
                "period": request.period,
                "base_salary": employee["base_salary"],
                "gross_salary": employee["base_salary"] * 1.05,  # +5% primes
                "net_salary": employee["base_salary"] * 0.75,    # -25% charges
                "deductions": employee["base_salary"] * 0.25,
                "status": "generated",
                "generated_at": datetime.now().isoformat()
            }
            generated_payslips.append(payslip)
    
    return {
        "message": f"{len(generated_payslips)} bulletins générés avec succès",
        "payslips": generated_payslips,
        "period": request.period
    }

@router.get("/", response_model=List[PayslipResponse])
async def get_payslips(
    period: Optional[str] = None,
    status: Optional[str] = None,
    employee_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Récupère la liste des bulletins de paie avec filtres"""
    
    # Simulation des bulletins
    mock_payslips = [
        {
            "id": 1,
            "employee_id": 1,
            "employee_name": "Jean Dupont",
            "period": "2024-03",
            "base_salary": 50000,
            "gross_salary": 52500,
            "net_salary": 39375,
            "deductions": 13125,
            "status": "generated",
            "generated_at": "2024-03-01T10:00:00Z",
            "sent_at": None
        },
        {
            "id": 2,
            "employee_id": 2,
            "employee_name": "Marie Martin",
            "period": "2024-03",
            "base_salary": 45000,
            "gross_salary": 47250,
            "net_salary": 35437,
            "deductions": 11813,
            "status": "sent",
            "generated_at": "2024-03-01T10:00:00Z",
            "sent_at": "2024-03-02T14:30:00Z"
        }
    ]
    
    # Application des filtres
    filtered_payslips = mock_payslips
    
    if period:
        filtered_payslips = [p for p in filtered_payslips if p["period"] == period]
    
    if status:
        filtered_payslips = [p for p in filtered_payslips if p["status"] == status]
    
    if employee_id:
        filtered_payslips = [p for p in filtered_payslips if p["employee_id"] == employee_id]
    
    return filtered_payslips

@router.get("/{payslip_id}", response_model=PayslipResponse)
async def get_payslip(
    payslip_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Récupère un bulletin de paie spécifique"""
    
    # Simulation
    mock_payslip = {
        "id": payslip_id,
        "employee_id": 1,
        "employee_name": "Jean Dupont",
        "period": "2024-03",
        "base_salary": 50000,
        "gross_salary": 52500,
        "net_salary": 39375,
        "deductions": 13125,
        "status": "generated",
        "generated_at": "2024-03-01T10:00:00Z",
        "sent_at": None
    }
    
    return mock_payslip

@router.put("/{payslip_id}/status", response_model=PayslipResponse)
async def update_payslip_status(
    payslip_id: int,
    status_update: PayslipStatus,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Met à jour le statut d'un bulletin de paie"""
    
    # Simulation de mise à jour
    updated_payslip = {
        "id": payslip_id,
        "employee_id": 1,
        "employee_name": "Jean Dupont",
        "period": "2024-03",
        "base_salary": 50000,
        "gross_salary": 52500,
        "net_salary": 39375,
        "deductions": 13125,
        "status": status_update.status,
        "generated_at": "2024-03-01T10:00:00Z",
        "sent_at": datetime.now().isoformat() if status_update.status == "sent" else None
    }
    
    return updated_payslip

@router.post("/{payslip_id}/send", response_model=dict)
async def send_payslip(
    payslip_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Envoie un bulletin de paie par email"""
    
    from app.services.pdf_generator import PayslipPDFGenerator
    from app.services.payroll_calculator import PayrollCalculator
    from app.services.email_service import EmailService
    
    # Récupération des données (simulation)
    calculator = PayrollCalculator()
    
    employee_data = {
        1: {"employee_id": 1, "employee_name": "Jean Dupont", "email": "jean.dupont@example.com", "base_salary": 800000, "overtime_hours": 10, "absence_hours": 0, "period": "2024-03"},
        2: {"employee_id": 2, "employee_name": "Marie Martin", "email": "marie.martin@example.com", "base_salary": 1200000, "overtime_hours": 5, "absence_hours": 8, "period": "2024-03"},
        3: {"employee_id": 3, "employee_name": "Pierre Durand", "email": "pierre.durand@example.com", "base_salary": 2500000, "overtime_hours": 0, "absence_hours": 0, "period": "2024-03"}
    }.get(payslip_id, {"employee_id": payslip_id, "employee_name": "Employé Inconnu", "email": "test@example.com", "base_salary": 500000, "period": "2024-03"})
    
    # Calcul et génération PDF
    payslip_data = calculator.calculate_employee_payroll(employee_data)
    pdf_generator = PayslipPDFGenerator()
    pdf_buffer = pdf_generator.generate_payslip_pdf(payslip_data)
    
    # Envoi par email
    email_service = EmailService()
    success = email_service.send_payslip_email(
        to_email=employee_data["email"],
        employee_name=employee_data["employee_name"],
        period=employee_data["period"],
        pdf_buffer=pdf_buffer
    )
    
    if success:
        return {
            "message": "Bulletin de paie envoyé avec succès",
            "payslip_id": payslip_id,
            "sent_to": employee_data["email"],
            "sent_at": datetime.now().isoformat()
        }
    else:
        raise HTTPException(
            status_code=500,
            detail="Erreur lors de l'envoi du bulletin"
        )

@router.get("/{payslip_id}/download")
async def download_payslip(
    payslip_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Télécharge un bulletin de paie en PDF"""
    
    from app.services.pdf_generator import PayslipPDFGenerator
    from app.services.payroll_calculator import PayrollCalculator
    from fastapi.responses import StreamingResponse
    
    # Récupération des données du bulletin (simulation)
    calculator = PayrollCalculator()
    
    # Données simulées selon l'ID
    employee_data = {
        1: {"employee_id": 1, "employee_name": "Jean Dupont", "base_salary": 800000, "overtime_hours": 10, "absence_hours": 0, "period": "2024-03"},
        2: {"employee_id": 2, "employee_name": "Marie Martin", "base_salary": 1200000, "overtime_hours": 5, "absence_hours": 8, "period": "2024-03"},
        3: {"employee_id": 3, "employee_name": "Pierre Durand", "base_salary": 2500000, "overtime_hours": 0, "absence_hours": 0, "period": "2024-03"}
    }.get(payslip_id, {"employee_id": payslip_id, "employee_name": "Employé Inconnu", "base_salary": 500000, "period": "2024-03"})
    
    # Calcul de la paie
    payslip_data = calculator.calculate_employee_payroll(employee_data)
    
    # Génération du PDF
    pdf_generator = PayslipPDFGenerator()
    pdf_buffer = pdf_generator.generate_payslip_pdf(payslip_data)
    
    # Retour du PDF
    filename = f"bulletin_paie_{payslip_data['employee_name'].replace(' ', '_')}_{payslip_data['period']}.pdf"
    
    return StreamingResponse(
        io.BytesIO(pdf_buffer.read()),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )