#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db import models
from app.core.security import get_password_hash

def create_test_user():
    db = SessionLocal()
    try:
        # Check if test user already exists
        existing_user = db.query(models.User).filter(models.User.email == "test@techcorp.com").first()
        
        if existing_user:
            # Update password
            existing_user.hashed_password = get_password_hash("test123")
            db.commit()
            print(f"Updated password for existing user: {existing_user.email}")
        else:
            # Create new test user
            test_user = models.User(
                email="test@techcorp.com",
                hashed_password=get_password_hash("test123"),
                first_name="Test",
                last_name="User",
                role=models.RoleEnum.hr_admin,
                company_id=12,  # TechCorp
                is_active=True
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
            print(f"Created test user: {test_user.email} with password: test123")
            
        # Also update admin password for testing
        admin_user = db.query(models.User).filter(models.User.email == "admin@techcorp.com").first()
        if admin_user:
            admin_user.hashed_password = get_password_hash("admin123")
            db.commit()
            print(f"Updated admin password: admin@techcorp.com with password: admin123")
            
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()