from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.websocket.manager import manager
from app.api import deps
from app.db import models
from pydantic import BaseModel

router = APIRouter()

class ChannelMessage(BaseModel):
    channel: str
    message: str
    type: str = "broadcast"

class NotificationBroadcast(BaseModel):
    title: str
    message: str
    type: str = "info"
    channel: str = "general"

@router.get("/channels/info")
async def get_channels_info(
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    """Obtenir des informations sur les canaux actifs (Admin seulement)"""
    return manager.get_channel_info()

@router.post("/channels/broadcast")
async def broadcast_to_channel(
    broadcast: ChannelMessage,
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    """Diffuser un message à un canal spécifique (Admin seulement)"""
    message = {
        "type": broadcast.type,
        "message": broadcast.message,
        "channel": broadcast.channel,
        "from": f"{current_admin.first_name} {current_admin.last_name}",
        "timestamp": "now"
    }
    
    await manager.send_to_channel(message, broadcast.channel)
    
    return {
        "message": f"Message diffusé au canal '{broadcast.channel}'",
        "recipients": len(manager.channel_users.get(broadcast.channel, []))
    }

@router.post("/notifications/broadcast")
async def broadcast_notification(
    notification: NotificationBroadcast,
    current_admin: models.User = Depends(deps.get_current_active_hr_admin)
):
    """Diffuser une notification à un canal (Admin seulement)"""
    message = {
        "type": "notification",
        "title": notification.title,
        "message": notification.message,
        "notification_type": notification.type,
        "channel": notification.channel,
        "from": f"{current_admin.first_name} {current_admin.last_name}",
        "timestamp": "now"
    }
    
    await manager.send_to_channel(message, notification.channel)
    
    return {
        "message": f"Notification diffusée au canal '{notification.channel}'",
        "recipients": len(manager.channel_users.get(notification.channel, []))
    }