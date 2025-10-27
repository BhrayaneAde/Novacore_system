from sqlalchemy.orm import Session
from typing import List, Optional
from app.db import models
from app.schemas import notification as notification_schema

def create_notification(db: Session, notification: notification_schema.NotificationCreate) -> models.Notification:
    """Créer une notification"""
    db_notification = models.Notification(**notification.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

async def create_notification_with_ws(db: Session, notification: notification_schema.NotificationCreate) -> models.Notification:
    """Créer une notification et l'envoyer via WebSocket"""
    try:
        from app.websocket.manager import manager
        db_notification = create_notification(db, notification)
        
        # Envoyer via WebSocket
        ws_message = {
            "type": "notification",
            "payload": {
                "id": db_notification.id,
                "title": db_notification.title,
                "message": db_notification.message,
                "type": db_notification.type,
                "created_at": db_notification.created_at.isoformat(),
                "data": db_notification.data,
                "is_read": db_notification.is_read
            }
        }
        
        await manager.send_personal_message(ws_message, notification.user_id)
        return db_notification
    except ImportError:
        # Fallback si WebSocket non disponible
        return create_notification(db, notification)

def get_notifications(db: Session, user_id: int, skip: int = 0, limit: int = 50) -> List[models.Notification]:
    """Récupérer les notifications d'un utilisateur"""
    return db.query(models.Notification).filter(
        models.Notification.user_id == user_id
    ).order_by(models.Notification.created_at.desc()).offset(skip).limit(limit).all()

def mark_as_read(db: Session, notification_id: int, user_id: int) -> Optional[models.Notification]:
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

def mark_all_as_read(db: Session, user_id: int) -> int:
    """Marquer toutes les notifications comme lues"""
    count = db.query(models.Notification).filter(
        models.Notification.user_id == user_id,
        models.Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return count

def delete_notification(db: Session, notification_id: int, user_id: int) -> bool:
    """Supprimer une notification"""
    notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == user_id
    ).first()
    
    if notification:
        db.delete(notification)
        db.commit()
        return True
    return False

def get_unread_count(db: Session, user_id: int) -> int:
    """Compter les notifications non lues"""
    return db.query(models.Notification).filter(
        models.Notification.user_id == user_id,
        models.Notification.is_read == False
    ).count()