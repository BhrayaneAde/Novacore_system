#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db import models

def debug_employees():
    db = SessionLocal()
    try:
        # Get all employees
        employees = db.query(models.Employee).all()
        print(f"Total employees: {len(employees)}")
        
        for employee in employees:
            print(f"Employee ID: {employee.id}")
            print(f"Name: {employee.name}")
            print(f"Email: {employee.email}")
            print(f"Company ID: {employee.company_id}")
            print(f"Role: {employee.role}")
            print("---")
            
    finally:
        db.close()

if __name__ == "__main__":
    debug_employees()