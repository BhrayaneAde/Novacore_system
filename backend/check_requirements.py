#!/usr/bin/env python3
"""
Script de vérification des prérequis pour NovaCore Backend
"""

import sys
import subprocess
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_python_version():
    """Vérifie la version de Python"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        logger.error("❌ Python 3.8+ requis. Version actuelle: {}.{}.{}".format(
            version.major, version.minor, version.micro))
        return False
    logger.info(f"✅ Python {version.major}.{version.minor}.{version.micro}")
    return True

def check_mysql_connection():
    """Vérifie si MySQL est accessible"""
    mysql_packages = [("pymysql", "pymysql"), ("mysql-connector", "mysql.connector"), ("mysqlclient", "MySQLdb")]
    
    found_mysql = False
    for display_name, import_name in mysql_packages:
        try:
            __import__(import_name)
            logger.info(f"✅ {display_name}")
            found_mysql = True
        except ImportError:
            continue
    
    if not found_mysql:
        logger.warning("⚠️ Aucun driver MySQL trouvé")
        return False
    
    return True

def check_dependencies():
    """Vérifie les dépendances principales"""
    packages_to_check = [
        ("fastapi", "fastapi"),
        ("uvicorn", "uvicorn"), 
        ("sqlalchemy", "sqlalchemy"),
        ("pydantic", "pydantic"),
        ("python-dotenv", "dotenv"),
        ("passlib", "passlib")
    ]
    
    missing = []
    for display_name, import_name in packages_to_check:
        try:
            __import__(import_name)
            logger.info(f"✅ {display_name}")
        except ImportError:
            missing.append(display_name)
            logger.error(f"❌ {display_name} manquant")
    
    return len(missing) == 0

def main():
    """Fonction principale de vérification"""
    logger.info("🔍 Vérification des prérequis NovaCore Backend...")
    
    checks = [
        ("Version Python", check_python_version),
        ("Dépendances", check_dependencies),
        ("MySQL", check_mysql_connection),
    ]
    
    all_good = True
    for name, check_func in checks:
        logger.info(f"\n📋 {name}:")
        if not check_func():
            all_good = False
    
    if all_good:
        logger.info("\n🎉 Tous les prérequis sont satisfaits !")
        logger.info("💡 Vous pouvez démarrer avec: python run.py")
    else:
        logger.error("\n❌ Certains prérequis ne sont pas satisfaits")
        logger.info("💡 Installez les dépendances avec: pip install -r requirements.txt")
    
    return all_good

if __name__ == "__main__":
    main()