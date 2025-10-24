from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import date

class ContractTemplateBase(BaseModel):
    name: str
    type: str
    category: str
    content: str
    variables: Optional[List[Dict[str, Any]]] = []

class ContractTemplateCreate(ContractTemplateBase):
    pass

class ContractTemplate(ContractTemplateBase):
    id: int

    model_config = {"from_attributes": True}

class GeneratedContractBase(BaseModel):
    status: Optional[str] = "draft"
    variables_values: Optional[Dict[str, Any]] = {}

class GeneratedContractCreate(GeneratedContractBase):
    template_id: int
    employee_id: int
    created_by_id: int

class GeneratedContract(GeneratedContractBase):
    id: int
    template_id: int
    employee_id: int
    created_by_id: int
    created_date: date

    model_config = {"from_attributes": True}