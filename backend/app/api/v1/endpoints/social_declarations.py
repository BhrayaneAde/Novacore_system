from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, date
import io

from app.db.database import get_db
from app.schemas.social_declarations import (
    SocialDeclarationGenerate,
    SocialDeclarationResponse,
    CNSSDeclaration,
    IRPPDeclaration,
    DISADeclaration
)
from app.core.auth import get_current_user
from app.services.payroll_calculator import PayrollCalculator

router = APIRouter()

class SocialDeclarationsService:
    def __init__(self, db: Session):
        self.db = db
        self.calculator = PayrollCalculator()
    
    def generate_cnss_declaration(self, period: str) -> Dict[str, Any]:
        """Génère la déclaration CNSS mensuelle"""
        
        # Données simulées des employés
        employees_data = [
            {"employee_id": 1, "employee_name": "Jean Dupont", "base_salary": 800000, "overtime_hours": 10, "absence_hours": 0, "period": period},
            {"employee_id": 2, "employee_name": "Marie Martin", "base_salary": 1200000, "overtime_hours": 5, "absence_hours": 8, "period": period},
            {"employee_id": 3, "employee_name": "Pierre Durand", "base_salary": 2500000, "overtime_hours": 0, "absence_hours": 0, "period": period}
        ]
        
        # Calcul des totaux
        batch_result = self.calculator.calculate_batch_payroll(employees_data)
        
        return {
            "type": "CNSS_MONTHLY",
            "period": period,
            "total_employees": len(employees_data),
            "total_salary": batch_result["totals"]["total_gross"],
            "total_cnss_employee": batch_result["totals"]["total_cnss_employee"],
            "total_cnss_employer": batch_result["totals"]["total_cnss_employer"],
            "employees_details": batch_result["calculations"],
            "due_date": self._get_due_date(period, "CNSS"),
            "status": "generated"
        }
    
    def generate_irpp_declaration(self, period: str) -> Dict[str, Any]:
        """Génère la déclaration IRPP mensuelle"""
        
        employees_data = [
            {"employee_id": 1, "employee_name": "Jean Dupont", "base_salary": 800000, "overtime_hours": 10, "absence_hours": 0, "period": period},
            {"employee_id": 2, "employee_name": "Marie Martin", "base_salary": 1200000, "overtime_hours": 5, "absence_hours": 8, "period": period},
            {"employee_id": 3, "employee_name": "Pierre Durand", "base_salary": 2500000, "overtime_hours": 0, "absence_hours": 0, "period": period}
        ]
        
        batch_result = self.calculator.calculate_batch_payroll(employees_data)
        
        # Calcul du revenu imposable total
        total_taxable_income = sum(
            calc["gross_salary"] - calc["cnss_employee"] 
            for calc in batch_result["calculations"]
        )
        
        return {
            "type": "IRPP_MONTHLY",
            "period": period,
            "total_employees": len(employees_data),
            "total_taxable_income": total_taxable_income,
            "total_irpp": batch_result["totals"]["total_irpp"],
            "employees_details": batch_result["calculations"],
            "due_date": self._get_due_date(period, "IRPP"),
            "status": "generated"
        }
    
    def generate_disa_declaration(self, year: str) -> Dict[str, Any]:
        """Génère la DISA (Déclaration Sociale Annuelle)"""
        
        # Simulation des données annuelles
        annual_data = {
            "type": "DISA_ANNUAL",
            "period": year,
            "total_employees": 3,
            "total_annual_salary": 54000000,  # 12 mois * totaux mensuels
            "total_annual_cnss_employee": 3024000,
            "total_annual_cnss_employer": 4536000,
            "total_annual_irpp": 3293436,
            "due_date": f"{int(year)+1}-01-31",
            "status": "generated"
        }
        
        return annual_data
    
    def _get_due_date(self, period: str, declaration_type: str) -> str:
        """Calcule la date d'échéance selon le type de déclaration"""
        
        if declaration_type in ["CNSS", "IRPP"]:
            # Échéance le 15 du mois suivant
            year, month = period.split('-')
            next_month = int(month) + 1
            next_year = int(year)
            
            if next_month > 12:
                next_month = 1
                next_year += 1
            
            return f"{next_year}-{next_month:02d}-15"
        
        elif declaration_type == "DISA":
            # Échéance le 31 janvier de l'année suivante
            return f"{int(period)+1}-01-31"
        
        return period

