from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from app.websocket.manager import manager
from app.api import deps
from app.core.security import decode_token
from app.db.models import RoleEnum
import logging
import json

logger = logging.getLogger(__name__)
router = APIRouter()

def get_user_channels(user) -> set:
    """Déterminer les canaux automatiques selon le rôle"""
    channels = {"general"}  # Canal général pour tous
    
    if user.role == RoleEnum.employer:
        channels.update({"admin", "management", "hr", "all_departments"})
    elif user.role == RoleEnum.hr_admin:
        channels.update({"hr", "management", "all_departments"})
    elif user.role == RoleEnum.manager:
        channels.update({"management"})
        # Ajouter le canal du département si disponible
        if user.employee and user.employee.department:
            channels.add(f"dept_{user.employee.department.name.lower()}")
    elif user.role == RoleEnum.employee:
        # Canal du département si disponible
        if user.employee and user.employee.department:
            channels.add(f"dept_{user.employee.department.name.lower()}")
    
    return channels

async def get_user_from_token(token: str, db: Session):
    """Extraire l'utilisateur depuis le token WebSocket"""
    try:
        payload = decode_token(token)
        if not payload:
            return None
        
        user_id = payload.get("sub")
        if not user_id:
            return None
            
        from app.crud import crud_user
        user = crud_user.get_user(db, user_id=int(user_id))
        return user
    except:
        return None

@router.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    """Endpoint WebSocket pour les notifications en temps réel"""
    db = next(deps.get_db())
    
    # Vérifier le token
    user = await get_user_from_token(token, db)
    if not user:
        await websocket.close(code=4001, reason="Token invalide")
        return
    
    # Connecter l'utilisateur
    await manager.connect(websocket, user.id)
    
    # Abonnements automatiques basés sur le rôle
    auto_channels = get_user_channels(user)
    for channel in auto_channels:
        manager.subscribe_to_channel(user.id, channel)
    
    try:
        # Envoyer un message de bienvenue
        welcome_msg = {
            "type": "connection",
            "message": f"Connecté en tant que {user.first_name} {user.last_name}",
            "user_id": user.id,
            "channels": list(auto_channels)
        }
        await manager.send_personal_message(welcome_msg, user.id)
        
        # Boucle d'écoute des messages
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Gestion des commandes
            if message.get("action") == "subscribe":
                channel = message.get("channel")
                if channel:
                    manager.subscribe_to_channel(user.id, channel)
                    await manager.send_personal_message({
                        "type": "subscription",
                        "message": f"Abonné au canal '{channel}'"
                    }, user.id)
            
            elif message.get("action") == "unsubscribe":
                channel = message.get("channel")
                if channel:
                    manager.unsubscribe_from_channel(user.id, channel)
                    await manager.send_personal_message({
                        "type": "subscription",
                        "message": f"Désabonné du canal '{channel}'"
                    }, user.id)
            
            else:
                # Echo pour test
                echo_msg = {
                    "type": "echo",
                    "message": f"Reçu: {data}",
                    "timestamp": "now"
                }
                await manager.send_personal_message(echo_msg, user.id)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, user.id)
        logger.info(f"WebSocket déconnecté pour l'utilisateur {user.id}")
    except Exception as e:
        logger.error(f"Erreur WebSocket: {e}")
        manager.disconnect(websocket, user.id)