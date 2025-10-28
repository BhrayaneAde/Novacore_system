from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import contract as contract_schema
from app.schemas.contract_templates import get_all_templates, get_template_by_id
from app.utils.contract_generator import generate_contract, validate_variables, preview_contract
from app.crud import crud_contract, crud_employee

router = APIRouter()

@router.get("/templates", response_model=List[contract_schema.ContractTemplate])
async def read_contract_templates(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_hr_admin)
):
    return crud_contract.get_contract_templates(db, skip=skip, limit=limit)

@router.post("/templates", response_model=contract_schema.ContractTemplate, status_code=status.HTTP_201_CREATED)
async def create_contract_template(
    template_in: contract_schema.ContractTemplateCreate,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    return crud_contract.create_contract_template(db=db, template=template_in)

@router.get("/", response_model=List[contract_schema.GeneratedContract])
async def read_generated_contracts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    return crud_contract.get_generated_contracts(db, company_id=current_user.company_id, skip=skip, limit=limit)

@router.get("/predefined-templates")
async def get_predefined_templates(
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupère tous les templates prédéfinis"""
    return get_all_templates()

@router.get("/predefined-templates/{template_id}")
async def get_predefined_template(
    template_id: int,
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupère un template prédéfini par ID"""
    template = get_template_by_id(template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template non trouvé")
    return template

@router.post("/generate")
async def generate_contract_from_template(
    template_id: int,
    variables: Dict[str, Any],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Génère un contrat à partir d'un template et des variables"""
    try:
        # Valide les variables
        validation = validate_variables(template_id, variables)
        if not validation["valid"]:
            raise HTTPException(
                status_code=400, 
                detail={"message": "Variables invalides", "errors": validation["errors"]}
            )
        
        # Génère le contrat
        contract = generate_contract(template_id, variables)
        return contract
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/preview")
async def preview_contract_from_template(
    template_id: int,
    variables: Dict[str, Any],
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Aperçu d'un contrat avec les variables remplies"""
    content = preview_contract(template_id, variables)
    return {"content": content}

@router.post("/validate")
async def validate_contract_variables(
    template_id: int,
    variables: Dict[str, Any],
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Valide les variables d'un contrat"""
    try:
        validation = validate_variables(template_id, variables)
        return validation
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/", response_model=contract_schema.GeneratedContract, status_code=status.HTTP_201_CREATED)
async def create_generated_contract(
    contract_in: contract_schema.GeneratedContractCreate,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    employee = crud_employee.get_employee(db, contract_in.employee_id)
    if not employee or employee.company_id != current_admin.company_id:
        raise HTTPException(status_code=404, detail="Employé non trouvé")
    contract_in.created_by_id = current_admin.id
    return crud_contract.create_generated_contract(db=db, contract=contract_in)