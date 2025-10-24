from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import contract as contract_schema
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