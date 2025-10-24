#!/usr/bin/env python3
"""Script pour créer un utilisateur de test"""

from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db import models
from app.core.security import get_password_hash

def create_test_user():
    db: Session = SessionLocal()
    
    try:
        # Vérifier si l'utilisateur existe déjà
        existing_user = db.query(models.User).filter(models.User.email == "admin@techcorp.com").first()
        if existing_user:
            print("[OK] Utilisateur admin@techcorp.com existe deja")
            return
        
        # Vérifier s'il y a une entreprise
        company = db.query(models.Company).first()
        if not company:
            # Créer une entreprise de test
            company = models.Company(
                name="TechCorp",
                email="admin@techcorp.com",
                plan="premium",
                max_employees=-1,
                is_active=True
            )
            db.add(company)
            db.commit()
            db.refresh(company)
            print("[OK] Entreprise TechCorp creee")
        
        # Créer l'utilisateur de test
        hashed_password = get_password_hash("NovaCore123")
        test_user = models.User(
            email="admin@techcorp.com",
            hashed_password=hashed_password,
            first_name="Admin",
            last_name="Test",
            role="employer",
            company_id=company.id,
            is_active=True
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print("[OK] Utilisateur de test cree:")
        print(f"   Email: admin@techcorp.com")
        print(f"   Password: NovaCore123")
        print(f"   Role: employer")
        
    except Exception as e:
        print(f"[ERREUR] Erreur: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()