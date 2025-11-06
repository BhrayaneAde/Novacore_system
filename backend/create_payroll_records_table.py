#!/usr/bin/env python3
"""
Script pour créer/mettre à jour la table payroll_records
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.db.database import engine
from app.db.models import Base, PayrollRecord

def create_payroll_records_table():
    """Créer/mettre à jour la table payroll_records"""
    try:
        with engine.connect() as conn:
            # Supprimer la table existante si elle existe
            print("[INFO] Suppression de l'ancienne table payroll_records...")
            conn.execute(text("DROP TABLE IF EXISTS payroll_records"))
            conn.commit()
            
        # Créer la nouvelle table avec la bonne structure
        print("[INFO] Création de la nouvelle table payroll_records...")
        PayrollRecord.__table__.create(engine, checkfirst=True)
        
        print("[SUCCESS] Table payroll_records créée avec succès !")
        print("Colonnes disponibles :")
        print("  - id, employee_id, period")
        print("  - gross_salary, net_salary, total_allowances, total_deductions")
        print("  - taxable_income, tax_amount, social_contributions")
        print("  - salary_breakdown (JSON)")
        print("  - status, processed_date, validated_date")
        print("  - processed_by_id, validated_by_id")
        print("  - created_at, updated_at")
        
    except Exception as e:
        print(f"[ERROR] Erreur lors de la création: {e}")

if __name__ == "__main__":
    create_payroll_records_table()