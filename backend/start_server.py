#!/usr/bin/env python3
"""
Script pour démarrer le serveur FastAPI avec gestion d'erreur
"""
import uvicorn
import sys
import os

# Ajouter le répertoire backend au path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def main():
    try:
        print("Démarrage du serveur NovaCore...")
        print("URL: http://127.0.0.1:8000")
        print("Documentation API: http://127.0.0.1:8000/docs")
        print("Appuyez sur Ctrl+C pour arrêter")
        
        uvicorn.run(
            "app.main:app",
            host="127.0.0.1",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\nServeur arrêté par l'utilisateur")
    except Exception as e:
        print(f"Erreur lors du démarrage: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()