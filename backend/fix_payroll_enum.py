#!/usr/bin/env python3
"""
Script pour corriger l'enum VariableTypeEnum et recréer les tables
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.db.database import engine, get_db
from app.db.models import Base, PayrollConfig, PayrollVariable, PayrollTemplate, EmployeePayrollData

def fix_payroll_enum():
    """Corriger l'enum et recréer les tables"""
    try:
        with engine.connect() as conn:
            # Supprimer les tables existantes pour éviter les conflits d'enum
            print("[INFO] Suppression des tables de paie existantes...")
            conn.execute(text("DROP TABLE IF EXISTS employee_payroll_data"))
            conn.execute(text("DROP TABLE IF EXISTS payroll_variables"))
            conn.execute(text("DROP TABLE IF EXISTS payroll_configs"))
            conn.execute(text("DROP TABLE IF EXISTS payroll_templates"))
            conn.commit()
            
        # Recréer les tables avec le bon enum
        print("[INFO] Creation des nouvelles tables...")
        PayrollConfig.__table__.create(engine, checkfirst=True)
        PayrollVariable.__table__.create(engine, checkfirst=True)
        PayrollTemplate.__table__.create(engine, checkfirst=True)
        EmployeePayrollData.__table__.create(engine, checkfirst=True)
        
        print("[SUCCESS] Tables de paie corrigees avec succes:")
        print("  - payroll_configs")
        print("  - payroll_variables") 
        print("  - payroll_templates")
        print("  - employee_payroll_data")
        print("  - Enum VariableTypeEnum corrige (FIXE, PRIME, etc.)")
        
    except Exception as e:
        print(f"[ERROR] Erreur lors de la correction: {e}")

if __name__ == "__main__":
    fix_payroll_enum()