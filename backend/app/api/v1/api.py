from fastapi import APIRouter

from app.api.v1.endpoints import (
    login, users, employees, tasks, leaves, performance, 
    contracts, manager, companies, recruitment, payroll,
    attendance, goals, assets, notifications, websocket, websocket_admin, email,
    time_tracking, reports, analytics, workflows, integrations
)
from app.api.v1.endpoints import payroll_config
from app.api.v1.endpoints import tasks as advanced_tasks
from app.api.v1.endpoints import settings as advanced_settings

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
api_router.include_router(attendance.router, prefix="/attendance", tags=["Attendance"])
api_router.include_router(goals.router, prefix="/goals", tags=["Goals"])
api_router.include_router(assets.router, prefix="/assets", tags=["Assets"])
api_router.include_router(advanced_settings.router, prefix="/settings", tags=["Settings"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(email.router, prefix="/email", tags=["Email"])
api_router.include_router(time_tracking.router, prefix="/time-tracking", tags=["Time Tracking"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(workflows.router, prefix="/workflows", tags=["Workflows"])
api_router.include_router(advanced_tasks.router, prefix="/advanced-tasks", tags=["Advanced Tasks"])
api_router.include_router(integrations.router, prefix="/integrations", tags=["Integrations"])
api_router.include_router(websocket.router, prefix="/ws", tags=["WebSocket"])
api_router.include_router(websocket_admin.router, prefix="/ws-admin", tags=["WebSocket Admin"])