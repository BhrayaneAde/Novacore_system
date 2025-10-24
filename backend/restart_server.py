#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Script pour redémarrer le serveur NovaCore avec la bonne configuration"""

import subprocess
import sys
import time
import requests
import psutil
import os

def kill_process_on_port(port):
    """Tue tous les processus utilisant le port spécifié"""
    print(f"Recherche des processus sur le port {port}...")
    
    killed = False
    for proc in psutil.process_iter(['pid', 'name', 'connections']):
        try:
            for conn in proc.info['connections'] or []:
                if conn.laddr.port == port:
                    print(f"Arret du processus {proc.info['name']} (PID: {proc.info['pid']})")
                    proc.kill()
                    proc.wait()
                    killed = True
                    time.sleep(1)
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    
    if not killed:
        print("Aucun processus trouve sur le port")

def check_server_running(url="http://localhost:8000"):
    """Vérifie si le serveur répond"""
    try:
        response = requests.get(url, timeout=5)
        return response.status_code == 200
    except:
        return False

def main():
    print("=== REDEMARRAGE DU SERVEUR NOVACORE ===\n")
    
    # 1. Arrêter le serveur actuel
    print("1. Arret du serveur actuel...")
    kill_process_on_port(8000)
    
    # Attendre que le port soit libéré
    time.sleep(3)
    
    # 2. Vérifier que le serveur est arrêté
    if check_server_running():
        print("[ERREUR] Le serveur est encore en cours d'execution")
        print("Veuillez arreter manuellement le processus sur le port 8000")
        return False
    else:
        print("[OK] Serveur arrete")
    
    # 3. Démarrer le nouveau serveur
    print("\n2. Demarrage du serveur avec la configuration complete...")
    print("Repertoire:", os.getcwd())
    
    try:
        # Lancer le serveur
        print("Lancement de: python run.py")
        process = subprocess.Popen([
            sys.executable, "run.py"
        ])
        
        print("Serveur en cours de demarrage...")
        
        # Attendre que le serveur démarre
        for i in range(30):  # Attendre max 30 secondes
            time.sleep(1)
            if check_server_running():
                print("[OK] Serveur demarre avec succes!")
                print("Serveur disponible sur: http://localhost:8000")
                print("Documentation API: http://localhost:8000/docs")
                
                # Test rapide des routes
                print("\n3. Test des routes API...")
                try:
                    # Test du message root
                    response = requests.get("http://localhost:8000/", timeout=5)
                    if response.status_code == 200:
                        data = response.json()
                        if "Bienvenue sur l'API NovaCore" in data.get('message', ''):
                            print("[OK] Configuration correcte detectee")
                        else:
                            print(f"[ATTENTION] Message inattendu: {data.get('message', '')}")
                    
                    # Test route login
                    response = requests.get("http://localhost:8000/api/v1/auth/login", timeout=5)
                    if response.status_code == 405:  # Method not allowed (normal pour GET sur POST endpoint)
                        print("[OK] Route /api/v1/auth/login trouvee")
                    else:
                        print(f"[ATTENTION] Route login status: {response.status_code}")
                        
                except Exception as e:
                    print(f"[ERREUR] Test routes: {e}")
                
                return True
            
            print(f"Attente du demarrage... ({i+1}/30)")
        
        print("[ERREUR] Le serveur n'a pas demarre dans les temps")
        return False
        
    except Exception as e:
        print(f"[ERREUR] Erreur lors du demarrage: {e}")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print("\nServeur redemarre avec succes!")
        print("Vous pouvez maintenant executer: python simple_test.py")
    else:
        print("\nEchec du redemarrage")
        sys.exit(1)