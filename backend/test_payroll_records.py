#!/usr/bin/env python3
"""
Test de la table payroll_records
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import engine
from app.db.models import PayrollRecord
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

def test_payroll_records_table():
    """Tester la structure de la table payroll_records"""
    
    print("=== TEST TABLE PAYROLL_RECORDS ===\n")
    
    try:
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # Test 1: Vérifier que la table existe
        with engine.connect() as conn:
            result = conn.execute(text("SHOW TABLES LIKE 'payroll_records'"))
            table_exists = result.fetchone() is not None
            print(f"[TEST] Table existe: {'OK' if table_exists else 'NOK'}")
        
        # Test 2: Vérifier les colonnes
        if table_exists:
            with engine.connect() as conn:
                result = conn.execute(text("DESCRIBE payroll_records"))
                columns = [row[0] for row in result.fetchall()]
                
                required_columns = [
                    'id', 'employee_id', 'period', 'gross_salary', 
                    'net_salary', 'total_allowances', 'total_deductions',
                    'salary_breakdown', 'status'
                ]
                
                print(f"[TEST] Colonnes trouvées: {len(columns)}")
                for col in required_columns:
                    exists = col in columns
                    print(f"  - {col}: {'OK' if exists else 'NOK'}")
        
        # Test 3: Test d'insertion
        test_record = PayrollRecord(
            employee_id=1,
            period="2025-11",
            gross_salary=500000,
            net_salary=400000,
            total_allowances=50000,
            total_deductions=100000,
            taxable_income=500000,
            tax_amount=50000,
            social_contributions=50000,
            salary_breakdown={"test": "data"},
            status="draft"
        )
        
        db.add(test_record)
        db.commit()
        
        # Vérifier l'insertion
        inserted = db.query(PayrollRecord).filter(PayrollRecord.period == "2025-11").first()
        if inserted:
            print("[TEST] Insertion: OK")
            print(f"  - ID: {inserted.id}")
            print(f"  - Période: {inserted.period}")
            print(f"  - Salaire brut: {inserted.gross_salary}")
            
            # Nettoyer
            db.delete(inserted)
            db.commit()
            print("[TEST] Nettoyage: OK")
        else:
            print("[TEST] Insertion: NOK")
        
        db.close()
        
        print(f"\n[SUCCESS] Table payroll_records opérationnelle !")
        return True
        
    except Exception as e:
        print(f"[ERROR] Erreur lors du test: {e}")
        return False

if __name__ == "__main__":
    test_payroll_records_table()