#!/usr/bin/env python3
"""
Script pour créer la table payroll_variables
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import engine
from sqlalchemy import text

def create_payroll_variables_table():
    """Créer la table payroll_variables"""
    
    # Supprimer la table existante si elle existe
    drop_sql = "DROP TABLE IF EXISTS payroll_variables"
    
    # Créer la nouvelle table
    create_sql = """
    CREATE TABLE payroll_variables (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_id INT NOT NULL,
        code VARCHAR(10) NOT NULL,
        name VARCHAR(100) NOT NULL,
        variable_type ENUM('fixe', 'prime', 'indemnite', 'retenue', 'cotisation', 'impot') NOT NULL,
        is_mandatory BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        calculation_method VARCHAR(20),
        fixed_amount FLOAT,
        percentage_rate FLOAT,
        formula VARCHAR(500),
        description TEXT,
        display_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id)
    )
    """
    
    try:
        with engine.connect() as conn:
            print("Suppression de l'ancienne table payroll_variables...")
            conn.execute(text(drop_sql))
            
            print("Creation de la nouvelle table payroll_variables...")
            conn.execute(text(create_sql))
            
            conn.commit()
            print("Table payroll_variables creee avec succes!")
            
    except Exception as e:
        print(f"Erreur: {e}")

if __name__ == "__main__":
    create_payroll_variables_table()