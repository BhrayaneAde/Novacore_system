#!/usr/bin/env python3
"""
Script pour créer les tables de paie manquantes
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import engine
from app.db.models import Base, PayrollConfig, PayrollVariable, PayrollTemplate, EmployeePayrollData

def create_payroll_tables():
    """Créer uniquement les tables de paie"""
    try:
        # Créer les tables de paie
        PayrollConfig.__table__.create(engine, checkfirst=True)
        PayrollVariable.__table__.create(engine, checkfirst=True)
        PayrollTemplate.__table__.create(engine, checkfirst=True)
        EmployeePayrollData.__table__.create(engine, checkfirst=True)
        
        print("Tables de paie creees avec succes:")
        print("  - payroll_configs")
        print("  - payroll_variables") 
        print("  - payroll_templates")
        print("  - employee_payroll_data")
        
    except Exception as e:
        print(f"Erreur lors de la creation des tables: {e}")

if __name__ == "__main__":
    create_payroll_tables()