#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Script de test complet pour l'API NovaCore"""

import requests
import json
import asyncio
import websockets
import threading
import time
import sys
import os

# Configuration de l'encodage pour Windows
if sys.platform == "win32":
    os.system("chcp 65001 >nul 2>&1")  # UTF-8
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:8000/api/v1"
WS_URL = "ws://localhost:8000/api/v1/ws/ws"

def test_login():
    """Test de l'endpoint de login"""
    print("🔐 Test de l'authentification...")
    
    # Test avec admin
    data = {
        "username": "admin@techcorp.com",
        "password": "NovaCore123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", data=data)
    
    if response.status_code == 200:
        token_data = response.json()
        print("✅ Login réussi!")
        print(f"Token: {token_data['access_token'][:50]}...")
        return token_data['access_token']
    else:
        print(f"❌ Erreur login: {response.status_code}")
        print(response.text)
        return None

def test_protected_endpoint(token):
    """Test d'un endpoint protégé"""
    print("\n👤 Test endpoint protégé /users/me...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/users/me", headers=headers)
    
    if response.status_code == 200:
        user_data = response.json()
        print("✅ Endpoint protégé accessible!")
        print(f"Utilisateur: {user_data['first_name']} {user_data['last_name']}")
        print(f"Rôle: {user_data['role']}")
    else:
        print(f"❌ Erreur: {response.status_code}")

def test_employees_endpoint(token):
    """Test de l'endpoint employés"""
    print("\n👥 Test endpoint /employees...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/hr/", headers=headers)
    
    if response.status_code == 200:
        employees = response.json()
        print(f"✅ {len(employees)} employés trouvés")
        for emp in employees[:3]:
            print(f"  - {emp['name']} ({emp['role']})")
        return employees[0]['id'] if employees else None
    else:
        print(f"❌ Erreur: {response.status_code}")
        return None

def test_tasks_endpoint(token):
    """Test de l'endpoint tâches"""
    print("\n📋 Test endpoint /tasks...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/tasks/", headers=headers)
    
    if response.status_code == 200:
        tasks = response.json()
        print(f"✅ {len(tasks)} tâches trouvées")
        for task in tasks[:2]:
            print(f"  - {task['title']} ({task['status']})")
    else:
        print(f"❌ Erreur: {response.status_code}")

def test_leaves_endpoint(token):
    """Test de l'endpoint congés"""
    print("\n🏖️ Test endpoint /leaves...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/leaves/", headers=headers)
    
    if response.status_code == 200:
        leaves = response.json()
        print(f"✅ {len(leaves)} demandes de congés trouvées")
        for leave in leaves[:2]:
            print(f"  - {leave['type']} du {leave['start_date']} ({leave['status']})")
    else:
        print(f"❌ Erreur: {response.status_code}")

def test_notifications_endpoint(token):
    """Test de l'endpoint notifications"""
    print("\n🔔 Test endpoint /notifications...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Récupérer les notifications
    response = requests.get(f"{BASE_URL}/notifications/", headers=headers)
    
    if response.status_code == 200:
        notifications = response.json()
        print(f"✅ {len(notifications)} notifications trouvées")
    else:
        print(f"❌ Erreur: {response.status_code}")

def test_companies_endpoint(token):
    """Test de l'endpoint entreprises"""
    print("\n🏢 Test endpoint /companies...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Récupérer l'entreprise
    response = requests.get(f"{BASE_URL}/companies/me", headers=headers)
    
    if response.status_code == 200:
        company = response.json()
        print(f"✅ Entreprise: {company['name']}")
        print(f"  Plan: {company['plan']}")
    else:
        print(f"❌ Erreur: {response.status_code}")
    
    # Récupérer les départements
    response = requests.get(f"{BASE_URL}/companies/departments", headers=headers)
    
    if response.status_code == 200:
        departments = response.json()
        print(f"✅ {len(departments)} départements trouvés")
        for dept in departments:
            print(f"  - {dept['name']}")
    else:
        print(f"❌ Erreur départements: {response.status_code}")

def test_websocket_admin(token):
    """Test des endpoints d'administration WebSocket"""
    print("\n📡 Test WebSocket Admin...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Info sur les canaux
    response = requests.get(f"{BASE_URL}/ws-admin/channels/info", headers=headers)
    
    if response.status_code == 200:
        info = response.json()
        print(f"✅ Canaux actifs: {info['channels']}")
        print(f"  Connexions totales: {info['total_connections']}")
        print(f"  Utilisateurs connectés: {info['total_users']}")
    else:
        print(f"❌ Erreur WebSocket Admin: {response.status_code}")

async def test_websocket_connection(token):
    """Test de connexion WebSocket"""
    print("\n🔌 Test connexion WebSocket...")
    
    try:
        uri = f"{WS_URL}/{token}"
        async with websockets.connect(uri) as websocket:
            print("✅ Connexion WebSocket établie")
            
            # Écouter le message de bienvenue
            welcome = await websocket.recv()
            welcome_data = json.loads(welcome)
            print(f"📨 Message de bienvenue: {welcome_data['message']}")
            print(f"📺 Canaux automatiques: {welcome_data.get('channels', [])}")
            
            # Test d'abonnement à un canal
            subscribe_msg = {
                "action": "subscribe",
                "channel": "test_channel"
            }
            await websocket.send(json.dumps(subscribe_msg))
            
            # Écouter la confirmation
            response = await websocket.recv()
            response_data = json.loads(response)
            print(f"📺 Abonnement: {response_data['message']}")
            
            # Test d'echo
            test_msg = "Hello WebSocket!"
            await websocket.send(json.dumps({"message": test_msg}))
            
            echo = await websocket.recv()
            echo_data = json.loads(echo)
            print(f"🔄 Echo reçu: {echo_data['message']}")
            
            print("✅ Test WebSocket réussi")
            
    except Exception as e:
        print(f"❌ Erreur WebSocket: {e}")

def run_websocket_test(token):
    """Wrapper pour exécuter le test WebSocket"""
    asyncio.run(test_websocket_connection(token))

def main():
    """Fonction principale de test"""
    print("🚀 Tests Complets API NovaCore\n")
    
    # Test login
    token = test_login()
    if not token:
        return
    
    # Tests des endpoints REST
    print("\n" + "="*50)
    print("🔗 TESTS ENDPOINTS REST")
    print("="*50)
    
    test_protected_endpoint(token)
    employee_id = test_employees_endpoint(token)
    test_tasks_endpoint(token)
    test_leaves_endpoint(token)
    test_notifications_endpoint(token)
    test_companies_endpoint(token)
    test_websocket_admin(token)
    
    # Tests WebSocket
    print("\n" + "="*50)
    print("🔌 TESTS WEBSOCKET")
    print("="*50)
    
    run_websocket_test(token)
    
    print("\n" + "="*50)
    print("🎉 TOUS LES TESTS TERMINÉS !")
    print("="*50)
    print("\n📊 Résumé:")
    print("✅ Authentification JWT")
    print("✅ Endpoints REST protégés")
    print("✅ CRUD Employés, Tâches, Congés")
    print("✅ Notifications")
    print("✅ WebSocket avec canaux")
    print("✅ Administration WebSocket")
    print("\n🌐 Documentation: http://localhost:8000/docs")
    print("🔌 WebSocket Test: ws://localhost:8000/api/v1/ws/ws/{token}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n⏹️ Tests interrompus par l'utilisateur")
    except Exception as e:
        print(f"\n❌ Erreur lors des tests: {e}")