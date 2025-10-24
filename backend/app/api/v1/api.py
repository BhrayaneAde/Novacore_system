from fastapi import APIRouter

from app.api.v1.endpoints import (
    login, users, employees, tasks, leaves, performance, 
    contracts, manager, companies, recruitment, payroll,
    attendance, goals, assets, settings, notifications, websocket, websocket_admin
)

api_router = APIRouter()

# Inclut tous les routeurs des endpoints
api_router.include_router(login.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(employees.router, prefix="/hr", tags=["hr"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
api_router.include_router(leaves.router, prefix="/leaves", tags=["Leaves"])
api_router.include_router(performance.router, prefix="/performance", tags=["Performance"])
api_router.include_router(contracts.router, prefix="/contracts", tags=["Contracts"])
api_router.include_router(manager.router, prefix="/manager", tags=["Manager"])
api_router.include_router(companies.router, prefix="/companies", tags=["Companies"])
api_router.include_router(recruitment.router, prefix="/recruitment", tags=["Recruitment"])
api_router.include_router(payroll.router, prefix="/payroll", tags=["Payroll"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["Attendance"])
api_router.include_router(goals.router, prefix="/goals", tags=["Goals"])
api_router.include_router(assets.router, prefix="/assets", tags=["Assets"])
api_router.include_router(settings.router, prefix="/settings", tags=["Settings"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(websocket.router, prefix="/ws", tags=["WebSocket"])
api_router.include_router(websocket_admin.router, prefix="/ws-admin", tags=["WebSocket Admin"])