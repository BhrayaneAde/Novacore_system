#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.security import create_access_token, decode_token
from app.crud import crud_user
from app.db.database import SessionLocal

def test_token():
    db = SessionLocal()
    try:
        # Get a test user
        user = crud_user.get_user_by_email(db, "admin@techcorp.com")
        if user:
            print(f"User found: {user.email}, ID: {user.id}, Company: {user.company_id}")
            
            # Create a token for this user
            token = create_access_token(subject=user.id)
            print(f"Generated token: {token}")
            
            # Decode the token
            payload = decode_token(token)
            print(f"Decoded payload: {payload}")
            
        else:
            print("No user found")
            
    finally:
        db.close()

if __name__ == "__main__":
    test_token()