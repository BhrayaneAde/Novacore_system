import logging
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from app.core.config import settings

logger = logging.getLogger(__name__)

def create_database_if_not_exists():
    """Crée la base de données si elle n'existe pas déjà"""
    try:
        # Extraire les informations de connexion depuis DATABASE_URL
        # Format: mysql+mysqlclient://user:password@host:port/database
        db_url = settings.DATABASE_URL
        
        # Séparer l'URL pour obtenir les composants
        if "mysql" in db_url:
            # Créer une connexion sans spécifier la base de données
            base_url = db_url.rsplit('/', 1)[0]  # Enlève le nom de la DB
            db_name = db_url.rsplit('/', 1)[1]   # Récupère le nom de la DB
            
            # Connexion au serveur MySQL sans base spécifique
            temp_engine = create_engine(base_url + "/mysql")  # Utilise la DB système 'mysql'
            
            with temp_engine.connect() as conn:
                # Vérifier si la base existe
                result = conn.execute(text(f"SHOW DATABASES LIKE '{db_name}'"))
                if not result.fetchone():
                    # Créer la base de données
                    conn.execute(text(f"CREATE DATABASE {db_name}"))
                    conn.commit()
                    logger.info(f"✅ Base de données '{db_name}' créée avec succès")
                else:
                    logger.info(f"ℹ️ Base de données '{db_name}' existe déjà")
            
            temp_engine.dispose()
            
    except Exception as e:
        logger.error(f"❌ Erreur lors de la création de la base de données: {e}")
        logger.info("💡 Assurez-vous que MySQL est démarré et que les identifiants sont corrects")
        raise