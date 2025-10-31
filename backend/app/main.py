from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import jwt
from typing import Optional
import traceback

from app.db.database import Base, engine
from app.api.v1.api import api_router
from app.db import models # Assure que les modèles sont connus de Base
from app.db.init_db import create_database_if_not_exists
from app.websocket.manager import manager
from app.core.config import settings

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
 
# 1. Créer la base de données si elle n'existe pas
logger.info("🗄️ Vérification et création de la base de données...")
try:
    create_database_if_not_exists()
except Exception as e:
    logger.error(f"❌ Impossible de créer la base de données: {e}")
    logger.error("💡 Vérifiez que MySQL est démarré et les identifiants dans .env")
    exit(1)

# 2. Créer les tables dans la BDD
logger.info("📋 Création des tables...")
try:
    models.Base.metadata.create_all(bind=engine)
    logger.info("✅ Tables créées avec succès")
except Exception as e:
    logger.error(f"❌ Erreur lors de la création des tables: {e}")
    exit(1)

# 3. Exécution du seeder au démarrage
logger.info("🌱 Vérification et exécution du seeder...")
try:
    from seed import run_seeder
    run_seeder()
except Exception as e:
    logger.error(f"❌ Erreur lors de l'exécution du seeder: {e}")
    logger.warning("⚠️ L'API démarrera sans données de test")

# 4. Initialisation de l'application FastAPI
logger.info("🚀 Initialisation de l'API NovaCore...")

app = FastAPI(
    title="NovaCore API",
    description="Backend pour le système de gestion RH NovaCore.",
    version="1.0.0"
)

# 5. Initialiser la surveillance email au démarrage
logger.info("🔍 Initialisation de la surveillance email...")
try:
    from app.services.email_surveillance import email_surveillance_service
    email_surveillance_service.load_all_active_jobs()
except Exception as e:
    logger.warning(f"⚠️ Erreur lors de l'initialisation de la surveillance email: {e}")

# Middleware pour capturer les erreurs
@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        logger.error(f"Erreur non gérée: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Erreur interne du serveur"},
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": "true"
            }
        )

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclut le routeur principal de l'API v1
app.include_router(api_router, prefix="/api/v1")

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: Optional[str] = None):
    """Endpoint WebSocket pour les notifications en temps réel"""
    user_id = None
    
    try:
        # Vérifier le token JWT
        if token:
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = payload.get("sub")
                if user_id:
                    user_id = int(user_id)
            except jwt.PyJWTError:
                await websocket.close(code=4001, reason="Invalid token")
                return
        
        if not user_id:
            await websocket.close(code=4001, reason="Authentication required")
            return
        
        # Connecter l'utilisateur
        await manager.connect(websocket, user_id)
        
        # Abonner aux canaux par défaut
        manager.subscribe_to_channel(user_id, "notifications")
        manager.subscribe_to_channel(user_id, "system")
        
        # Envoyer un message de bienvenue
        await manager.send_personal_message({
            "type": "connection",
            "message": "Connecté aux notifications en temps réel",
            "user_id": user_id
        }, user_id)
        
        # Boucle d'écoute des messages
        while True:
            try:
                data = await websocket.receive_text()
                # Traiter les messages du client si nécessaire
                logger.info(f"Message reçu de l'utilisateur {user_id}: {data}")
            except WebSocketDisconnect:
                break
                
    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.error(f"Erreur WebSocket: {e}")
    finally:
        if user_id:
            manager.disconnect(websocket, user_id)

@app.get("/", tags=["Root"])
async def read_root():
    return {
        "message": "Bienvenue sur l'API NovaCore",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }