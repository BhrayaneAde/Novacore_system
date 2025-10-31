#!/usr/bin/env python3
"""Script pour migrer la base de données et ajouter les colonnes manquantes"""

import logging
from sqlalchemy import text
from app.db.database import SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def migrate_database():
    """Ajoute les colonnes manquantes à la base de données"""
    logger.info("🔄 Migration de la base de données...")
    
    db = SessionLocal()
    try:
        # Ajouter la colonne google_drive_config si elle n'existe pas
        try:
            db.execute(text("ALTER TABLE companies ADD COLUMN google_drive_config JSON"))
            logger.info("✅ Colonne google_drive_config ajoutée")
        except Exception as e:
            if "Duplicate column name" in str(e):
                logger.info("ℹ️ Colonne google_drive_config existe déjà")
            else:
                logger.warning(f"⚠️ Erreur lors de l'ajout de google_drive_config: {e}")
        
        # Ajouter les colonnes pour la surveillance email des offres d'emploi
        job_opening_columns = [
            "ALTER TABLE job_openings ADD COLUMN email_keywords JSON",
            "ALTER TABLE job_openings ADD COLUMN auto_screening_enabled BOOLEAN DEFAULT TRUE",
            "ALTER TABLE job_openings ADD COLUMN screening_criteria JSON",
            "ALTER TABLE job_openings ADD COLUMN candidates_count INTEGER DEFAULT 0",
            "ALTER TABLE job_openings ADD COLUMN department_id INTEGER",
            "ALTER TABLE job_openings ADD CONSTRAINT fk_job_openings_department FOREIGN KEY (department_id) REFERENCES departments(id)"
        ]
        
        for sql in job_opening_columns:
            try:
                db.execute(text(sql))
                logger.info(f"✅ {sql.split()[3]} ajoutée")
            except Exception as e:
                if "Duplicate column name" in str(e) or "Duplicate key name" in str(e):
                    logger.info(f"ℹ️ {sql.split()[3]} existe déjà")
                else:
                    logger.warning(f"⚠️ Erreur: {e}")
        
        db.commit()
        logger.info("✅ Migration terminée")
        
    except Exception as e:
        logger.error(f"❌ Erreur de migration: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    migrate_database()