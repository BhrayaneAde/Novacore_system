#!/usr/bin/env python3

import requests
import json

def test_employees_direct():
    # First login to get token
    login_url = "http://localhost:8000/api/v1/auth/login"
    login_data = {
        "username": "admin@techcorp.com",
        "password": "admin123"
    }
    
    try:
        # Login
        response = requests.post(login_url, data=login_data)
        if response.status_code != 200:
            print(f"Login failed: {response.text}")
            return
            
        token_data = response.json()
        token = token_data.get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test different URLs to see which one works
        test_urls = [
            "http://localhost:8000/api/v1/hr/employees",
            "http://localhost:8000/api/v1/hr/employees/",
            "http://localhost:8000/api/v1/employees",
            "http://localhost:8000/api/v1/employees/"
        ]
        
        for url in test_urls:
            print(f"\nTesting URL: {url}")
            try:
                employees_response = requests.get(url, headers=headers)
                print(f"Status: {employees_response.status_code}")
                if employees_response.status_code == 422:
                    print(f"Error details: {employees_response.text}")
                elif employees_response.status_code == 200:
                    data = employees_response.json()
                    print(f"Success! Found {len(data)} employees")
                else:
                    print(f"Response: {employees_response.text}")
            except Exception as e:
                print(f"Request failed: {e}")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_employees_direct()