from fastapi import APIRouter

from app.api.v1.endpoints import (
    login, users, employees, tasks, leaves, performance, 
    contracts, manager, companies, recruitment, payroll,
    attendance, goals, assets, notifications, websocket, websocket_admin, email,
    time_tracking, reports, analytics, workflows, integrations, departments, google_drive, auto_recruitment
)
from app.api.v1.endpoints import payroll_config, employee_payroll, payroll_records, payroll_batch, payroll_reports, payroll_calculation, payslips, payroll_accounting, social_declarations
from app.api.v1.endpoints import tasks as advanced_tasks
from app.api.v1.endpoints import settings as advanced_settings
from app.db import models

api_router = APIRouter()

# Inclut tous les routeurs des endpoints
api_router.include_router(login.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(employees.router, prefix="/employees", tags=["employees"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
api_router.include_router(leaves.router, prefix="/leaves", tags=["Leaves"])
api_router.include_router(performance.router, prefix="/performance", tags=["Performance"])
api_router.include_router(contracts.router, prefix="/contracts", tags=["Contracts"])
api_router.include_router(manager.router, prefix="/manager", tags=["Manager"])
api_router.include_router(companies.router, prefix="/companies", tags=["Companies"])
api_router.include_router(recruitment.router, prefix="/recruitment", tags=["Recruitment"])
api_router.include_router(payroll.router, prefix="/payroll", tags=["Payroll"])
api_router.include_router(payroll_config.router, prefix="/payroll-config", tags=["Payroll Configuration"])
api_router.include_router(employee_payroll.router, prefix="/employee-payroll", tags=["Employee Payroll"])
api_router.include_router(payroll_records.router, prefix="/payroll/records", tags=["Payroll Records"])
api_router.include_router(payroll_batch.router, prefix="/payroll", tags=["Payroll Batch"])
api_router.include_router(payroll_reports.router, prefix="/payroll-reports", tags=["Payroll Reports"])
api_router.include_router(payroll_calculation.router, prefix="/payroll-calculation", tags=["Payroll Calculation"])
api_router.include_router(payslips.router, prefix="/payslips", tags=["Payslips"])
api_router.include_router(payroll_accounting.router, prefix="/payroll-accounting", tags=["Payroll Accounting"])
api_router.include_router(social_declarations.router, prefix="/social-declarations", tags=["Social Declarations"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["Attendance"])
api_router.include_router(goals.router, prefix="/goals", tags=["Goals"])
api_router.include_router(assets.router, prefix="/assets", tags=["Assets"])
from app.api.v1 import assets as new_assets
api_router.include_router(new_assets.router, prefix="/hr-assets", tags=["HR Assets"])
api_router.include_router(advanced_settings.router, prefix="/settings", tags=["Settings"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(email.router, prefix="/email", tags=["Email"])
api_router.include_router(time_tracking.router, prefix="/time-tracking", tags=["Time Tracking"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(workflows.router, prefix="/workflows", tags=["Workflows"])
api_router.include_router(advanced_tasks.router, prefix="/advanced-tasks", tags=["Advanced Tasks"])
api_router.include_router(integrations.router, prefix="/integrations", tags=["Integrations"])
api_router.include_router(departments.router, prefix="/departments", tags=["Departments"])
api_router.include_router(google_drive.router, prefix="/google-drive", tags=["Google Drive"])
api_router.include_router(auto_recruitment.router, prefix="/auto-recruitment", tags=["Auto Recruitment"])
api_router.include_router(websocket.router, prefix="/ws", tags=["WebSocket"])
api_router.include_router(websocket_admin.router, prefix="/ws-admin", tags=["WebSocket Admin"])

# Endpoints racine pour compatibilité frontend
from fastapi import Depends
from app.core.auth import get_current_user
from app.db.database import get_db
from sqlalchemy.orm import Session

@api_router.get("/candidates")
async def get_all_candidates(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Endpoint racine pour récupérer tous les candidats (manuel + auto)"""
    # Récupérer les candidats manuels
    manual_candidates = db.query(models.Candidate).filter(
        models.Candidate.company_id == current_user.company_id
    ).all()
    
    result = []
    for candidate in manual_candidates:
        result.append({
            "id": candidate.id,
            "name": candidate.name,
            "email": candidate.email,
            "phone": candidate.phone,
            "position": candidate.position,
            "status": candidate.status.value if candidate.status else "nouveau",
            "department_id": candidate.department_id,
            "department": candidate.department.name if candidate.department else None,
            "received_at": candidate.received_at.isoformat() if candidate.received_at else None,
            "source": "auto" if candidate.email_subject else "manual"
        })
    
    return {"candidates": result}