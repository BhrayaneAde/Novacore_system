#!/usr/bin/env python3

import requests
import json

def test_login():
    # Test login endpoint
    login_url = "http://localhost:8000/api/v1/auth/login"
    
    # Test with admin user
    login_data = {
        "username": "admin@techcorp.com",
        "password": "admin123"  # This might not be the correct password
    }
    
    try:
        response = requests.post(login_url, data=login_data)
        print(f"Login response status: {response.status_code}")
        print(f"Login response: {response.text}")
        
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get("access_token")
            print(f"Token: {token}")
            
            # Test employees endpoint with token
            employees_url = "http://localhost:8000/api/v1/hr/employees"
            headers = {"Authorization": f"Bearer {token}"}
            
            employees_response = requests.get(employees_url, headers=headers)
            print(f"Employees response status: {employees_response.status_code}")
            print(f"Employees response: {employees_response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login()