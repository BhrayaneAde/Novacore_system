from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.schemas import notification as notification_schema
from app.crud import crud_notification

router = APIRouter()

@router.get("/", response_model=List[notification_schema.Notification])
async def get_my_notifications(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Récupérer mes notifications"""
    return crud_notification.get_notifications(db, user_id=current_user.id, skip=skip, limit=limit)

@router.post("/", response_model=notification_schema.Notification)
async def create_notification(
    notification_in: notification_schema.NotificationCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Créer une notification (pour les admins/managers)"""
    notification_in.created_by_id = current_user.id
    return await crud_notification.create_notification(db=db, notification=notification_in)

@router.put("/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """Marquer une notification comme lue"""
    notification = crud_notification.mark_as_read(db, notification_id, current_user.id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification non trouvée")
    return {"message": "Notification marquée comme lue"}