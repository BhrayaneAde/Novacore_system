#!/usr/bin/env python3
"""
Script pour créer la table payroll_configs avec les bonnes colonnes
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import engine
from sqlalchemy import text

def create_payroll_table():
    """Créer la table payroll_configs avec les bonnes colonnes"""
    
    # Supprimer la table existante si elle existe
    drop_sql = "DROP TABLE IF EXISTS payroll_configs"
    
    # Créer la nouvelle table avec toutes les colonnes
    create_sql = """
    CREATE TABLE payroll_configs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_id INT NOT NULL,
        company_type ENUM('PME', 'Grande Entreprise', 'Secteur Public', 'ONG', 'BTP/Industrie', 'Banque/Assurance') NOT NULL,
        country_code VARCHAR(3) DEFAULT 'BJ',
        currency_code VARCHAR(3) DEFAULT 'XOF',
        payroll_variables JSON,
        tax_rates JSON,
        formulas JSON,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id)
    )
    """
    
    try:
        with engine.connect() as conn:
            print("Suppression de l'ancienne table...")
            conn.execute(text(drop_sql))
            
            print("Création de la nouvelle table payroll_configs...")
            conn.execute(text(create_sql))
            
            conn.commit()
            print("Table payroll_configs créée avec succès!")
            
    except Exception as e:
        print(f"Erreur: {e}")

if __name__ == "__main__":
    create_payroll_table()