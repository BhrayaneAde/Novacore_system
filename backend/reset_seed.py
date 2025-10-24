#!/usr/bin/env python3
"""
Script pour réinitialiser le marqueur de seeding
Utilise ce script si tu veux forcer une nouvelle exécution du seeder
"""

import os
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SEED_MARKER_FILE = ".seed_completed"

def reset_seed_marker():
    """Supprime le fichier marqueur pour permettre une nouvelle exécution du seeder"""
    if os.path.exists(SEED_MARKER_FILE):
        os.remove(SEED_MARKER_FILE)
        logger.info("✅ Marqueur de seeding supprimé. Le seeder s'exécutera au prochain démarrage.")
    else:
        logger.info("ℹ️ Aucun marqueur de seeding trouvé. Le seeder s'exécutera au prochain démarrage.")

if __name__ == "__main__":
    logger.info("🔄 Réinitialisation du marqueur de seeding...")
    reset_seed_marker()