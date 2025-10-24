from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import company as company_schema
from app.crud import crud_company

router = APIRouter()

@router.get("/me", response_model=company_schema.Company)
async def read_my_company(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    company = crud_company.get_company(db, current_user.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    return company

@router.get("/departments", response_model=List[company_schema.Department])
async def read_departments(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    return crud_company.get_departments(db, company_id=current_user.company_id)

@router.post("/departments", response_model=company_schema.Department, status_code=status.HTTP_201_CREATED)
async def create_department(
    department_in: company_schema.DepartmentCreate,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    department_in.company_id = current_admin.company_id
    return crud_company.create_department(db=db, department=department_in)