#!/usr/bin/env python3
"""Script pour vider la base de données et relancer le seeder"""

import os
import logging
from sqlalchemy import text
from app.db.database import SessionLocal, engine, Base
from app.db import models

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def reset_database():
    """Vide complètement la base de données et recrée les tables"""
    logger.info("🗑️ Suppression de toutes les données...")
    
    db = SessionLocal()
    try:
        # Désactiver les contraintes de clés étrangères
        db.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
        
        # Supprimer les données table par table
        tables_to_clear = [
            'notifications', 'evaluations', 'leave_requests', 'tasks', 
            'contract_templates', 'employees', 'users', 'departments', 'companies'
        ]
        
        for table in tables_to_clear:
            try:
                db.execute(text(f"DELETE FROM {table}"))
                logger.info(f"✅ Table {table} vidée")
            except Exception as e:
                logger.warning(f"⚠️ Erreur lors de la suppression de {table}: {e}")
        
        # Réactiver les contraintes
        db.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
        db.commit()
        logger.info("✅ Base de données vidée")
        
        # Supprimer le fichier marqueur du seeder
        seed_file = ".seed_completed"
        if os.path.exists(seed_file):
            os.remove(seed_file)
            logger.info("✅ Fichier marqueur du seeder supprimé")
            
    except Exception as e:
        logger.error(f"❌ Erreur: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_database()
    
    # Relancer le seeder
    logger.info("🌱 Relancement du seeder...")
    from seed import run_seeder
    run_seeder()