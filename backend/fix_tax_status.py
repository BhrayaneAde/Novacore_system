#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import engine
from sqlalchemy import text

def add_tax_status_column():
    """Add tax_status column to employees table"""
    
    try:
        with engine.connect() as conn:
            # Check if tax_status column exists
            result = conn.execute(text('SHOW COLUMNS FROM employees'))
            existing_columns = [row[0] for row in result.fetchall()]
            
            if 'tax_status' not in existing_columns:
                # Add the missing column
                sql = 'ALTER TABLE employees ADD COLUMN tax_status VARCHAR(50)'
                conn.execute(text(sql))
                conn.commit()
                print("tax_status column added successfully")
            else:
                print("tax_status column already exists")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    add_tax_status_column()