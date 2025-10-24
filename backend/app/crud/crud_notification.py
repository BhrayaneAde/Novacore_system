from sqlalchemy.orm import Session
from typing import List
from app.db import models
from app.schemas import notification as notification_schema
from app.websocket.manager import manager

async def create_notification(db: Session, notification: notification_schema.NotificationCreate) -> models.Notification:
    """Créer une notification et l'envoyer via WebSocket"""
    db_notification = models.Notification(**notification.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    
    # Envoyer via WebSocket
    ws_message = {
        "type": "notification",
        "id": db_notification.id,
        "title": db_notification.title,
        "message": db_notification.message,
        "notification_type": db_notification.type,
        "created_at": db_notification.created_at.isoformat(),
        "data": db_notification.data
    }
    
    await manager.send_personal_message(ws_message, notification.user_id)
    
    return db_notification

def get_notifications(db: Session, user_id: int, skip: int = 0, limit: int = 50) -> List[models.Notification]:
    """Récupérer les notifications d'un utilisateur"""
    return db.query(models.Notification).filter(
        models.Notification.user_id == user_id
    ).order_by(models.Notification.created_at.desc()).offset(skip).limit(limit).all()

def mark_as_read(db: Session, notification_id: int, user_id: int) -> models.Notification:
    """Marquer une notification comme lue"""
    notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == user_id
    ).first()
    
    if notification:
        notification.is_read = True
        db.commit()
        db.refresh(notification)
    
    return notification