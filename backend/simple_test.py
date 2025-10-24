#!/usr/bin/env python3
"""Test simple de l'API NovaCore"""

import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_api():
    print("=== TEST API NOVACORE ===\n")
    
    # Test 1: Endpoint root
    print("1. Test endpoint root...")
    try:
        response = requests.get("http://localhost:8000/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   Erreur: {e}")
    
    # Test 2: Login
    print("\n2. Test login...")
    try:
        data = {
            "username": "admin@techcorp.com",
            "password": "NovaCore123"
        }
        response = requests.post(f"{BASE_URL}/auth/login", data=data)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            print("   Login reussi!")
            token = token_data['access_token']
            print(f"   Token: {token[:50]}...")
            
            # Test 3: Endpoint protege
            print("\n3. Test endpoint protege...")
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(f"{BASE_URL}/users/me", headers=headers)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                user = response.json()
                print(f"   Utilisateur: {user['first_name']} {user['last_name']}")
                print(f"   Role: {user['role']}")
            else:
                print(f"   Erreur: {response.text}")
            
            # Test 4: Employes
            print("\n4. Test employes...")
            response = requests.get(f"{BASE_URL}/hr/", headers=headers)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                employees = response.json()
                print(f"   Nombre d'employes: {len(employees)}")
                if employees:
                    print(f"   Premier employe: {employees[0]['name']}")
            else:
                print(f"   Erreur: {response.text}")
                
        else:
            print(f"   Erreur login: {response.text}")
    
    except Exception as e:
        print(f"   Erreur: {e}")
    
    print("\n=== FIN DES TESTS ===")

if __name__ == "__main__":
    test_api()