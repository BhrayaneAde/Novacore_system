#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Script de diagnostic du serveur NovaCore"""

import requests
import json
import sys

# Configuration pour Windows
if sys.platform == "win32":
    import os
    os.system('chcp 65001 > nul')

def check_server():
    print("=== DIAGNOSTIC SERVEUR NOVACORE ===\n")
    
    base_url = "http://localhost:8000"
    
    # Test 1: Serveur de base
    print("1. Test serveur de base...")
    try:
        response = requests.get(base_url, timeout=5)
        print(f"   [OK] Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   [ERREUR] Erreur: {e}")
        return
    
    # Test 2: Documentation
    print("\n2. Test documentation...")
    try:
        response = requests.get(f"{base_url}/docs", timeout=5)
        print(f"   [OK] Status: {response.status_code}")
    except Exception as e:
        print(f"   [ERREUR] Erreur: {e}")
    
    # Test 3: Routes API v1
    print("\n3. Test routes API v1...")
    
    routes_to_test = [
        "/api/v1/auth/login",
        "/api/v1/users/",
        "/api/v1/hr/employees",
        "/api/v1/tasks/"
    ]
    
    for route in routes_to_test:
        try:
            response = requests.get(f"{base_url}{route}", timeout=5)
            if response.status_code == 404:
                print(f"   [ERREUR] {route} - Route non trouvee (404)")
            elif response.status_code == 405:
                print(f"   [OK] {route} - Route trouvee (405 Method Not Allowed)")
            elif response.status_code == 401:
                print(f"   [OK] {route} - Route trouvee (401 Unauthorized)")
            else:
                print(f"   [OK] {route} - Status: {response.status_code}")
        except Exception as e:
            print(f"   [ERREUR] {route} - Erreur: {e}")
    
    # Test 4: OpenAPI schema
    print("\n4. Test OpenAPI schema...")
    try:
        response = requests.get(f"{base_url}/openapi.json", timeout=5)
        if response.status_code == 200:
            schema = response.json()
            paths = list(schema.get('paths', {}).keys())
            print(f"   [OK] Schema trouve avec {len(paths)} routes")
            
            # Verifier si nos routes sont dans le schema
            api_v1_routes = [path for path in paths if path.startswith('/api/v1')]
            if api_v1_routes:
                print(f"   [OK] Routes API v1 trouvees: {len(api_v1_routes)}")
                print(f"   Exemples: {api_v1_routes[:3]}")
            else:
                print("   [ERREUR] Aucune route API v1 trouvee dans le schema")
        else:
            print(f"   [ERREUR] Schema non accessible: {response.status_code}")
    except Exception as e:
        print(f"   [ERREUR] Erreur schema: {e}")
    
    print("\n=== FIN DU DIAGNOSTIC ===")

if __name__ == "__main__":
    check_server()