@router.post("/generate", response_model=Dict[str, Any])
async def generate_declaration(
    request: SocialDeclarationGenerate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Génère une déclaration sociale"""
    
    service = SocialDeclarationsService(db)
    
    if request.type == "CNSS_MONTHLY":
        declaration = service.generate_cnss_declaration(request.period)
    elif request.type == "IRPP_MONTHLY":
        declaration = service.generate_irpp_declaration(request.period)
    elif request.type == "DISA_ANNUAL":
        declaration = service.generate_disa_declaration(request.period)
    else:
        raise HTTPException(
            status_code=400,
            detail="Type de déclaration non supporté"
        )
    
    # Simulation de sauvegarde
    declaration["id"] = hash(f"{request.type}_{request.period}") % 10000
    declaration["created_at"] = datetime.now().isoformat()
    
    return {
        "success": True,
        "declaration": declaration,
        "message": f"Déclaration {request.type} générée avec succès"
    }

@router.get("/", response_model=List[Dict[str, Any]])
async def get_declarations(
    period: Optional[str] = None,
    type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Récupère la liste des déclarations sociales"""
    
    # Simulation des déclarations
    mock_declarations = [
        {
            "id": 1,
            "type": "CNSS_MONTHLY",
            "type_name": "Bordereau CNSS Mensuel",
            "period": "2024-03",
            "status": "draft",
            "total_employees": 3,
            "total_salary": 4500000,
            "total_cnss_employee": 252000,
            "total_cnss_employer": 378000,
            "due_date": "2024-04-15",
            "created_at": "2024-03-01T10:00:00Z"
        },
        {
            "id": 2,
            "type": "IRPP_MONTHLY",
            "type_name": "Déclaration IRPP Mensuelle",
            "period": "2024-03",
            "status": "submitted",
            "total_employees": 3,
            "total_taxable_income": 3996000,
            "total_irpp": 274453,
            "due_date": "2024-04-15",
            "created_at": "2024-03-01T10:00:00Z"
        },
        {
            "id": 3,
            "type": "DISA_ANNUAL",
            "type_name": "DISA (Déclaration Sociale Annuelle)",
            "period": "2024",
            "status": "pending",
            "total_employees": 3,
            "total_annual_salary": 54000000,
            "due_date": "2025-01-31",
            "created_at": "2024-01-01T10:00:00Z"
        }
    ]
    
    # Application des filtres
    filtered_declarations = mock_declarations
    
    if period:
        filtered_declarations = [d for d in filtered_declarations if d["period"] == period]
    
    if type:
        filtered_declarations = [d for d in filtered_declarations if d["type"] == type]
    
    return filtered_declarations

@router.put("/{declaration_id}/submit", response_model=Dict[str, Any])
async def submit_declaration(
    declaration_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Soumet une déclaration sociale"""
    
    return {
        "success": True,
        "declaration_id": declaration_id,
        "status": "submitted",
        "submitted_at": datetime.now().isoformat(),
        "submitted_by": current_user.email
    }

@router.get("/{declaration_id}/download")
async def download_declaration(
    declaration_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Télécharge une déclaration sociale en PDF"""
    
    from fastapi.responses import StreamingResponse
    
    # Simulation de génération PDF
    pdf_content = f"Déclaration sociale #{declaration_id}\nGénérée le {datetime.now().strftime('%d/%m/%Y')}\n\nContenu de la déclaration..."
    
    return StreamingResponse(
        io.BytesIO(pdf_content.encode()),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=declaration_{declaration_id}.pdf"}
    )