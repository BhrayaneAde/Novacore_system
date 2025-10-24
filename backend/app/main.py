from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.db.database import Base, engine
from app.api.v1.api import api_router
from app.db import models # Assure que les modèles sont connus de Base
from app.db.init_db import create_database_if_not_exists

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

# Configuration CORS
# Autorise le frontend React (ex: http://localhost:5173)
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclut le routeur principal de l'API v1
app.include_router(api_router, prefix="/api/v1")

@app.get("/", tags=["Root"])
async def read_root():
    return {
        "message": "Bienvenue sur l'API NovaCore",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }