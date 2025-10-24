from typing import Dict, List, Set
from fastapi import WebSocket
import json
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    """Gestionnaire des connexions WebSocket avec canaux"""
    
    def __init__(self):
        # Stockage des connexions par user_id
        self.active_connections: Dict[int, List[WebSocket]] = {}
        # Stockage des abonnements aux canaux par user_id
        self.user_channels: Dict[int, Set[str]] = {}
        # Stockage des utilisateurs par canal
        self.channel_users: Dict[str, Set[int]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: int):
        """Accepter une nouvelle connexion"""
        await websocket.accept()
        
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        
        self.active_connections[user_id].append(websocket)
        logger.info(f"✅ Utilisateur {user_id} connecté via WebSocket")
    
    def disconnect(self, websocket: WebSocket, user_id: int):
        """Supprimer une connexion"""
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            
            # Supprimer la liste si vide
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
                # Nettoyer les canaux
                self._cleanup_user_channels(user_id)
        
        logger.info(f"❌ Utilisateur {user_id} déconnecté")
    
    def _cleanup_user_channels(self, user_id: int):
        """Nettoyer les canaux d'un utilisateur déconnecté"""
        if user_id in self.user_channels:
            for channel in self.user_channels[user_id]:
                if channel in self.channel_users:
                    self.channel_users[channel].discard(user_id)
                    if not self.channel_users[channel]:
                        del self.channel_users[channel]
            del self.user_channels[user_id]
    
    def subscribe_to_channel(self, user_id: int, channel: str):
        """Abonner un utilisateur à un canal"""
        if user_id not in self.user_channels:
            self.user_channels[user_id] = set()
        
        if channel not in self.channel_users:
            self.channel_users[channel] = set()
        
        self.user_channels[user_id].add(channel)
        self.channel_users[channel].add(user_id)
        logger.info(f"📺 Utilisateur {user_id} abonné au canal '{channel}'")
    
    def unsubscribe_from_channel(self, user_id: int, channel: str):
        """Désabonner un utilisateur d'un canal"""
        if user_id in self.user_channels:
            self.user_channels[user_id].discard(channel)
        
        if channel in self.channel_users:
            self.channel_users[channel].discard(user_id)
            if not self.channel_users[channel]:
                del self.channel_users[channel]
        
        logger.info(f"📺 Utilisateur {user_id} désabonné du canal '{channel}'")
    
    async def send_personal_message(self, message: dict, user_id: int):
        """Envoyer un message à un utilisateur spécifique"""
        if user_id in self.active_connections:
            disconnected = []
            
            for websocket in self.active_connections[user_id]:
                try:
                    await websocket.send_text(json.dumps(message))
                except:
                    # Connexion fermée, marquer pour suppression
                    disconnected.append(websocket)
            
            # Nettoyer les connexions fermées
            for ws in disconnected:
                self.disconnect(ws, user_id)
    
    async def send_to_channel(self, message: dict, channel: str):
        """Envoyer un message à tous les utilisateurs d'un canal"""
        if channel in self.channel_users:
            for user_id in self.channel_users[channel]:
                await self.send_personal_message(message, user_id)
            logger.info(f"📢 Message envoyé au canal '{channel}' ({len(self.channel_users[channel])} utilisateurs)")
    
    async def broadcast_notification(self, notification: dict):
        """Diffuser une notification à tous les utilisateurs connectés"""
        for user_id, connections in self.active_connections.items():
            await self.send_personal_message(notification, user_id)
    
    def get_channel_info(self) -> dict:
        """Obtenir des informations sur les canaux actifs"""
        return {
            "channels": {
                channel: len(users) for channel, users in self.channel_users.items()
            },
            "total_connections": sum(len(conns) for conns in self.active_connections.values()),
            "total_users": len(self.active_connections)
        }

# Instance globale
manager = ConnectionManager()