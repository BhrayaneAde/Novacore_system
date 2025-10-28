#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.crud import crud_user
from app.db import models

def debug_users():
    db = SessionLocal()
    try:
        # Get all users
        users = db.query(models.User).all()
        print(f"Total users: {len(users)}")
        
        for user in users:
            print(f"User ID: {user.id}")
            print(f"Email: {user.email}")
            print(f"Role: {user.role}")
            print(f"Company ID: {user.company_id}")
            print(f"Is Active: {user.is_active}")
            print("---")
            
        # Check if there are any companies
        companies = db.query(models.Company).all()
        print(f"Total companies: {len(companies)}")
        
        for company in companies:
            print(f"Company ID: {company.id}")
            print(f"Company Name: {company.name}")
            print(f"Company Email: {company.email}")
            print("---")
            
    finally:
        db.close()

if __name__ == "__main__":
    debug_users()