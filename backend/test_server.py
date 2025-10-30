#!/usr/bin/env python3

import requests
import sys

def test_server():
    try:
        # Test de base
        response = requests.get("http://127.0.0.1:8000/", timeout=5)
        print(f"✅ Serveur accessible - Status: {response.status_code}")
        
        # Test endpoint auth
        response = requests.get("http://127.0.0.1:8000/api/v1/", timeout=5)
        print(f"✅ API accessible - Status: {response.status_code}")
        
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Serveur non accessible sur http://127.0.0.1:8000")
        print("💡 Démarrez le serveur avec: uvicorn app.main:app --reload --host 127.0.0.1 --port 8000")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

if __name__ == "__main__":
    test_server()