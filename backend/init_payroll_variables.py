#!/usr/bin/env python3
"""
Script pour initialiser des variables de paie par défaut
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal, engine
from app.db.models import PayrollVariable, PayrollConfig, Base

def create_default_variables(company_id: int):
    """Créer des variables de paie par défaut pour une entreprise"""
    
    default_variables = [
        {
            "code": "SB",
            "name": "Salaire de base",
            "variable_type": "FIXE",
            "is_mandatory": True,
            "calculation_method": "fixed",
            "description": "Salaire de base mensuel",
            "display_order": 1
        },
        {
            "code": "TRANSPORT",
            "name": "Indemnité de transport",
            "variable_type": "INDEMNITE",
            "calculation_method": "fixed",
            "fixed_amount": 25000,
            "description": "Indemnité forfaitaire de transport",
            "display_order": 2
        },
        {
            "code": "LOGEMENT",
            "name": "Indemnité de logement",
            "variable_type": "INDEMNITE",
            "calculation_method": "percentage",
            "percentage_rate": 20.0,
            "description": "Indemnité de logement (20% du salaire de base)",
            "display_order": 3
        },
        {
            "code": "PRIME_ANCIENNETE",
            "name": "Prime d'ancienneté",
            "variable_type": "PRIME",
            "calculation_method": "percentage",
            "description": "Prime basée sur l'ancienneté",
            "display_order": 4
        },
        {
            "code": "CNSS_EMP",
            "name": "Cotisation CNSS employé",
            "variable_type": "COTISATION",
            "calculation_method": "percentage",
            "percentage_rate": 3.6,
            "description": "Cotisation CNSS employé (3.6%)",
            "display_order": 5
        },
        {
            "code": "IRPP",
            "name": "Impôt sur le revenu",
            "variable_type": "IMPOT",
            "calculation_method": "formula",
            "formula": "calculate_irpp(taxable_income)",
            "description": "Impôt progressif sur le revenu",
            "display_order": 6
        },
        {
            "code": "AVANCE",
            "name": "Avance sur salaire",
            "variable_type": "RETENUE",
            "calculation_method": "fixed",
            "description": "Avance remboursable sur salaire",
            "display_order": 7
        }
    ]
    
    db = SessionLocal()
    try:
        created_count = 0
        
        for var_data in default_variables:
            # Vérifier si la variable existe déjà
            existing = db.query(PayrollVariable).filter(
                PayrollVariable.company_id == company_id,
                PayrollVariable.code == var_data["code"]
            ).first()
            
            if not existing:
                db_variable = PayrollVariable(
                    company_id=company_id,
                    **var_data
                )
                db.add(db_variable)
                created_count += 1
                print(f"✅ Variable créée: {var_data['code']} - {var_data['name']}")
            else:
                print(f"⚠️  Variable existe déjà: {var_data['code']}")
        
        db.commit()
        print(f"\n🎉 {created_count} variables créées avec succès pour l'entreprise {company_id}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Erreur: {e}")
    finally:
        db.close()

def init_payroll_config(company_id: int):
    """Initialiser la configuration de paie pour une entreprise"""
    
    db = SessionLocal()
    try:
        # Vérifier si une config existe déjà
        existing_config = db.query(PayrollConfig).filter(
            PayrollConfig.company_id == company_id
        ).first()
        
        if existing_config:
            print(f"⚠️  Configuration existe déjà pour l'entreprise {company_id}")
            return
        
        # Créer la configuration
        config = PayrollConfig(
            company_id=company_id,
            company_type="PME",
            country_code="BJ",
            currency_code="XOF",
            payroll_variables={"variables": []},
            tax_rates={
                "irpp_brackets": [
                    {"min": 0, "max": 130000, "rate": 0},
                    {"min": 130001, "max": 300000, "rate": 10},
                    {"min": 300001, "max": 1000000, "rate": 20},
                    {"min": 1000001, "max": float('inf'), "rate": 35}
                ],
                "cnss_rate": 3.6,
                "cnss_employer_rate": 16.4
            },
            formulas={},
            is_active=True
        )
        
        db.add(config)
        db.commit()
        print(f"✅ Configuration créée pour l'entreprise {company_id}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Erreur création config: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Initialisation des variables de paie")
    print("=" * 50)
    
    # Créer les tables si elles n'existent pas
    Base.metadata.create_all(bind=engine)
    
    # Demander l'ID de l'entreprise
    try:
        company_id = int(input("Entrez l'ID de l'entreprise: "))
        
        print(f"\n📋 Initialisation pour l'entreprise {company_id}...")
        
        # Initialiser la configuration
        init_payroll_config(company_id)
        
        # Créer les variables par défaut
        create_default_variables(company_id)
        
        print("\n✅ Initialisation terminée!")
        
    except ValueError:
        print("❌ ID d'entreprise invalide")
    except KeyboardInterrupt:
        print("\n⚠️  Opération annulée")