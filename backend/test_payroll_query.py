#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import get_db
from app.db import models

def test_payroll_query():
    """Test the payroll records query"""
    
    try:
        db = next(get_db())
        
        # Test the exact query from the endpoint
        query = db.query(models.PayrollRecord).join(models.Employee)
        
        print("Query created successfully")
        
        records = query.all()
        print(f"Found {len(records)} payroll records")
        
        for record in records:
            print(f"Record ID: {record.id}, Employee: {record.employee.name}")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_payroll_query()