from fastapi import APIRouter, HTTPException, Depends
from typing import List
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Department, Employee, User
from app.core.auth import get_current_user
from sqlalchemy import func

router = APIRouter()

class DepartmentCreate(BaseModel):
    name: str

class DepartmentResponse(BaseModel):
    id: int
    name: str
    employee_count: int = 0

@router.get("/", response_model=List[DepartmentResponse])
async def get_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    departments = db.query(
        Department.id,
        Department.name,
        func.count(Employee.id).label('employee_count')
    ).filter(Department.company_id == current_user.company_id
    ).outerjoin(Employee).group_by(Department.id, Department.name).all()
    
    return [
        DepartmentResponse(
            id=dept.id,
            name=dept.name,
            employee_count=dept.employee_count or 0
        )
        for dept in departments
    ]

@router.post("/", response_model=DepartmentResponse)
async def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_dept = Department(
        name=department.name,
        company_id=current_user.company_id
    )
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    
    return DepartmentResponse(
        id=new_dept.id,
        name=new_dept.name,
        employee_count=0
    )

@router.put("/{department_id}", response_model=DepartmentResponse)
async def update_department(
    department_id: int,
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dept = db.query(Department).filter(
        Department.id == department_id,
        Department.company_id == current_user.company_id
    ).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    
    dept.name = department.name
    db.commit()
    db.refresh(dept)
    
    employee_count = db.query(func.count(Employee.id)).filter(Employee.department_id == dept.id).scalar() or 0
    
    return DepartmentResponse(
        id=dept.id,
        name=dept.name,
        employee_count=employee_count
    )

@router.delete("/{department_id}")
async def delete_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dept = db.query(Department).filter(
        Department.id == department_id,
        Department.company_id == current_user.company_id
    ).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    
    db.delete(dept)
    db.commit()
    
    return {"message": "Department deleted successfully"}