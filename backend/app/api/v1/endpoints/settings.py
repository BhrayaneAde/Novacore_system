from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import settings as settings_schema
from app.crud import crud_company

router = APIRouter()

@router.get("/smtp", response_model=settings_schema.SMTPSettings)
async def get_smtp_settings(
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    company = crud_company.get_company(db, current_admin.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    return company.settings_smtp or {}

@router.put("/smtp")
async def update_smtp_settings(
    settings_in: settings_schema.SMTPSettings,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    company = crud_company.get_company(db, current_admin.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    company.settings_smtp = settings_in.dict()
    db.commit()
    return {"message": "Paramètres SMTP mis à jour"}

@router.get("/leave-policy", response_model=settings_schema.LeavePolicy)
async def get_leave_policy(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    company = crud_company.get_company(db, current_user.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    return company.settings_leave_policy or {}

@router.put("/leave-policy")
async def update_leave_policy(
    policy_in: settings_schema.LeavePolicy,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    company = crud_company.get_company(db, current_admin.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    company.settings_leave_policy = policy_in.dict()
    db.commit()
    return {"message": "Politique de congés mise à jour"}

@router.get("/work-schedule", response_model=settings_schema.WorkSchedule)
async def get_work_schedule(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    company = crud_company.get_company(db, current_user.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    return company.settings_work_schedule or {}

@router.put("/work-schedule")
async def update_work_schedule(
    schedule_in: settings_schema.WorkSchedule,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    company = crud_company.get_company(db, current_admin.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    company.settings_work_schedule = schedule_in.dict()
    db.commit()
    return {"message": "Horaires de travail mis à jour"}

@router.get("/security", response_model=settings_schema.SecuritySettings)
async def get_security_settings(
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    company = crud_company.get_company(db, current_admin.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    return company.settings_security or {}

@router.put("/security")
async def update_security_settings(
    security_in: settings_schema.SecuritySettings,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    company = crud_company.get_company(db, current_admin.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    company.settings_security = security_in.dict()
    db.commit()
    return {"message": "Paramètres de sécurité mis à jour"}

@router.get("/appearance", response_model=settings_schema.AppearanceSettings)
async def get_appearance_settings(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    company = crud_company.get_company(db, current_user.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    return company.settings_appearance or {}

@router.put("/appearance")
async def update_appearance_settings(
    appearance_in: settings_schema.AppearanceSettings,
    db: Session = Depends(deps.get_db),
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    company = crud_company.get_company(db, current_admin.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    company.settings_appearance = appearance_in.dict()
    db.commit()
    return {"message": "Paramètres d'apparence mis à jour"}