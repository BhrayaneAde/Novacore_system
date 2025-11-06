from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime

from app.db.database import get_db
from app.db.models import PayrollVariable, EmployeePayrollData
from app.schemas.payroll_accounting import (
    AccountingEntryCreate,
    AccountingEntryResponse,
    AccountingEntriesGenerate,
    AccountingEntriesResponse,
    AccountingSummary
)
from app.core.auth import get_current_user

router = APIRouter()

class PayrollAccountingService:
    def __init__(self, db: Session):
        self.db = db
        
    def generate_accounting_entries(self, period: str) -> List[Dict[str, Any]]:
        """Génère les écritures comptables pour une période donnée"""
        
        # Simulation des données de paie
        mock_payroll_data = {
            "total_gross_salary": 155250,
            "total_net_salary": 122062,
            "total_employee_charges": 15563,
            "total_employer_charges": 18000,
            "employees_count": 3
        }
        
        entries = []
        
        # Écriture 1: Salaires bruts (Débit)
        entries.append({
            "account": "641100",
            "account_name": "Salaires et traitements",
            "debit": mock_payroll_data["total_gross_salary"],
            "credit": 0,
            "description": f"Salaires bruts {self._format_period(period)}",
            "period": period,
            "status": "draft"
        })
        
        # Écriture 2: Charges sociales patronales (Débit)
        entries.append({
            "account": "645100",
            "account_name": "Charges sociales patronales",
            "debit": mock_payroll_data["total_employer_charges"],
            "credit": 0,
            "description": f"Charges patronales {self._format_period(period)}",
            "period": period,
            "status": "draft"
        })
        
        # Écriture 3: Dettes sociales (Crédit)
        total_social_charges = mock_payroll_data["total_employee_charges"] + mock_payroll_data["total_employer_charges"]
        entries.append({
            "account": "431000",
            "account_name": "Dettes sociales",
            "debit": 0,
            "credit": total_social_charges,
            "description": f"Charges sociales {self._format_period(period)}",
            "period": period,
            "status": "draft"
        })
        
        # Écriture 4: Personnel - Rémunérations dues (Crédit)
        entries.append({
            "account": "421000",
            "account_name": "Personnel - Rémunérations dues",
            "debit": 0,
            "credit": mock_payroll_data["total_net_salary"],
            "description": f"Salaires nets à payer {self._format_period(period)}",
            "period": period,
            "status": "draft"
        })
        
        return entries
    
    def _format_period(self, period: str) -> str:
        """Formate la période pour l'affichage"""
        try:
            year, month = period.split('-')
            months = {
                '01': 'Janvier', '02': 'Février', '03': 'Mars', '04': 'Avril',
                '05': 'Mai', '06': 'Juin', '07': 'Juillet', '08': 'Août',
                '09': 'Septembre', '10': 'Octobre', '11': 'Novembre', '12': 'Décembre'
            }
            return f"{months.get(month, month)} {year}"
        except:
            return period

@router.post("/generate", response_model=AccountingEntriesResponse)
async def generate_accounting_entries(
    request: AccountingEntriesGenerate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Génère les écritures comptables pour une période"""
    
    service = PayrollAccountingService(db)
    entries = service.generate_accounting_entries(request.period)
    
    # Simulation de sauvegarde en base
    saved_entries = []
    for i, entry in enumerate(entries):
        saved_entry = {
            "id": i + 1,
            "created_at": datetime.now().isoformat(),
            **entry
        }
        saved_entries.append(saved_entry)
    
    return AccountingEntriesResponse(
        success=True,
        entries_count=len(saved_entries),
        entries=saved_entries,
        period=request.period
    )

@router.get("/entries", response_model=Dict[str, Any])
async def get_accounting_entries(
    period: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Récupère les écritures comptables avec filtres"""
    
    # Simulation des écritures
    mock_entries = [
        {
            "id": 1,
            "period": period or "2024-03",
            "account": "641100",
            "account_name": "Salaires et traitements",
            "debit": 155250,
            "credit": 0,
            "description": "Salaires bruts Mars 2024",
            "status": "draft",
            "created_at": "2024-03-01T10:00:00Z"
        },
        {
            "id": 2,
            "period": period or "2024-03",
            "account": "645100",
            "account_name": "Charges sociales patronales",
            "debit": 18000,
            "credit": 0,
            "description": "Charges patronales Mars 2024",
            "status": "validated",
            "created_at": "2024-03-01T10:00:00Z"
        },
        {
            "id": 3,
            "period": period or "2024-03",
            "account": "431000",
            "account_name": "Dettes sociales",
            "debit": 0,
            "credit": 33563,
            "description": "Charges sociales Mars 2024",
            "status": "validated",
            "created_at": "2024-03-01T10:00:00Z"
        },
        {
            "id": 4,
            "period": period or "2024-03",
            "account": "421000",
            "account_name": "Personnel - Rémunérations dues",
            "debit": 0,
            "credit": 122062,
            "description": "Salaires nets à payer Mars 2024",
            "status": "posted",
            "created_at": "2024-03-01T10:00:00Z"
        }
    ]
    
    # Application des filtres
    filtered_entries = mock_entries
    if status:
        filtered_entries = [e for e in filtered_entries if e["status"] == status]
    
    # Calcul du résumé
    summary = {
        "total_salaries": sum(e["debit"] for e in filtered_entries if e["account"].startswith("641")),
        "total_charges": sum(e["credit"] for e in filtered_entries if e["account"] == "431000"),
        "total_net": sum(e["credit"] for e in filtered_entries if e["account"] == "421000"),
        "entries_count": len(filtered_entries)
    }
    
    return {
        "entries": filtered_entries,
        "summary": summary
    }

@router.put("/entries/{entry_id}/validate", response_model=Dict[str, Any])
async def validate_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Valide une écriture comptable"""
    
    return {
        "success": True,
        "entry_id": entry_id,
        "status": "validated",
        "validated_at": datetime.now().isoformat(),
        "validated_by": current_user.email
    }

@router.put("/entries/{entry_id}/post", response_model=Dict[str, Any])
async def post_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Comptabilise une écriture"""
    
    return {
        "success": True,
        "entry_id": entry_id,
        "status": "posted",
        "posted_at": datetime.now().isoformat(),
        "posted_by": current_user.email
    }

@router.get("/export/{period}")
async def export_accounting_entries(
    period: str,
    format: str = "csv",
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Exporte les écritures comptables"""
    
    # À implémenter : génération du fichier d'export
    raise HTTPException(
        status_code=501,
        detail="Export en cours de développement"
    )

@router.get("/accounts", response_model=List[Dict[str, str]])
async def get_chart_of_accounts(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Récupère le plan comptable"""
    
    return [
        {"account": "641100", "name": "Salaires et traitements"},
        {"account": "645100", "name": "Charges sociales patronales"},
        {"account": "431000", "name": "Dettes sociales"},
        {"account": "421000", "name": "Personnel - Rémunérations dues"},
        {"account": "437000", "name": "Charges sociales sur congés à payer"},
        {"account": "641200", "name": "Congés payés"},
        {"account": "641300", "name": "Primes et gratifications"}
    ]