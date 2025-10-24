from sqlalchemy.orm import Session
from typing import Optional, List
from app.db import models
from app.schemas import contract as contract_schema

def get_contract_template(db: Session, template_id: int) -> Optional[models.ContractTemplate]:
    return db.query(models.ContractTemplate).filter(models.ContractTemplate.id == template_id).first()

def get_contract_templates(db: Session, skip: int = 0, limit: int = 100) -> List[models.ContractTemplate]:
    return db.query(models.ContractTemplate).offset(skip).limit(limit).all()

def create_contract_template(db: Session, template: contract_schema.ContractTemplateCreate) -> models.ContractTemplate:
    db_template = models.ContractTemplate(**template.dict())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

def get_generated_contract(db: Session, contract_id: int) -> Optional[models.GeneratedContract]:
    return db.query(models.GeneratedContract).filter(models.GeneratedContract.id == contract_id).first()

def get_generated_contracts(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[models.GeneratedContract]:
    return db.query(models.GeneratedContract).join(models.Employee).filter(
        models.Employee.company_id == company_id
    ).offset(skip).limit(limit).all()

def create_generated_contract(db: Session, contract: contract_schema.GeneratedContractCreate) -> models.GeneratedContract:
    db_contract = models.GeneratedContract(**contract.dict())
    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)
    return db_contract