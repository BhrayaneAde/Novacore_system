#!/usr/bin/env python3

import requests
import json

def test_fixed_employees():
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
        
        # Test the fixed employees endpoint
        employees_url = "http://localhost:8000/api/v1/hr/employees"
        
        print(f"Testing URL: {employees_url}")
        employees_response = requests.get(employees_url, headers=headers)
        print(f"Status: {employees_response.status_code}")
        
        if employees_response.status_code == 200:
            data = employees_response.json()
            print(f"Success! Found {len(data)} employees")
            if data:
                print(f"First employee: {data[0]['name']} - {data[0]['email']}")
        else:
            print(f"Error: {employees_response.text}")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_fixed_employees()