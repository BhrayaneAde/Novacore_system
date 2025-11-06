#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import engine
from sqlalchemy import text

def migrate_employees_table():
    """Ajouter les colonnes manquantes à la table employees"""
    
    new_columns = [
        ('children_count', 'INTEGER DEFAULT 0'),
        ('tax_status', 'VARCHAR(50)'),
        ('seniority_years', 'FLOAT DEFAULT 0'),
        ('grade', 'VARCHAR(50)'),
        ('level', 'VARCHAR(50)'),
        ('custom_allowances', 'JSON'),
        ('custom_deductions', 'JSON')
    ]
    
    try:
        with engine.connect() as conn:
            # Vérifier les colonnes existantes
            result = conn.execute(text('SHOW COLUMNS FROM employees'))
            existing_columns = [row[0] for row in result.fetchall()]
            
            print("Colonnes existantes dans employees:")
            for col in existing_columns:
                print(f"  - {col}")
            
            print("\nAjout des colonnes manquantes:")
            
            for col_name, col_definition in new_columns:
                if col_name not in existing_columns:
                    try:
                        sql = f'ALTER TABLE employees ADD COLUMN {col_name} {col_definition}'
                        conn.execute(text(sql))
                        print(f"  ✓ {col_name} ajoutée")
                    except Exception as e:
                        print(f"  ✗ {col_name}: {e}")
                else:
                    print(f"  - {col_name} existe déjà")
            
            conn.commit()
            print("\n✅ Migration terminée avec succès")
            
            # Vérification finale
            result = conn.execute(text('SHOW COLUMNS FROM employees'))
            final_columns = [row[0] for row in result.fetchall()]
            
            print(f"\nNombre total de colonnes: {len(final_columns)}")
            
            # Vérifier que toutes les nouvelles colonnes sont présentes
            all_present = all(col in final_columns for col, _ in new_columns)
            if all_present:
                print("✅ Toutes les nouvelles colonnes sont présentes")
            else:
                missing = [col for col, _ in new_columns if col not in final_columns]
                print(f"❌ Colonnes encore manquantes: {missing}")
                
    except Exception as e:
        print(f"❌ Erreur lors de la migration: {e}")

if __name__ == "__main__":
    migrate_employees_table()