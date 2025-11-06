#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import engine
from sqlalchemy import text

def check_missing_columns():
    """Check for missing columns in employees table"""
    
    # Expected columns from the Employee model
    expected_columns = [
        'seniority_years', 'grade', 'level', 
        'custom_allowances', 'custom_deductions'
    ]
    
    try:
        with engine.connect() as conn:
            # Get existing columns
            result = conn.execute(text('SHOW COLUMNS FROM employees'))
            existing_columns = [row[0] for row in result.fetchall()]
            
            print("Existing columns:", existing_columns)
            
            # Check for missing columns
            missing = [col for col in expected_columns if col not in existing_columns]
            
            if missing:
                print(f"Missing columns: {missing}")
                
                # Add missing columns
                for col in missing:
                    if col in ['seniority_years']:
                        sql = f'ALTER TABLE employees ADD COLUMN {col} FLOAT DEFAULT 0'
                    elif col in ['grade', 'level']:
                        sql = f'ALTER TABLE employees ADD COLUMN {col} VARCHAR(50)'
                    elif col in ['custom_allowances', 'custom_deductions']:
                        sql = f'ALTER TABLE employees ADD COLUMN {col} JSON'
                    
                    conn.execute(text(sql))
                    print(f"Added column: {col}")
                
                conn.commit()
                print("All missing columns added successfully")
            else:
                print("No missing columns found")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_missing_columns()