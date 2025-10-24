#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Script simple pour redémarrer le serveur NovaCore"""

import subprocess
import sys
import time
import requests
import os

def check_server_running(url="http://localhost:8000"):
    """Vérifie si le serveur répond"""
    try:
        response = requests.get(url, timeout=5)
        return response.status_code == 200
    except:
        return False

def main():
    print("=== REDEMARRAGE SIMPLE DU SERVEUR NOVACORE ===\n")
    
    # 1. Vérifier l'état actuel
    print("1. Verification de l'etat actuel...")
    if check_server_running():
        print("[INFO] Un serveur tourne deja sur le port 8000")
        
        # Test du message pour voir si c'est le bon serveur
        try:
            response = requests.get("http://localhost:8000/", timeout=5)
            data = response.json()
            message = data.get('message', '')
            
            if "Bienvenue sur l'API NovaCore" in message:
                print("[OK] Le bon serveur tourne deja!")
                return True
            else:
                print(f"[ATTENTION] Serveur different detecte: {message}")
                print("Veuillez arreter manuellement le serveur actuel")
                print("Puis relancer avec: python run.py")
                return False
        except:
            print("[ERREUR] Impossible de verifier le serveur")
    else:
        print("[INFO] Aucun serveur detecte")
    
    # 2. Démarrer le serveur
    print("\n2. Demarrage du serveur...")
    print("Repertoire:", os.getcwd())
    
    try:
        print("Lancement de: python run.py")
        print("ATTENTION: Le serveur va se lancer en mode interactif")
        print("Appuyez sur Ctrl+C pour l'arreter plus tard")
        
        # Lancer le serveur en mode interactif
        subprocess.run([sys.executable, "run.py"])
        
    except KeyboardInterrupt:
        print("\nServeur arrete par l'utilisateur")
    except Exception as e:
        print(f"[ERREUR] Erreur lors du demarrage: {e}")
        return False

if __name__ == "__main__":
    main()