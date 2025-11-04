#!/usr/bin/env python3
"""
Script de test pour vérifier les endpoints API
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_endpoint(endpoint, method="GET", data=None, headers=None):
    """Tester un endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers)
        
        print(f"\n{method} {endpoint}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("SUCCESS")
            try:
                result = response.json()
                if isinstance(result, dict) and len(result) > 0:
                    print(f"Response keys: {list(result.keys())}")
                elif isinstance(result, list):
                    print(f"Response list length: {len(result)}")
            except:
                print("Response is not JSON")
        else:
            print("FAILED")
            print(f"Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print(f"CONNECTION ERROR - Server not running on {BASE_URL}")
    except Exception as e:
        print(f"ERROR: {str(e)}")

def main():
    print("Testing NovaCore API Endpoints")
    print("=" * 50)
    
    # Test endpoints sans authentification
    test_endpoint("/candidates")
    test_endpoint("/payroll-config/")
    test_endpoint("/payroll-config/templates")
    test_endpoint("/payroll-config/tax-rates")
    test_endpoint("/payroll-config/test")
    test_endpoint("/payroll-config/debug")
    test_endpoint("/payroll-config/config-test")
    test_endpoint("/payroll-config/no-auth")
    test_endpoint("/recruitment/candidates")
    test_endpoint("/auto-recruitment/candidates")
    
    print("\n" + "=" * 50)
    print("Test completed!")
    print("\nNote: Some endpoints may require authentication")
    print("If you see 401/403 errors, that's expected for protected endpoints")

if __name__ == "__main__":
    main()