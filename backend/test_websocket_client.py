#!/usr/bin/env python3
"""Client WebSocket interactif pour tester les notifications en temps réel"""

import asyncio
import websockets
import json
import requests
from datetime import datetime

BASE_URL = "http://localhost:8000/api/v1"
WS_URL = "ws://localhost:8000/api/v1/ws/ws"

async def interactive_websocket_client():
    """Client WebSocket interactif"""
    print("🔐 Connexion à l'API...")
    
    # Login pour obtenir le token
    data = {"username": "admin@techcorp.com", "password": "NovaCore123"}
    response = requests.post(f"{BASE_URL}/auth/login", data=data)
    
    if response.status_code != 200:
        print("❌ Échec de l'authentification")
        return
    
    token = response.json()["access_token"]
    print("✅ Authentification réussie")
    
    # Connexion WebSocket
    uri = f"{WS_URL}/{token}"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("🔌 Connexion WebSocket établie")
            
            # Écouter les messages en arrière-plan
            async def listen_messages():
                try:
                    async for message in websocket:
                        data = json.loads(message)
                        timestamp = datetime.now().strftime("%H:%M:%S")
                        
                        if data.get("type") == "connection":
                            print(f"\n[{timestamp}] 🎉 {data['message']}")
                            print(f"[{timestamp}] 📺 Canaux: {data.get('channels', [])}")
                        
                        elif data.get("type") == "notification":
                            print(f"\n[{timestamp}] 🔔 NOTIFICATION")
                            print(f"[{timestamp}] 📋 {data['title']}: {data['message']}")
                        
                        elif data.get("type") == "broadcast":
                            print(f"\n[{timestamp}] 📢 BROADCAST sur {data.get('channel', 'unknown')}")
                            print(f"[{timestamp}] 💬 {data['message']}")
                        
                        elif data.get("type") == "subscription":
                            print(f"\n[{timestamp}] 📺 {data['message']}")
                        
                        elif data.get("type") == "echo":
                            print(f"\n[{timestamp}] 🔄 {data['message']}")
                        
                        else:
                            print(f"\n[{timestamp}] 📨 Message: {data}")
                
                except websockets.exceptions.ConnectionClosed:
                    print("\n❌ Connexion WebSocket fermée")
            
            # Démarrer l'écoute en arrière-plan
            listen_task = asyncio.create_task(listen_messages())
            
            print("\n" + "="*60)
            print("🎮 CLIENT WEBSOCKET INTERACTIF")
            print("="*60)
            print("Commandes disponibles:")
            print("  sub <canal>     - S'abonner à un canal")
            print("  unsub <canal>   - Se désabonner d'un canal")
            print("  msg <texte>     - Envoyer un message")
            print("  quit            - Quitter")
            print("="*60)
            
            # Boucle interactive
            while True:
                try:
                    command = input("\n> ").strip()
                    
                    if command.lower() == "quit":
                        break
                    
                    elif command.startswith("sub "):
                        channel = command[4:].strip()
                        message = {
                            "action": "subscribe",
                            "channel": channel
                        }
                        await websocket.send(json.dumps(message))
                    
                    elif command.startswith("unsub "):
                        channel = command[6:].strip()
                        message = {
                            "action": "unsubscribe", 
                            "channel": channel
                        }
                        await websocket.send(json.dumps(message))
                    
                    elif command.startswith("msg "):
                        text = command[4:].strip()
                        message = {"message": text}
                        await websocket.send(json.dumps(message))
                    
                    elif command == "help":
                        print("Commandes: sub <canal>, unsub <canal>, msg <texte>, quit")
                    
                    else:
                        print("❓ Commande inconnue. Tapez 'help' pour l'aide")
                
                except KeyboardInterrupt:
                    break
                except Exception as e:
                    print(f"❌ Erreur: {e}")
            
            # Arrêter l'écoute
            listen_task.cancel()
            print("👋 Déconnexion...")
    
    except Exception as e:
        print(f"❌ Erreur de connexion WebSocket: {e}")

def main():
    """Point d'entrée principal"""
    print("🚀 Client WebSocket NovaCore\n")
    asyncio.run(interactive_websocket_client())

if __name__ == "__main__":
    main()